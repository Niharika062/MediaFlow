import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/upload');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>MediaFlow</h2>
        <p style={{ color: '#888' }}>Create an account</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleRegister} style={styles.form}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' },
  card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '360px' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
  button: { padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' },
};