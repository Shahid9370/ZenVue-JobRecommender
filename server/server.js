/**
 * server/server.js — improved PDF support (pdftotext CLI first) + pdf-parse + pdfjs + OCR fallback
 *
 * Strategy:
 * 1) If pdftotext (poppler) CLI is available, use it first (best for many generated PDFs).
 * 2) If pdftotext isn't present or returns little text, try pdf-parse.
 * 3) If pdf-parse yields little, try pdfjs-dist (if installed).
 * 4) If still little and OCR enabled, fallback to tesseract.js OCR.
 *
 * Install / setup:
 * - Recommended (fastest & most reliable text extraction for many PDFs):
 *     Install poppler (pdftotext):
 *       Windows (with Chocolatey): choco install poppler
 *       Windows (manual): https://blog.alivate.com.au/poppler-windows/
 *       macOS (Homebrew): brew install poppler
 *       Linux (apt): sudo apt-get install poppler-utils
 *
 * - Node deps (inside server/):
 *     npm install pdf-parse mammoth multer express cors string-similarity pdfjs-dist tesseract.js
 *
 * - Restart server:
 *     npm start
 *
 * Notes:
 * - pdftotext is a native CLI; it is usually the most reliable for text PDFs.
 * - OCR is only used when text is insufficient; it's slow and CPU intensive.
 */

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const stringSimilarity = require("string-similarity");
const { jobs } = require("./jobs-data");

const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const { execFile } = require("child_process");
const util = require("util");
const execFileP = util.promisify(execFile);

let pdfjsLib = null;
try {
  pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
  console.log("pdfjs-dist loaded (pdfjs fallback available).");
} catch (e) {
  try {
    const pkg = require("pdfjs-dist");
    pdfjsLib = pkg && pkg.getDocument ? pkg : null;
    if (pdfjsLib) console.log("pdfjs-dist loaded via main package export.");
  } catch (e2) {
    console.warn("pdfjs-dist not available — pdfjs fallback disabled.");
    pdfjsLib = null;
  }
}

// tesseract.js OCR worker (lazy init)
let ocrWorker = null;
let ocrInitializing = null;
async function initOcrWorker() {
  if (ocrWorker) return;
  if (ocrInitializing) return ocrInitializing;
  const { createWorker } = require("tesseract.js");
  const worker = createWorker({
    logger: (m) => {
      if (m && m.status) console.log("TESS:", m);
    },
  });
  ocrInitializing = (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    ocrWorker = worker;
    ocrInitializing = null;
    console.log("Tesseract worker initialized");
  })();
  return ocrInitializing;
}
async function runOcr(buffer) {
  await initOcrWorker();
  if (!ocrWorker) return "";
  try {
    const { data } = await ocrWorker.recognize(buffer);
    return data && data.text ? String(data.text) : "";
  } catch (err) {
    console.warn("OCR failed:", err && err.message ? err.message : err);
    return "";
  }
}
async function disposeOcrWorker() {
  try {
    if (ocrWorker) {
      await ocrWorker.terminate();
      ocrWorker = null;
    }
  } catch (e) {}
}
process.on("exit", disposeOcrWorker);
process.on("SIGINT", () => {
  disposeOcrWorker().finally(() => process.exit(0));
});
process.on("SIGTERM", () => {
  disposeOcrWorker().finally(() => process.exit(0));
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 30 * 1024 * 1024 } });
const app = express();
app.use(cors());
app.use(express.json());

// config
const PDF_TEXT_MINIMUM = 140; // threshold to consider extraction successful
const OCR_ENABLED = true;
const PDFTOTEXT_TIMEOUT_MS = 10000; // pdftotext timeout

// helpers
function normalizeText(text) {
  if (!text) return "";
  return text
    .toString()
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[^\w\s\-\+#.]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

// pdftotext (poppler) extraction: writes temp file, calls pdftotext -layout -enc UTF-8 file -  -> stdout
async function extractWithPdftotext(buffer) {
  const tmpDir = os.tmpdir();
  const pdfPath = path.join(tmpDir, `resume_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.pdf`);
  try {
    await fs.writeFile(pdfPath, buffer);
    // pdftotext arguments: -layout keeps layout which often helps readability; output '-' to write to stdout
    const args = ["-layout", "-enc", "UTF-8", pdfPath, "-"];
    const opts = { timeout: PDFTOTEXT_TIMEOUT_MS, maxBuffer: 20 * 1024 * 1024 };
    const { stdout } = await execFileP("pdftotext", args, opts);
    if (stdout && stdout.toString) return stdout.toString();
    return "";
  } catch (err) {
    // if pdftotext not found or failed, log and return empty
    if (err && err.code === "ENOENT") {
      console.warn("pdftotext not found on PATH.");
    } else {
      console.warn("pdftotext failed:", err && err.message ? err.message : err);
    }
    return "";
  } finally {
    // best-effort cleanup
    try {
      await fs.unlink(pdfPath);
    } catch (e) {}
  }
}

// pdfjs fallback extractor (if available)
async function extractTextWithPdfJs(buffer) {
  if (!pdfjsLib) return "";
  try {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const doc = await loadingTask.promise;
    let fullText = "";
    for (let p = 1; p <= doc.numPages; p++) {
      const page = await doc.getPage(p);
      const content = await page.getTextContent();
      // sometimes items include unicode or empty; join safely
      const pageText = content.items.map((it) => (it && it.str ? it.str : "")).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  } catch (err) {
    console.warn("pdfjs fallback failed:", err && err.message ? err.message : err);
    return "";
  }
}

// central extractor
async function extractTextFromFile(file) {
  const name = (file.originalname || "").toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();

  const isPdf = mime === "application/pdf" || name.endsWith(".pdf");
  const isDocx =
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx");

  if (!isPdf && !isDocx) {
    const err = new Error(`Unsupported file type. Upload only PDF (.pdf) or DOCX (.docx). Detected: ${file.mimetype || file.originalname}`);
    err.status = 415;
    throw err;
  }

  if (isDocx) {
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      const txt = result.value || "";
      console.log(`DOCX extraction length=${txt.length}`);
      return txt;
    } catch (err) {
      throw new Error(`DOCX extraction failed: ${err && err.message ? err.message : String(err)}`);
    }
  }

  // PDF path: try pdftotext first (if installed)
  try {
    const pdftxt = await extractWithPdftotext(file.buffer);
    console.log(`pdftotext extracted length=${(pdftxt && pdftxt.trim().length) || 0}`);
    if (pdftxt && pdftxt.trim().length >= PDF_TEXT_MINIMUM) {
      console.log("Using pdftotext result");
      return pdftxt;
    }
  } catch (err) {
    console.warn("pdftotext attempt failed:", err && err.message ? err.message : err);
  }

  // Next try pdf-parse (fast)
  let pdfParseText = "";
  try {
    const data = await pdfParse(file.buffer);
    pdfParseText = data && data.text ? data.text : "";
    console.log(`pdf-parse extracted length=${pdfParseText.trim().length}`);
    if (pdfParseText && pdfParseText.trim().length >= PDF_TEXT_MINIMUM) {
      console.log("Using pdf-parse result");
      return pdfParseText;
    }
  } catch (err) {
    console.warn("pdf-parse threw error:", err && err.message ? err.message : err);
    pdfParseText = "";
  }

  // Then try pdfjs fallback (if available)
  if (pdfjsLib) {
    try {
      const pdfJsText = await extractTextWithPdfJs(file.buffer);
      console.log(`pdfjs extracted length=${pdfJsText.trim().length}`);
      if (pdfJsText && pdfJsText.trim().length >= PDF_TEXT_MINIMUM) {
        console.log("Using pdfjs result");
        return pdfJsText;
      }
      // keep pdfJsText as candidate if others empty
      if (pdfJsText && pdfJsText.trim().length > pdfParseText.trim().length) {
        pdfParseText = pdfJsText;
      }
    } catch (err) {
      console.warn("pdfjs attempt failed:", err && err.message ? err.message : err);
    }
  }

  // OCR fallback (only if enabled)
  if (OCR_ENABLED) {
    console.log("Falling back to OCR (Tesseract) for PDF");
    try {
      const ocrText = await runOcr(file.buffer);
      console.log(`OCR extracted length=${(ocrText && ocrText.trim().length) || 0}`);
      if (ocrText && ocrText.trim().length > 0) return ocrText;
    } catch (err) {
      console.warn("OCR fallback failed:", err && err.message ? err.message : err);
    }
  }

  // otherwise return best we have (pdf-parse or pdfjs)
  return pdfParseText || "";
}

/* -------------------------
   Matching & skill extraction — keep as you had it
   (I keep this unchanged for brevity; replace with your version if you prefer)
   ------------------------- */

const COMMON_SKILLS = [
  "react", "javascript", "typescript", "node", "node.js", "nodejs", "express", "mongodb", "mysql", "postgres",
  "python", "django", "flask", "aws", "azure", "gcp", "docker", "kubernetes", "sql", "html", "css", "graphql",
  "rest", "api", "microservices", "redux", "nextjs", "vite", "webpack", "git", "linux", "selenium", "pytest",
  "tensorflow", "pytorch", "machine learning", "data science", "figma", "ux", "seo", "c#", "c++", "java", "spring"
];

const SYNONYMS = {
  mern: ["mongodb", "express", "react", "node.js"],
  mean: ["mongodb", "express", "angular", "node.js"],
  fullstack: ["react", "node.js", "mongodb", "sql"],
  js: ["javascript"],
  "node.js": ["node", "nodejs"],
  ml: ["machine learning"],
  "machine learning": ["ml"],
  sql: ["postgres", "mysql"],
};

function normalizeSimple(text) {
  return normalizeText(text);
}

function expandSkills(skills) {
  const set = new Set();
  for (const s of skills) {
    const n = s.toLowerCase();
    set.add(n);
    if (SYNONYMS[n]) for (const ex of SYNONYMS[n]) set.add(ex);
    for (const [k, arr] of Object.entries(SYNONYMS)) if (arr.includes(n)) set.add(k);
  }
  return Array.from(set);
}

function parseSkillLine(line, foundSet) {
  if (!line || !foundSet) return;
  let cleaned = line.replace(/^[\d\.\)\-]+\s*/, "").trim();
  const parts = cleaned.split(/[,;|\/•·]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    const tokens = cleaned.split(/\s+/).map((t) => t.trim()).filter(Boolean);
    for (const tok of tokens) addIfSkillLike(tok, foundSet);
  } else {
    for (const part of parts) addIfSkillLike(part, foundSet);
  }
}

function addIfSkillLike(token, foundSet) {
  if (!token) return;
  const t = token.toLowerCase().replace(/[().]/g, "").trim();
  const stopwords = new Set(["and", "with", "experience", "years", "year", "skills", "skill", "responsibilities"]);
  if (stopwords.has(t) || t.length < 2) return;
  if (!/[a-z0-9+#.+-]/i.test(t)) return;
  if (t === "js") foundSet.add("javascript");
  else if (t === "ts") foundSet.add("typescript");
  else if (t === "mern") {
    for (const s of SYNONYMS.mern) foundSet.add(s);
  } else if (t === "node" || t === "nodejs") foundSet.add("node.js");
  else if (t === "ml") foundSet.add("machine learning");
  else {
    const cleaned = t.replace(/[^a-z0-9+#.+-]/g, "");
    foundSet.add(cleaned);
  }
}

function extractSkillsFromText(text) {
  if (!text) return [];
  const raw = text.replace(/\r\n/g, "\n");
  const normalized = normalizeSimple(raw);
  const lines = raw.split(/\r?\n/).map((l) => l.trim());
  const found = new Set();

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].toLowerCase();
    if (/^\s*(skills|technical skills|skill set|skillset|core skills|tech skills)\s*[:\-]?\s*$/i.test(l)) {
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const next = lines[j].trim();
        if (!next) break;
        if (/^[A-Z\s]{2,}$/.test(next) && next.length < 40) break;
        parseSkillLine(next, found);
      }
    }
    const inlineMatch = l.match(/skills?\s*[:\-]\s*(.+)/i);
    if (inlineMatch && inlineMatch[1]) parseSkillLine(inlineMatch[1], found);
  }

  for (const line of lines) {
    if (/^\s*[\-\u2022\*]\s+/.test(line)) parseSkillLine(line.replace(/^[\-\u2022\*]\s+/, ""), found);
  }

  for (const skill of COMMON_SKILLS) {
    const token = skill.toLowerCase();
    if (normalized.includes(token)) {
      if (token === "node" || token === "nodejs" || token === "node.js") found.add("node.js");
      else if (token === "ml") found.add("machine learning");
      else found.add(token);
    }
  }

  if (normalized.includes("mern")) for (const s of SYNONYMS.mern) found.add(s);
  if (normalized.includes("mean")) for (const s of SYNONYMS.mean) found.add(s);

  const expanded = expandSkills(Array.from(found));
  return expanded;
}

function extractYearsExperience(text) {
  if (!text) return null;
  const re = /(\d{1,2})\+?\s*(?:years|yrs|year)/gi;
  const matches = [];
  let m;
  while ((m = re.exec(text))) {
    const n = parseInt(m[1], 10);
    if (!Number.isNaN(n)) matches.push(n);
  }
  if (matches.length === 0) return null;
  return Math.max(...matches);
}

function jobToDocument(job) {
  const parts = [];
  if (job.title) parts.push(job.title);
  if (job.company) parts.push(job.company);
  if (job.category) parts.push(job.category);
  if (job.tags && Array.isArray(job.tags)) parts.push(job.tags.join(" "));
  if (job.description) parts.push(job.description);
  if (job.location) parts.push(job.location);
  return normalizeSimple(parts.join(" "));
}

function jobSeniorityRequirement(title = "") {
  const t = (title || "").toLowerCase();
  if (t.includes("principal") || t.includes("staff") || t.includes("lead")) return 6;
  if (t.includes("senior") || t.includes("sr") || t.includes("sr.")) return 4;
  if (t.includes("mid") || t.includes("experienced")) return 2;
  if (t.includes("junior") || t.includes("jr") || t.includes("associate") || t.includes("entry")) return 0;
  return 2;
}

function computeMatchCombined(resumeDoc, candidateSkills = [], yearsExp = null, job) {
  const jobDoc = jobToDocument(job);
  const semanticScore = stringSimilarity.compareTwoStrings(resumeDoc, jobDoc); // 0..1

  const jobTags = (job.tags || []).map((t) => normalizeSimple(t));
  const candidateLower = candidateSkills.map((s) => normalizeSimple(s));
  const matchedSkillCount = jobTags.reduce((acc, tag) => acc + (candidateLower.includes(tag) ? 1 : 0), 0);
  const skillCoverage = jobTags.length > 0 ? matchedSkillCount / jobTags.length : 0;

  let titleBoost = 0;
  const titleTokens = normalizeSimple(job.title || "").split(" ").filter((t) => t.length > 2);
  for (const tok of titleTokens) if (resumeDoc.includes(tok)) titleBoost += 0.03;
  titleBoost = Math.min(0.25, titleBoost);

  const requiredYears = jobSeniorityRequirement(job.title);
  let expScore = 1;
  if (yearsExp === null) expScore = 0.9;
  else if (yearsExp >= requiredYears) expScore = 1.0;
  else expScore = Math.max(0, yearsExp / requiredYears);

  const WEIGHT_SEMANTIC = 0.55;
  const WEIGHT_SKILLS = 0.30;
  const WEIGHT_EXP = 0.10;
  const WEIGHT_TITLE = 0.05;

  const combined =
    WEIGHT_SEMANTIC * semanticScore +
    WEIGHT_SKILLS * skillCoverage +
    WEIGHT_EXP * expScore +
    WEIGHT_TITLE * titleBoost;

  return {
    matchPercent: Math.round(Math.max(0, Math.min(1, combined)) * 100),
    debug: { semanticScore, skillCoverage, expScore, titleBoost, combined, matchedSkillCount },
  };
}

// POST /api/resume-match
app.post("/api/resume-match", upload.single("resume"), async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "20", 10)));
    const minScore = Math.max(0, Math.min(100, parseInt(req.query.minScore || "0", 10)));
    const debug = req.query.debug === "1" || req.query.debug === "true";

    if (!req.file) return res.status(400).json({ error: "Missing resume file (field 'resume')" });

    console.log("Received resume:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      sizeKb: Math.round((req.file.size || 0) / 1024),
    });

    const rawText = await extractTextFromFile(req.file);

    if (!rawText || rawText.trim().length === 0) {
      return res.status(422).json({
        error:
          "Could not extract text from the uploaded file. If this is a scanned (image) PDF, OCR was attempted but failed. " +
          "Try uploading DOCX or a searchable PDF, or install poppler (pdftotext) for better PDF support.",
      });
    }

    console.log("Extracted text length:", rawText.trim().length);

    const resumeDoc = normalizeSimple(rawText || "");
    const candidateSkills = extractSkillsFromText(rawText || "");
    const years = extractYearsExperience(rawText || null);

    console.log("Candidate extracted:", { years, candidateSkills });

    const scored = jobs.map((job) => {
      const { matchPercent, debug: dbg } = computeMatchCombined(resumeDoc, candidateSkills, years, job);
      return { job, matchPercent, debug: dbg };
    });

    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    let filtered = scored.filter((s) => s.matchPercent >= minScore).slice(0, limit);

    if (filtered.length === 0 && scored.length > 0) filtered = scored.slice(0, Math.min(limit, 10));

    const response = { matches: filtered.map((r) => (debug ? r : { job: r.job, matchPercent: r.matchPercent })) };
    return res.json(response);
  } catch (err) {
    console.error("Resume match failed:", err && err.stack ? err.stack : err);
    const status = err && err.status ? err.status : 500;
    const msg = err && err.message ? err.message : "Failed to process resume";
    return res.status(status).json({ error: msg });
  }
});

// health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Resume match server running on port ${PORT}`);
  console.log(`POST /api/resume-match (multipart/form-data field 'resume')`);
});