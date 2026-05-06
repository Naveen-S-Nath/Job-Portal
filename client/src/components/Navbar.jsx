import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>💼</span>
          <span style={styles.logoText}>Naveen's <span style={styles.logoAccent}>JB</span></span>
        </Link>

        <div style={styles.links}>
          <Link to="/jobs" style={{ ...styles.link, ...(isActive('/jobs') ? styles.activeLink : {}) }}>
            Browse Jobs
          </Link>

          {!user && (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Get Started</Link>
            </>
          )}

          {user?.role === 'candidate' && (
            <>
              <Link to="/my-applications" style={{ ...styles.link, ...(isActive('/my-applications') ? styles.activeLink : {}) }}>
                My Applications
              </Link>
              <Link to="/profile" style={{ ...styles.link, ...(isActive('/profile') ? styles.activeLink : {}) }}>
                Profile
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          )}

          {user?.role === 'recruiter' && (
            <>
              <Link to="/dashboard" style={{ ...styles.link, ...(isActive('/dashboard') ? styles.activeLink : {}) }}>
                Dashboard
              </Link>
              <Link to="/profile" style={{ ...styles.link, ...(isActive('/profile') ? styles.activeLink : {}) }}>
                Profile
              </Link>
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#fffdf9',
    borderBottom: '1px solid #e8dcc8',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  logoIcon: { fontSize: '22px' },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1207',
    letterSpacing: '-0.5px'
  },
  logoAccent: { color: '#d97706' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    fontSize: '14px',
    color: '#6b5c3e',
    textDecoration: 'none',
    fontWeight: '500',
    paddingBottom: '2px',
    borderBottom: '2px solid transparent'
  },
  activeLink: {
    color: '#d97706',
    borderBottom: '2px solid #d97706'
  },
  registerBtn: {
    padding: '8px 18px',
    backgroundColor: '#d97706',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none'
  },
  logoutBtn: {
    padding: '7px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #e8dcc8',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    color: '#6b5c3e',
    fontWeight: '500'
  }
};

export default Navbar;