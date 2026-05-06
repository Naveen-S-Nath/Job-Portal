import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

function Layout({ children }) {
  const { user } = useAuth();

  if (!user) return <>{children}</>;

  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)'
  },
  main: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
    maxWidth: '100%'
  }
};

export default Layout;