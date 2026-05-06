import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function MyApplications() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => ({
    pending:  { bg: '#fef9c3', text: '#ca8a04' },
    accepted: { bg: '#dcfce7', text: '#16a34a' },
    rejected: { bg: '#fee2e2', text: '#dc2626' }
  }[status] || { bg: '#f3f4f6', text: '#6b7280' });

  if (loading) return <p style={styles.center}>Loading your applications...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Applications</h2>
      <p style={styles.subtitle}>Track the status of every job you've applied to</p>

      {applications.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>📭</p>
          <p style={styles.emptyText}>You haven't applied to any jobs yet.</p>
          <button style={styles.browseBtn} onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {applications.map(app => {
            const colors = statusColor(app.status);
            return (
              <div key={app._id} style={styles.card}>
                <div style={styles.cardLeft}>
                  <div style={styles.iconBox}>💼</div>
                  <div>
                    <h3 style={styles.jobTitle}>{app.job?.title || 'Job removed'}</h3>
                    <p style={styles.jobMeta}>
                      {app.job?.company && `${app.job.company} · `}
                      {app.job?.location}
                    </p>
                    <p style={styles.appliedOn}>
                      Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <span style={{
                  ...styles.badge,
                  backgroundColor: colors.bg,
                  color: colors.text
                }}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '760px', margin: '0 auto', padding: '2rem 1rem' },
  title: { fontSize: '1.5rem', fontWeight: '600', marginBottom: '4px' },
  subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '1.1rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px' },
  iconBox: {
    width: '42px', height: '42px',
    backgroundColor: '#ede9fe',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px'
  },
  jobTitle: { fontSize: '15px', fontWeight: '500', marginBottom: '2px' },
  jobMeta: { fontSize: '13px', color: '#4f46e5', marginBottom: '2px' },
  appliedOn: { fontSize: '12px', color: '#9ca3af' },
  badge: {
    fontSize: '12px', fontWeight: '500',
    padding: '4px 12px', borderRadius: '20px',
    whiteSpace: 'nowrap'
  },
  emptyBox: {
    textAlign: 'center', padding: '4rem 2rem',
    backgroundColor: '#fff', borderRadius: '10px',
    border: '1px solid #e5e7eb'
  },
  emptyIcon: { fontSize: '40px', marginBottom: '12px' },
  emptyText: { color: '#6b7280', marginBottom: '1rem' },
  browseBtn: {
    padding: '8px 20px', backgroundColor: '#4f46e5',
    color: '#fff', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px'
  },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' }
};

export default MyApplications;