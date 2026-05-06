import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Messages() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    if (active) fetchMessages(active._id);
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
      if (res.data.length > 0) setActive(res.data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (applicationId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!newMsg.trim() || !active) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/messages/${active._id}`,
        { text: newMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, res.data]);
      setNewMsg('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send');
    }
  };

  const getConvName = (conv) => {
    if (user?.role === 'candidate') {
      return conv.job?.postedBy?.name || 'Recruiter';
    }
    return conv.candidate?.name || 'Candidate';
  };

  const getConvSub = (conv) => conv.job?.title || 'Job';

  if (loading) return <p style={styles.center}>Loading messages...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Messages</h2>

      {conversations.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>💬</p>
          <p style={{ fontWeight: '600', marginBottom: '6px', color: '#1a1207' }}>No messages yet</p>
          <p style={{ fontSize: '14px', color: '#6b5c3e' }}>
            Messaging becomes available when a recruiter accepts your application.
          </p>
        </div>
      ) : (
        <div style={styles.chatWrapper}>
          {/* conversation list */}
          <div style={styles.convList}>
            {conversations.map(conv => (
              <div
                key={conv._id}
                style={{
                  ...styles.convItem,
                  ...(active?._id === conv._id ? styles.convItemActive : {})
                }}
                onClick={() => setActive(conv)}
              >
                <div style={styles.convAvatar}>
                  {getConvName(conv).charAt(0)}
                </div>
                <div style={styles.convInfo}>
                  <p style={styles.convName}>{getConvName(conv)}</p>
                  <p style={styles.convSub}>{getConvSub(conv)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* chat window */}
          <div style={styles.chatWindow}>
            {active && (
              <>
                <div style={styles.chatHeader}>
                  <div style={styles.convAvatar}>{getConvName(active).charAt(0)}</div>
                  <div>
                    <p style={styles.chatName}>{getConvName(active)}</p>
                    <p style={styles.chatSub}>{getConvSub(active)} · Accepted ✓</p>
                  </div>
                </div>

                <div style={styles.messages}>
                  {messages.length === 0 && (
                    <p style={styles.noMsgs}>No messages yet — say hello!</p>
                  )}
                  {messages.map((msg, i) => {
                    const isMe = msg.sender?._id === user?.id || msg.sender?._id?.toString() === user?.id;
                    return (
                      <div key={i} style={{ ...styles.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ ...styles.bubble, ...(isMe ? styles.bubbleMe : styles.bubbleOther) }}>
                          {!isMe && <p style={styles.senderName}>{msg.sender?.name}</p>}
                          <p style={styles.bubbleText}>{msg.text}</p>
                          <p style={styles.bubbleTime}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div style={styles.inputRow}>
                  <input
                    style={styles.msgInput}
                    placeholder="Type a message..."
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                  />
                  <button style={styles.sendBtn} onClick={handleSend}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '900px' },
  pageTitle: { fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1a1207' },
  chatWrapper: {
    display: 'flex',
    border: '1px solid #e8dcc8',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#fffdf9',
    height: '540px'
  },
  convList: { width: '240px', borderRight: '1px solid #e8dcc8', overflowY: 'auto', flexShrink: 0 },
  convItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 12px', cursor: 'pointer',
    borderBottom: '1px solid #f5efe0'
  },
  convItemActive: { backgroundColor: '#fef3c7' },
  convAvatar: {
    width: '38px', height: '38px', borderRadius: '50%',
    backgroundColor: '#d97706', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: '700', flexShrink: 0
  },
  convInfo: { minWidth: 0 },
  convName: { fontSize: '13px', fontWeight: '600', color: '#1a1207', margin: 0 },
  convSub: { fontSize: '12px', color: '#92400e', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  chatWindow: { flex: 1, display: 'flex', flexDirection: 'column' },
  chatHeader: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '14px 16px', borderBottom: '1px solid #e8dcc8'
  },
  chatName: { fontSize: '14px', fontWeight: '600', margin: 0 },
  chatSub: { fontSize: '12px', color: '#92400e', margin: 0 },
  messages: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  noMsgs: { textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginTop: '2rem' },
  msgRow: { display: 'flex' },
  bubble: { maxWidth: '65%', padding: '10px 14px', borderRadius: '12px' },
  bubbleMe: { backgroundColor: '#d97706', color: '#fff', borderBottomRightRadius: '4px' },
  bubbleOther: { backgroundColor: '#f5efe0', color: '#1a1207', borderBottomLeftRadius: '4px' },
  senderName: { fontSize: '11px', fontWeight: '600', opacity: 0.7, margin: '0 0 2px' },
  bubbleText: { fontSize: '14px', margin: '0 0 4px' },
  bubbleTime: { fontSize: '11px', opacity: 0.7, margin: 0 },
  inputRow: {
    display: 'flex', gap: '8px',
    padding: '12px 16px', borderTop: '1px solid #e8dcc8'
  },
  msgInput: {
    flex: 1, padding: '9px 12px',
    border: '1px solid #e8dcc8', borderRadius: '8px',
    fontSize: '14px', backgroundColor: '#faf8f5'
  },
  sendBtn: {
    padding: '9px 20px', backgroundColor: '#d97706',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
  },
  emptyBox: {
    textAlign: 'center', padding: '4rem 2rem',
    backgroundColor: '#fffdf9', borderRadius: '12px',
    border: '1px solid #e8dcc8'
  },
  center: { textAlign: 'center', marginTop: '3rem', color: '#9ca3af' }
};

export default Messages;