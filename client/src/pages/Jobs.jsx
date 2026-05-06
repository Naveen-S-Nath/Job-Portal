import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Jobs() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    if (!user) { navigate('/login'); return; }
    try {
      await axios.post(
        `http://localhost:5000/api/applications/${jobId}/apply`,
        { coverLetter: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplied(prev => [...prev, jobId]);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* hero — only show when not logged in */}
      {!user && (
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Find your next opportunity</h1>
          <p style={styles.heroSub}>Browse jobs posted by top recruiters across India</p>
        </div>
      )}

      {user && <h2 style={styles.pageTitle}>Browse Jobs</h2>}

      {/* search */}
      <div style={styles.searchRow}>
        <input
          style={styles.search}
          type="text"
          placeholder="🔍  Search by title, company or location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p style={styles.center}>Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: '32px' }}>🔍</p>
          <p style={{ color: '#6b5c3e' }}>No jobs found matching your search.</p>
        </div>
      ) : (
        <>
          <p style={styles.count}>{filtered.length} job{filtered.length !== 1 ? 's' : ''} available</p>
          <div style={styles.grid}>
            {filtered.map(job => (
              <div key={job._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.companyIcon}>
                    {job.company?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.company}>{job.company}</p>
                  </div>
                </div>

                <div style={styles.tags}>
                  <span style={styles.tag}>📍 {job.location}</span>
                  {job.salary && (
                    <span style={{ ...styles.tag, ...styles.tagGreen }}>💰 {job.salary}</span>
                  )}
                </div>

                <p style={styles.description}>
                  {job.description.length > 120
                    ? job.description.slice(0, 120) + '...'
                    : job.description}
                </p>

                <div style={styles.cardFooter}>
                  <span style={styles.postedBy}>by {job.postedBy?.name || 'Recruiter'}</span>
                  {user?.role === 'candidate' && (
                    <button
                      style={{
                        ...styles.applyBtn,
                        backgroundColor: applied.includes(job._id) ? '#e8dcc8' : '#d97706',
                        color: applied.includes(job._id) ? '#6b5c3e' : '#fff',
                        cursor: applied.includes(job._id) ? 'default' : 'pointer'
                      }}
                      onClick={() => handleApply(job._id)}
                      disabled={applied.includes(job._id)}
                    >
                      {applied.includes(job._id) ? '✓ Applied' : 'Apply now'}
                    </button>
                  )}
                  {!user && (
                    <button style={styles.applyBtn} onClick={() => navigate('/login')}>
                      Login to apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '960px', margin: '0 auto' },
  hero: { textAlign: 'center', padding: '3rem 1rem 2rem' },
  heroTitle: { fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', color: '#1a1207', letterSpacing: '-0.5px' },
  heroSub: { fontSize: '15px', color: '#6b5c3e', marginBottom: '1.5rem' },
  pageTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1a1207' },
  searchRow: { marginBottom: '1.5rem' },
  search: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e8dcc8',
    borderRadius: '10px',
    fontSize: '14px',
    backgroundColor: '#fffdf9',
    color: '#1a1207'
  },
  count: { fontSize: '13px', color: '#92400e', marginBottom: '1rem', fontWeight: '500' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
    gap: '1rem'
  },
  card: {
    backgroundColor: '#fffdf9',
    border: '1px solid #e8dcc8',
    borderRadius: '12px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '12px' },
  companyIcon: {
    width: '42px', height: '42px', borderRadius: '10px',
    backgroundColor: '#fef3c7', color: '#d97706',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: '800', flexShrink: 0
  },
  jobTitle: { fontSize: '15px', fontWeight: '600', marginBottom: '2px', color: '#1a1207' },
  company: { fontSize: '13px', color: '#6b5c3e' },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: { fontSize: '12px', padding: '3px 10px', backgroundColor: '#f5efe0', borderRadius: '20px', color: '#6b5c3e' },
  tagGreen: { backgroundColor: '#dcfce7', color: '#16a34a' },
  description: { fontSize: '13px', color: '#6b5c3e', lineHeight: '1.6', flexGrow: 1 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' },
  postedBy: { fontSize: '12px', color: '#9ca3af' },
  applyBtn: {
    padding: '7px 16px', border: 'none',
    borderRadius: '8px', fontSize: '13px', fontWeight: '600'
  },
  emptyBox: { textAlign: 'center', padding: '3rem', backgroundColor: '#fffdf9', borderRadius: '12px', border: '1px solid #e8dcc8' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#9ca3af' }
};

export default Jobs;