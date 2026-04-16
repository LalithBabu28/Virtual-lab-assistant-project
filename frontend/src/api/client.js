const BASE = 'https://virtual-lab-assistant-project-1.onrender.com/api'

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  let response, data = null
  try {
    response = await fetch(`${BASE}${path}`, options)
  } catch (err) {
    throw new Error('Network error: Unable to reach server')
  }
  try {
    data = await response.json()
  } catch (err) {
    throw new Error('Invalid JSON response from server')
  }
  if (!response.ok) throw new Error(data?.detail || 'Request failed')
  return data
}

export const api = {
  // AUTH
  login: (email, password, role) =>
    request('POST', '/login', { email, password, role }),

  // STUDENTS
  getStudents: () => request('GET', '/students'),
  addStudent: (name, email, password) =>
    request('POST', '/add-student', { name, email, password }),

  // ASSIGNMENTS
  generateMCQ: (subject, topic) =>
    request('POST', '/generate-mcq', { subject, topic }),

  publishAssignment: (subject, title, questions) =>
    request('POST', '/publish-assignment', { subject, title, questions }),

  getAssignment: (subject) =>
    request('GET', `/assignments/${subject}`),

  // TESTS
  submitTest: (email, subject, answers) =>
    request('POST', '/submit-test', { student_email: email, subject, answers }),

  checkAttempt: (email, subject) =>
    request('GET', `/check-attempt/${encodeURIComponent(email)}/${encodeURIComponent(subject)}`),

  // ── NEW: regenerate a fresh set for a Weak student retake ──────────────
  regenerateForWeak: (email, subject) =>
    request('POST', `/regenerate-for-weak?student_email=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}`),

  // LABS
  getLab: (subject, email) =>
    request('GET', `/lab/${subject}?student_email=${email}`),

  // ── FIXED: postLab was missing from the original client ───────────────
  postLab: (subject, title, description, tasks) =>
    request('POST', '/post-lab', { subject, title, description, tasks }),

  // CHAT
  chat: (message, subject, conversation_history = []) =>
    request('POST', '/chat', { message, subject, conversation_history }),

  // ANALYSIS
  analyzePerformance: (subject, classification, weak_topics, wrong_questions) =>
    request('POST', '/analyze-performance', {
      subject, classification, weak_topics, wrong_questions,
    }),

  // RESULTS
  getResults: () => request('GET', '/results'),
  getStudentResults: (email) =>
    request('GET', `/results/${encodeURIComponent(email)}`),
}