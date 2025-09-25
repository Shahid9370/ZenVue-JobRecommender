import React, { useEffect, useRef } from 'react';
import '../css/JobCard.css';
import './JobsContainer.jsx'

const JobCard = ({ job }) => {
  const matchValueRef = useRef(null);
  
  useEffect(() => {
    // Animate the match score bar on load
    if (matchValueRef.current) {
      setTimeout(() => {
        matchValueRef.current.style.width = `${job.matchScore}%`;
      }, 300);
    }
  }, [job.matchScore]);

  return (
    <div className="job-card">
      <div className="job-header">
        <h3 className="job-title">{job.title}</h3>
        <p className="company-name">{job.company}</p>
        <div className="job-salary">{job.salary}</div>
      </div>
      <div className="job-details">
        <p><i className="fas fa-map-marker-alt">📍</i> {job.location}</p>
        
        <div className="match-indicator">
          <span className="match-label">Match Score</span>
          <div className="match-bar">
            <div 
              ref={matchValueRef} 
              className="match-value" 
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>
      </div>
      <div className="job-footer">
        <button className="apply-btn">Apply Now</button>
      </div>
    </div>
  );
};

export default JobCard;
