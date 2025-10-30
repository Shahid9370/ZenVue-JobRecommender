import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ProfileForm from './components/ProfileForm';
import JobCard from './components/JobCard';
import Header from './components/Comp/Header';
import Footer from './components/Comp/Footer';

// 👇 Resume Tool import
//import { ResumeUploader, ResumeParser, ResumeGenerator } from './components/ResumeTool';

import './App.css';

const JobRecommendationPage = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommendationsFetched = (jobs) => {
    setLoading(true);
    setError(null);

    // simulate async
    setTimeout(() => {
      setRecommendedJobs(jobs || []);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="app-container">
      <Header />
      <ProfileForm onRecommendationsFetched={handleRecommendationsFetched} />

      {loading && <p className="loading">⏳ Loading recommendations...</p>}
      {error && <p className="error">{error}</p>}

      {recommendedJobs.length > 0 ? (
        <div className="jobs-container">
          {recommendedJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      ) : (
        !loading && !error && <p className="no-jobs">No job recommendations available</p>
      )}

      <Footer />
    </div>
  );
};

const ResumeToolPage = () => (
  <div className="app-container">
    <Header />
    <h1>Resume Tools</h1>
   // <ResumeUploader />
    //<ResumeParser />
   // <ResumeGenerator />
    <Footer />
  </div>
);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<JobRecommendationPage />} />
      {/* 👇 New Route for Resume Tool */}
      <Route path="/resume-tool" element={<ResumeToolPage />} />
    </Routes>
  </Router>
);

export default App;
