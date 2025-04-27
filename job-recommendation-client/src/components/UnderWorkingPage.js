import React, { useState } from 'react';
import 'job-recommendation-client/src/css/UnderWorkingPage.css';  // Create this CSS file for styling and animations

const UnderWorkingPage = () => {
  const [showMessage, setShowMessage] = useState(false);

  // Handle the button click
  const handleButtonClick = () => {
    setShowMessage(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Job Recommendation System</h1>
      </header>
      
      <main className="main-content">
        <button className="start-btn" onClick={handleButtonClick}>
          Check ATS
        </button>

        {showMessage && (
          <div className="under-working-message">
            <h2>Feature Under Development</h2>
            <div className="loading-animation">Please bear with us...</div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Zenvue. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UnderWorkingPage;
