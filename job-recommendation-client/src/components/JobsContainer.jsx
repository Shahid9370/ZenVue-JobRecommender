import React from 'react';
import JobCard from './JobCard';
import '../css/JobCard.css';

const JobsContainer = ({ jobs }) => {
  return (
    <div className="jobs-container">
      {jobs.map((job, index) => (
        <JobCard key={index} job={job} />
      ))}
    </div>
  );
};

export default JobsContainer;
