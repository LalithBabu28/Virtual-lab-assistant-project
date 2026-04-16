# AdaptLearn — Adaptive Learning Platform

A full-stack AI-powered adaptive learning web application built with FastAPI + React.

---

## 🗂️ Project Structure

```
adaptive-learning/
├── backend/
│   ├── main.py
│   ├── store.py
│   ├── requirements.txt
│   ├── models/
│   │   └── __init__.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── students.py
│   │   ├── assignments.py
│   │   ├── tests.py
│   │   ├── labs.py
│   │   └── chat.py
│   ├── services/
│   │   ├── __init__.py
│   │   └── grok_service.py
│   └── data/           ← auto-created JSON persistence files
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── client.js
        ├── components/
        │   ├── AuthContext.jsx
        │   └── Sidebar.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── TeacherDashboard.jsx
            └── StudentDashboard.jsx
```

---

## ⚙️ Setup & Run

### 1. Set up Grok API Key

Edit `backend/services/grok_service.py` and replace `YOUR_GROK_API_KEY_HERE` with your actual key,
**or** set the environment variable:

```bash
export GROK_API_KEY=your_key_here
```

> Without a key, the app still works — MCQ generation falls back to placeholder questions.

---

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs: http://localhost:8000/docs

---

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔐 Demo Credentials

### Teacher
- Email: `admin@school.com`
- Password: `admin123`

### Student (pre-seeded)
- Email: `student1@demo.com`
- Password: `student123`
- Email: `student2@demo.com`
- Password: `student123`

---

## 🚀 Features

### Teacher
- Add students, view all students with classification levels
- Generate MCQ tests using Grok AI (with editable questions)
- Publish assignments per subject (DSA, DBMS, Compiler Design)
- Post lab assignments per subject
- View results dashboard with classifications and weak topics

### Student
- Attempt MCQ tests per subject
- Auto-classified as Weak / Intermediate / Advanced based on score
- Lab assignment access gated by performance level
- AI Tutor chatbot (Grok API) — hints only, no direct answers

### Adaptive Logic
- **Weak** (<40%): No lab access. Must retake test.
- **Intermediate** (40–75%): Lab access with weak topic suggestions.
- **Advanced** (>75%): Full lab access.

---

## 🗄️ Data Persistence

All data stored in memory + auto-saved to JSON files in `backend/data/`:
- `students.json`
- `assignments.json`
- `results.json`
- `labs.json`

---

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/login | Login (teacher or student) |
| GET | /api/students | List all students |
| POST | /api/add-student | Add new student |
| POST | /api/generate-mcq | AI-generate 10 MCQs |
| POST | /api/publish-assignment | Publish MCQ test |
| GET | /api/assignments/{subject} | Get assignment for subject |
| POST | /api/submit-test | Submit test answers |
| GET | /api/results | All results (teacher) |
| GET | /api/results/{email} | Student results |
| POST | /api/post-lab | Post lab assignment |
| GET | /api/lab/{subject} | Get lab (access enforced) |
| POST | /api/chat | AI tutor chat |
