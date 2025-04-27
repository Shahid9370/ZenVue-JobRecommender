import React, { useState, useRef } from 'react';
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
  const fileInputRef = useRef(null);

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

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">🔍 Find Your Ideal Job</h2>
      {message && <p className={`message ${messageType}`}>{message}</p>}
      <div className="form-group">
        <label className="form-label">💼 Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g., React, Node.js, Python"
          className={`input-field ${!skills && message && !location && !file ? 'shake' : ''}`}
        />
      </div>
      <div className="form-group">
        <label className="form-label">📍 Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Pune, Mumbai, Remote"
          className={`input-field ${!location && message && !skills && !file ? 'shake' : ''}`}
        />
      </div>
      <div className="form-group">
        <label className="form-label">💰 Salary Range (Optional)</label>
        <input
          type="text"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          placeholder="e.g., ₹50,000-₹100,000"
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label className="form-label">📄 Upload Resume (Optional)</label>
        <div className={`file-upload ${file ? 'has-file' : ''}`} onClick={triggerFileInput}>
          <span className="file-text">{fileName || 'Click or drag & drop a PDF'}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>
      </div>
      <button type="submit" className={`submit-button ${loading ? 'loading' : ''}`} disabled={loading}>
        {loading ? (
          <span className="spinner"></span>
        ) : (
          '🎯 Get Recommendations'
        )}
      </button>
    </form>
  );
};

export default ProfileForm;