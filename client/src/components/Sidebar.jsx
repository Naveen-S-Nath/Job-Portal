import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const candidateLinks = [
    { to: '/jobs', icon: '🔍', label: 'Browse Jobs' },
    { to: '/my-applications', icon: '📋', label: 'My Applications' },
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/messages', icon: '💬', label: 'Messages' }
  ];

  const recruiterLinks = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/jobs', icon: '🔍', label: 'Browse Jobs' },
    { to: '/profile', icon: '👤', label: 'Profile' },
    { to: '/messages', icon: '💬', label: 'Messages' }
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <aside style={styles.sidebar}>
      {/* user info */}
      <div style={styles.userBox}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>
            {user?.role === 'recruiter' ? '🏢 Recruiter' : '🎯 Candidate'}
          </p>
        </div>
      </div>

      {/* nav links */}
      <nav style={styles.nav}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}
          >
            <span style={styles.icon}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* logout at bottom */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <span>🚪</span> Logout
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#fffdf9',
    borderRight: '1px solid #e8dcc8',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '64px',
    flexShrink: 0
  },
  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.75rem',
    backgroundColor: '#fef3c7',
    borderRadius: '10px',
    marginBottom: '1.5rem'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#d97706',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    flexShrink: 0
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1207',
    margin: 0
  },
  userRole: {
    fontSize: '11px',
    color: '#92400e',
    margin: 0
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b5c3e',
    textDecoration: 'none',
    transition: 'all .15s'
  },
  navLinkActive: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  icon: { fontSize: '16px' },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #e8dcc8',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#6b5c3e',
    fontWeight: '500',
    marginTop: '1rem',
    width: '100%'
  }
};

export default Sidebar;