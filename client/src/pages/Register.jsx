import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // updates the right field when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/login'); // redirect to login after successful register
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* role selector */}
          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="candidate">I'm looking for a job</option>
            <option value="recruiter">I'm hiring</option>
          </select>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.4rem',
    fontWeight: '500'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#d97706',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '4px'
  },
  error: {
    color: '#dc2626',
    fontSize: '13px',
    marginBottom: '12px'
  },
  link: {
    marginTop: '1rem',
    fontSize: '13px',
    textAlign: 'center',
    color: '#666'
  }
};

export default Register;