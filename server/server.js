
/**
 * server/server.js (improved logging + clearer JSON errors)
 *
 * - Logs file metadata on upload
 * - Returns JSON errors with message so frontend can display them
 * - Catches and logs extraction/matching errors
 *
 *   
 */

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { jobs } = require("./jobs-data");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB (increase if needed)
});

const app = express();
app.use(cors());
app.use(express.json());

const COMMON_SKILLS = [
  "react","javascript","typescript","node","node.js","nodejs","python","aws","docker","kubernetes",
  "sql","postgres","mysql","mongodb","machine learning","ml","django","flask","java","spring",
  "css","html","graphql","rest","microservices","azure","gcp","figma","ux","seo"
];

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

async function extractTextFromFile(file) {
  const mime = file.mimetype || "";
  try {
    if (mime === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      const data = await pdfParse(file.buffer);
      return data.text || "";
    } else if (
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.originalname.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value || "";
    } else {
      // Fallback to utf8
      return file.buffer.toString("utf8");
    }
  } catch (err) {
    // Re-throw with context so caller can log properly
    throw new Error(`Text extraction failed: ${err && err.message ? err.message : String(err)}`);
  }
}

function extractSkills(text) {
  if (!text) return [];
  const t = text.toLowerCase();
  const found = new Set();
  for (const skill of COMMON_SKILLS) {
    if (t.includes(skill)) {
      if (skill === "node" || skill === "nodejs" || skill === "node.js") {
        found.add("node.js");
      } else if (skill === "ml") {
        found.add("machine learning");
      } else {
        found.add(skill);
      }
    }
  }
  return Array.from(found);
}

function jobSeniorityRequirement(title = "") {
  const t = title.toLowerCase();
  if (t.includes("senior") || t.includes("lead") || t.includes("principal")) return 5;
  if (t.includes("mid") || t.includes("experienced") || t.includes("sr.")) return 3;
  if (t.includes("junior") || t.includes("associate") || t.includes("entry")) return 0;
  return 2;
}

function computeMatch(candidateSkills = [], yearsExp = null, job) {
  const jobTags = (job.tags || []).map((t) => t.toLowerCase());
  const jobTitle = (job.title || "").toLowerCase();
  const jobCompany = (job.company || "").toLowerCase();

  const candidateLower = candidateSkills.map((s) => s.toLowerCase());
  const matchedSkillCount = jobTags.reduce((acc, tag) => {
    return acc + (candidateLower.includes(tag) ? 1 : 0);
  }, 0);

  const skillCoverage = jobTags.length > 0 ? matchedSkillCount / jobTags.length : 0;

  const titleMatches =
    candidateLower.reduce((acc, s) => acc + (jobTitle.includes(s) || jobCompany.includes(s) ? 1 : 0), 0) > 0
      ? 1
      : 0;

  const requiredYears = jobSeniorityRequirement(job.title);
  let expScore = 1;
  if (yearsExp === null) {
    expScore = 0.9;
  } else if (yearsExp >= requiredYears) {
    expScore = 1.0;
  } else {
    expScore = Math.max(0, yearsExp / requiredYears);
  }

  const score =
    0.7 * skillCoverage +
    0.1 * titleMatches +
    0.2 * expScore;

  return Math.round(Math.min(100, Math.max(0, score * 100)));
}

// POST /api/resume-match
app.post("/api/resume-match", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing resume file (field name must be 'resume')" });
    }

    // Log file details for debugging
    console.log("Received resume:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      sizeKb: Math.round((req.file.size || 0) / 1024),
    });

    const text = await extractTextFromFile(req.file);
    if (!text || text.trim().length === 0) {
      console.warn("Extracted text is empty for file:", req.file.originalname);
    }

    const years = extractYearsExperience(text);
    const skills = extractSkills(text);

    console.log("Extracted candidate info:", { years, skills });

    // Score jobs
    const scored = jobs.map((job) => {
      const score = computeMatch(skills, years, job);
      return { job, matchPercent: score };
    });

    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    const top = scored.slice(0, 20);

    return res.json({ matches: top });
  } catch (err) {
    console.error("Resume match failed:", err && err.stack ? err.stack : err);
    // Return JSON error message (do not leak stack in production)
    return res.status(500).json({ error: err.message || "Failed to process resume" });
  }
});

// Health check endpoint to verify server running
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Resume match server running on port ${PORT}`);
  console.log(`POST /api/resume-match (multipart/form-data field 'resume')`);
});