import React, { useState } from 'react';
import ProfileForm from './components/ProfileForm';
import JobCard from './components/JobCard';
import Header from './components/Comp/Header';
import Footer from './components/Comp/Footer';
import './App.css';

const App = () => {
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRecommendationsFetched = (jobs) => {
    setLoading(true);
    setError(null);
    setRecommendedJobs(jobs || []);
    setLoading(false);
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

export default App;
