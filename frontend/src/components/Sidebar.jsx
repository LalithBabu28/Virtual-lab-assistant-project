import { useAuth } from './AuthContext'

const TEACHER_NAV = [
  { id: 'overview',  icon: '⬡', label: 'Overview' },
  { id: 'students',  icon: '◎', label: 'Students' },
  { id: 'generate',  icon: '◈', label: 'Generate MCQ' },
  { id: 'labs',      icon: '⬟', label: 'Lab Assignments' },
  { id: 'results',   icon: '◉', label: 'Results' },
]

const STUDENT_NAV = [
  { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
  { id: 'test',      icon: '◈', label: 'Take Test' },
  { id: 'lab',       icon: '⬟', label: 'Lab Work' },
  { id: 'chat',      icon: '◎', label: 'AI Tutor' },
]

export default function Sidebar({ active, onNav }) {
  const { user, logout } = useAuth()
  const nav = user?.role === 'teacher' ? TEACHER_NAV : STUDENT_NAV

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>AdaptLearn</h2>
        <p>{user?.role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</p>
      </div>

      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{user?.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.1rem' }}>
            {user?.email}
          </div>
          {/* Level is intentionally NOT shown here — it's per-test-attempt now */}
        </div>
        <button
          className="btn btn-secondary w-full"
          style={{ fontSize: '0.82rem' }}
          onClick={logout}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
