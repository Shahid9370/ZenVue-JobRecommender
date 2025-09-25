import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../css/ProfileForm.css';

const ProfileForm = ({ onRecommendationsFetched }) => {
  const [skills, setSkills] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [fileName, setFileName] = useState('');
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const fileInputRef = useRef(null);
  const skillsRef = useRef(null);

  // Auto-focus skills and show popup on page load
  useEffect(() => {
    if (skillsRef.current) {
      skillsRef.current.focus();
    }
    // Show popup on page load/refresh
    setShowPopup(true);
    // Auto-hide popup after 5 seconds
    const timer = setTimeout(() => setShowPopup(false), 5000);
    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setMessage('');
      setMessageType('');
    } else {
      setFile(null);
      setFileName('');
      setMessage('Please upload a PDF file only!');
      setMessageType('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills && !location && !file) {
      setMessage('Please fill at least one field or upload a PDF resume!');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('userSkills', skills);
    formData.append('location', location);
    formData.append('salaryRange', salaryRange);
    if (file) formData.append('resume', file);

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.post('http://localhost:5000/api/recommend', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onRecommendationsFetched(response.data.jobs);
      setMessage('Recommendations fetched successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Error fetching recommendations. Try again!');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className="form-title">Get AI-powered Job Matches</h2>

        {message && (
          <div className={`message ${messageType}`} role="alert">
            {messageType === 'success' ? '✓ ' : '✗ '} {message}
          </div>
        )}

        <div className="fields-grid">
          <div className="field-group">
            <label htmlFor="skills" className={`label ${skills ? 'active' : ''}`}>
              Skills
            </label>
            <input
              ref={skillsRef}
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={`input ${!skills && message && !location && !file ? 'error' : ''}`}
            />
          </div>

          <div className="field-group">
            <label htmlFor="location" className={`label ${location ? 'active' : ''}`}>
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`input ${!location && message && !skills && !file ? 'error' : ''}`}
            />
          </div>

          <div className="field-group">
            <label htmlFor="salary" className={`label ${salaryRange ? 'active' : ''}`}>
              Salary Range (Optional)
            </label>
            <input
              id="salary"
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              
              className="input"
            />
          </div>

          <div className="field-group">
            <div className="label-container">
              <label htmlFor="resume" className={`resume ${file ? 'active' : ''}`}>
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10,9 9,9 8,9" />
                </svg>
                Upload Resume (Optional)
              </label>
              <button
                type="button"
                className="info-button"
                onClick={togglePopup}
                aria-label="Learn more about AI resume analysis"
              >
                <svg
                  className="info-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v.01M12 8v4" />
                </svg>
              </button>
            </div>
            {showPopup && (
              <div className="popup-message" role="dialog" aria-live="polite">
                AI generates personalized job matches after uploading your resume
                <button
                  type="button"
                  className="popup-close"
                  onClick={() => setShowPopup(false)}
                  aria-label="Close popup"
                >
                  <svg
                    className="close-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div
              className={`upload-area ${file ? 'active' : ''}`}
              onClick={triggerFileInput}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
            >
              <span className="upload-text">{fileName || 'Click to upload PDF'}</span>
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
          </div>
        </div>

        <button type="submit" className={`submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            <>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Find My Jobs
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;