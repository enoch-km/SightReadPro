import React, {useState, useEffect} from 'react';

const AppFinal = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  useEffect(() => {
    console.log('🎵 AppFinal component mounted!');
  }, []);

  const handleStartApp = () => {
    console.log('🚀 Starting app...');
    setCurrentScreen('dashboard');
  };

  const handleBackToWelcome = () => {
    console.log('⬅️ Going back to welcome...');
    setCurrentScreen('welcome');
  };

  const renderWelcomeScreen = () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Logo */}
      <div style={{
        marginBottom: '40px',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          fontSize: '60px'
        }}>
          ♪
        </div>
      </div>

      {/* App Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '60px',
        animation: 'fadeInUp 0.8s ease-out 0.3s both'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0 0 10px 0',
          textAlign: 'center'
        }}>
          SightReadPro
        </h1>
        <p style={{
          fontSize: '18px',
          margin: '0',
          opacity: '0.9',
          lineHeight: '24px'
        }}>
          Master sight-reading with fun, daily exercises
        </p>
      </div>

      {/* Start Button */}
      <div style={{
        width: '100%',
        maxWidth: '300px',
        marginBottom: '40px',
        animation: 'fadeInUp 0.8s ease-out 0.6s both'
      }}>
        <button
          onClick={handleStartApp}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #4CAF50, #45a049)',
            border: 'none',
            borderRadius: '25px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '18px 30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Start Practicing →
        </button>
      </div>

      {/* Features */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '400px',
        animation: 'fadeInUp 0.8s ease-out 0.9s both'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>📈</div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>Track Progress</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>🔥</div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>Build Streaks</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>⭐</div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>Earn XP</div>
        </div>
      </div>
    </div>
  );

  const renderDashboardScreen = () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box',
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '28px', margin: '0' }}>Dashboard</h1>
        <button
          onClick={handleBackToWelcome}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '20px',
            color: 'white',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>150</div>
          <div style={{ fontSize: '14px', opacity: '0.8' }}>XP Points</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>5</div>
          <div style={{ fontSize: '14px', opacity: '0.8' }}>Day Streak</div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '15px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>Level 2</div>
          <div style={{ fontSize: '14px', opacity: '0.8' }}>Current Level</div>
        </div>
      </div>

      {/* Practice Button */}
      <button
        onClick={() => alert('Practice feature coming soon!')}
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #4CAF50, #45a049)',
          border: 'none',
          borderRadius: '25px',
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '18px 30px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        Start Today's Practice
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        #root {
          margin: 0;
          padding: 0;
        }
      `}</style>
      {currentScreen === 'welcome' ? renderWelcomeScreen() : renderDashboardScreen()}
    </>
  );
};

export default AppFinal;




