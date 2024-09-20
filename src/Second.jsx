import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Create this CSS file to include your styles

const Second = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);
  const navigate = useNavigate(); // Hook to navigate

  const selectOption = (option) => {
    setSelectedOption(option);
    setIsContinueEnabled(true);
  };

  const handleContinueClick = () => {
    if (isContinueEnabled) {
      //window.location.href = 'https://ai.visheshpandey.com/';
      navigate('/chat');
    }
  };

  const handleBackClick = () => {
   // window.location.href = 'main.html';
    navigate('/');
  };

  return (
    <div>
      <header className="navbar">
        <div className="profile-icon">
          <img src="profile.png" alt="Profile Icon" />
        </div>
        <h1 className="title">Judicial Assistant</h1>
        <div className="menu-icon">
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
          <div className="menu-bar"></div>
        </div>
      </header>

      <main className="content">
        <h2>Welcome to Judicial Assistant</h2>
        <p>Select category of proceeding</p>
        <div className="steps">Step 2/3</div>

        <div className="options">
          {[
            'Murder',
            'Theft & Robbery',
            'Assault',
            'Sexual Offence',
            'Property Dispute',
            'Corruption',
            'Consumer Protection',
            'Family Disputes',
            'Other',
            'Intellectual Property Rights',
          ].map(option => (
            <button
              key={option}
              className={`option-button ${selectedOption === option ? 'active' : ''}`}
              onClick={() => selectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="navigation">
          <button className="nav-button" id="back-button" onClick={handleBackClick}>
            Go Back
          </button>
          <button
            className={`nav-button ${isContinueEnabled ? 'enabled' : ''}`}
            id="continue-button"
            onClick={handleContinueClick}
            disabled={!isContinueEnabled}
          >
            Continue
          </button>
        </div>
      </main>
    </div>
  );
};

export default Second;
