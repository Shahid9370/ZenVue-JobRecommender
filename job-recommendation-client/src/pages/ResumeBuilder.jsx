import React, { useEffect, useRef, useState } from "react";

/**
 * ResumeBuilder.jsx
 * - Modern, recruiter-friendly resume upload UI using Tailwind CSS
 * - Features: hero, validated form, file preview, gradient CTAs, success toast, subtle animations
 *
 * Drop this file in src/components and ensure the CSS additions (below) are appended to src/index.css
 */

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const prevUrlRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup object URL and toast timer
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!title.trim()) e.title = "Professional title is required";
    if (!file) e.file = "Please upload a resume (PDF or DOC)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    // basic validation: type + size (max 6MB)
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = f.name.slice(((f.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
    const okExt = allowed.some((a) => a.replace(".", "") === ext);
    if (!okExt) {
      setErrors((prev) => ({ ...prev, file: "Only PDF, DOC and DOCX are accepted" }));
      return;
    }
    if (f.size > 6_000_000) {
      setErrors((prev) => ({ ...prev, file: "File is too large (max 6MB)" }));
      return;
    }

    // clear previous error and create preview
    setErrors((prev) => ({ ...prev, file: undefined }));
    setFile(f);
    setFileName(f.name);

    // revoke old URL
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    const url = URL.createObjectURL(f);
    prevUrlRef.current = url;
    setPreviewUrl(url);
  }

  function clearFile() {
    setFile(null);
    setFileName("");
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      // scroll to first error field lightly
      const first = document.querySelector(".error-field");
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSaving(true);
    setErrors({});
    // Simulate upload / save delay
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      // auto-hide toast
      toastTimerRef.current = setTimeout(() => setShowToast(false), 3500);
    }, 900);
  }

  function onReset() {
    setName("");
    setTitle("");
    setSummary("");
    clearFile();
    setErrors({});
  }

  return (
    <div className="resume-page max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <header className="mb-6 fade-up">
        <div className="flex items-start gap-4">
          <div className="icon-wrap flex-none rounded-md bg-gradient-to-br from-blue-600 to-purple-600 text-white w-12 h-12 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path d="M12 3v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Resume Builder</h1>
            <p className="mt-1 text-gray-600 max-w-2xl">
              Upload your resume or create one quickly. Recruiter-friendly, previewable, and ready for applications.
            </p>
          </div>
        </div>
      </header>

      {/* Form card */}
      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 fade-up">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-2 block w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-300" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition`}
              placeholder="Jane Doe"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
              data-testid="input-name"
            />
            {errors.name && <div id="error-name" className="mt-1 text-xs text-red-600 error-field">{errors.name}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Professional title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-2 block w-full px-4 py-3 rounded-lg border ${errors.title ? "border-red-300" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-indigo-100 transition`}
              placeholder="Frontend Engineer"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "error-title" : undefined}
              data-testid="input-title"
            />
            {errors.title && <div id="error-title" className="mt-1 text-xs text-red-600 error-field">{errors.title}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows="5"
              className="mt-2 block w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="Brief summary about your experience, skills, and what you're looking for..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload resume (PDF, DOC, DOCX)</label>

            <div className="mt-3 flex items-center gap-4">
              <label
                htmlFor="file"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:shadow-sm cursor-pointer transition"
              >
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M12 3v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 7l4-4 4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm text-gray-700">Choose file</span>
                <input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileChange}
                  className="sr-only"
                />
              </label>

              <div className="text-sm text-gray-600">{fileName || "No file chosen"}</div>

              {file && (
                <button type="button" onClick={clearFile} className="ml-auto text-sm text-red-600 hover:underline">
                  Remove
                </button>
              )}
            </div>

            {errors.file && <div className="mt-2 text-xs text-red-600 error-field">{errors.file}</div>}

            {previewUrl && (
              <div className="mt-4 border border-gray-100 rounded-lg bg-gray-50 p-3 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">{fileName}</div>
                  <div className="text-xs text-gray-500">Uploaded file preview (local)</div>
                </div>

                <div className="flex items-center gap-3">
                  <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                    View file
                  </a>
                  <a
                    href={previewUrl}
                    download={fileName}
                    className="hidden sm:inline-flex items-center px-3 py-1.5 bg-gray-100 text-sm rounded-md border hover:bg-gray-200"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition inline-flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.2" />
                    <path d="M22 12a10 10 0 00-10-10" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Resume"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success toast */}
      <div
        aria-live="polite"
        className={`fixed right-6 bottom-6 z-50 transition-transform transform ${showToast ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}
      >
        <div className="max-w-xs w-full bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            <div className="flex-none w-10 h-10 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M20 6L9 17l-5-5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">Resume saved successfully</div>
              <div className="text-xs text-gray-500">Your resume is ready for applications.</div>
            </div>

            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-md"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}