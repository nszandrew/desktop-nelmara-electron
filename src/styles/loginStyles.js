// src/styles/loginStyles.js

const styles = {
  container: {
    maxWidth: 400,
    margin: '6rem auto',
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 2
  },
  background: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(-45deg, #037E63, #029B7B, #00C9A7, #025C4A)',
    backgroundSize: '400% 400%',
    animation: 'gradientAnimation 15s ease infinite',
    zIndex: 1
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    color: '#037E63',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.75rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#037E63',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#d00',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  '@keyframes gradientAnimation': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  }
};

export default styles;
