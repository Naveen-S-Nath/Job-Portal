import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, login, token } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = { ...user, name, bio };
    login(updated, token);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>My Profile</h2>

      <div style={styles.card}>
        {/* avatar section */}
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <h3 style={styles.name}>{user?.name}</h3>
            <span style={styles.roleBadge}>
              {user?.role === 'recruiter' ? '🏢 Recruiter' : '🎯 Candidate'}
            </span>
          </div>
        </div>

        <div style={styles.divider} />

        {/* info fields */}
        <div style={styles.fields}>
          <div style={styles.field}>
            <label style={styles.label}>Full name</label>
            {editing ? (
              <input
                style={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            ) : (
              <p style={styles.value}>{user?.name}</p>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <p style={styles.value}>{user?.email || 'Not set'}</p>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <p style={styles.value} style={{ textTransform: 'capitalize' }}>
              {user?.role}
            </p>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Bio</label>
            {editing ? (
              <textarea
                style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell recruiters a bit about yourself..."
              />
            ) : (
              <p style={styles.value}>
                {user?.bio || <span style={{ color: '#9ca3af' }}>No bio added yet</span>}
              </p>
            )}
          </div>
        </div>

        <div style={styles.actions}>
          {saved && <span style={styles.savedMsg}>✓ Saved successfully</span>}
          {editing ? (
            <>
              <button style={styles.saveBtn} onClick={handleSave}>Save changes</button>
              <button style={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
            </>
          ) : (
            <button style={styles.editBtn} onClick={() => setEditing(true)}>Edit profile</button>
          )}
        </div>
      </div>

      {/* account info card */}
      <div style={styles.infoCard}>
        <h4 style={styles.infoTitle}>Account info</h4>
        <p style={styles.infoText}>
          Profile pictures are coming soon. For now your initials are used as your avatar everywhere on the site.
        </p>
        <p style={styles.infoText}>
          Your email cannot be changed after registration.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '640px' },
  pageTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1207' },
  card: {
    backgroundColor: '#fffdf9',
    border: '1px solid #e8dcc8',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '1.25rem'
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#d97706',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    flexShrink: 0
  },
  name: { fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' },
  roleBadge: {
    fontSize: '12px',
    padding: '3px 10px',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    borderRadius: '20px',
    fontWeight: '500'
  },
  divider: { height: '1px', backgroundColor: '#e8dcc8', margin: '1.25rem 0' },
  fields: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: {},
  label: { fontSize: '12px', color: '#92400e', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '4px' },
  value: { fontSize: '15px', color: '#1a1207' },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #e8dcc8',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fffdf9',
    color: '#1a1207'
  },
  actions: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1.5rem' },
  editBtn: {
    padding: '8px 20px',
    backgroundColor: '#d97706',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  saveBtn: {
    padding: '8px 20px',
    backgroundColor: '#d97706',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  cancelBtn: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    color: '#6b5c3e',
    border: '1px solid #e8dcc8',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  savedMsg: { fontSize: '13px', color: '#16a34a', fontWeight: '500' },
  infoCard: {
    backgroundColor: '#fef3c7',
    border: '1px solid #fde68a',
    borderRadius: '12px',
    padding: '1.25rem'
  },
  infoTitle: { fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' },
  infoText: { fontSize: '13px', color: '#92400e', marginBottom: '4px' }
};

export default Profile;