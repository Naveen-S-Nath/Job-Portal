import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', description: '', company: '', location: '', salary: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login');
      return;
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs');
      // filter only this recruiter's jobs
      const myJobs = res.data.filter(j => j.postedBy?._id === user.id);
      setJobs(myJobs);

      // fetch applications for each job
      for (const job of myJobs) {
        fetchApplications(job._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/applications/${jobId}/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(prev => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/api/jobs',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs([...jobs, res.data.job]);
      setShowForm(false);
      setFormData({ title: '', description: '', company: '', location: '', salary: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    }
  };

  const handleStatusUpdate = async (applicationId, jobId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update locally without refetching
      setApplications(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(app =>
          app._id === applicationId ? { ...app, status } : app
        )
      }));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <p style={styles.center}>Loading dashboard...</p>;

  return (
    <div style={styles.container}>

      {/* header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Recruiter Dashboard</h2>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>Hi, {user?.name}</span>
          <button style={styles.outlineBtn} onClick={() => navigate('/jobs')}>View jobs</button>
          <button style={styles.outlineBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* post job button */}
      <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Post a job'}
      </button>

      {/* post job form */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>New job listing</h3>
          <form onSubmit={handlePostJob}>
            {['title', 'company', 'location', 'salary'].map(field => (
              <input
                key={field}
                style={styles.input}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                required={field !== 'salary'}
              />
            ))}
            <textarea
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              placeholder="Job description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <button style={styles.primaryBtn} type="submit">Post job</button>
          </form>
        </div>
      )}

      {/* jobs list */}
      {jobs.length === 0 ? (
        <p style={styles.empty}>You haven't posted any jobs yet.</p>
      ) : (
        jobs.map(job => (
          <div key={job._id} style={styles.jobCard}>

            {/* job header */}
            <div style={styles.jobHeader}>
              <div>
                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobMeta}>{job.company} · {job.location} {job.salary && `· ${job.salary}`}</p>
              </div>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDeleteJob(job._id)}
              >
                Delete
              </button>
            </div>

            {/* applications for this job */}
            <div style={styles.appsSection}>
              <p style={styles.appsLabel}>
                Applications ({applications[job._id]?.length || 0})
              </p>

              {!applications[job._id] || applications[job._id].length === 0 ? (
                <p style={styles.noApps}>No applications yet.</p>
              ) : (
                applications[job._id].map(app => (
                  <div key={app._id} style={styles.appRow}>
                    <div>
                      <p style={styles.appName}>{app.candidate?.name}</p>
                      <p style={styles.appEmail}>{app.candidate?.email}</p>
                    </div>
                    <div style={styles.appRight}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor:
                          app.status === 'accepted' ? '#dcfce7' :
                          app.status === 'rejected' ? '#fee2e2' : '#fef9c3',
                        color:
                          app.status === 'accepted' ? '#16a34a' :
                          app.status === 'rejected' ? '#dc2626' : '#ca8a04'
                      }}>
                        {app.status}
                      </span>
                      {app.status === 'pending' && (
                        <div style={styles.actionBtns}>
                          <button
                            style={styles.acceptBtn}
                            onClick={() => handleStatusUpdate(app._id, job._id, 'accepted')}
                          >
                            Accept
                          </button>
                          <button
                            style={styles.rejectBtn}
                            onClick={() => handleStatusUpdate(app._id, job._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  title: { fontSize: '1.5rem', fontWeight: '500', margin: 0 },
  welcome: { fontSize: '14px', color: '#666' },
  primaryBtn: { padding: '8px 18px', backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginBottom: '1rem' },
  outlineBtn: { padding: '6px 14px', backgroundColor: '#f3f4f6', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  formCard: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.5rem' },
  formTitle: { fontSize: '1rem', fontWeight: '500', marginBottom: '1rem' },
  input: { width: '100%', padding: '10px 12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  jobCard: { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' },
  jobHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  jobTitle: { fontSize: '1rem', fontWeight: '500', margin: '0 0 4px' },
  jobMeta: { fontSize: '13px', color: '#4f46e5', margin: 0 },
  deleteBtn: { padding: '5px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  appsSection: { borderTop: '1px solid #f3f4f6', paddingTop: '1rem' },
  appsLabel: { fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' },
  noApps: { fontSize: '13px', color: '#9ca3af' },
  appRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f9fafb' },
  appName: { fontSize: '14px', fontWeight: '500', margin: '0 0 2px' },
  appEmail: { fontSize: '12px', color: '#6b7280', margin: 0 },
  appRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500' },
  actionBtns: { display: 'flex', gap: '6px' },
  acceptBtn: { padding: '4px 10px', backgroundColor: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  rejectBtn: { padding: '4px 10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  empty: { color: '#9ca3af', textAlign: 'center', marginTop: '2rem' },
  center: { textAlign: 'center', marginTop: '3rem', color: '#666' }
};

export default Dashboard;