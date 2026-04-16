import { AuthProvider, useAuth } from './components/AuthContext'
import LoginPage from './pages/LoginPage'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function AppRouter() {
  const { user } = useAuth()

  if (!user) return <LoginPage />
  if (user.role === 'teacher') return <TeacherDashboard />
  return <StudentDashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
