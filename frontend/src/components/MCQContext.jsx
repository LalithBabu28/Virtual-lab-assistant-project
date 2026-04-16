/**
 * MCQContext
 *
 * Persists generated MCQ state across tab navigation so the teacher
 * does not have to regenerate when switching between Generate → Labs → back.
 *
 * Stored in React state (in-memory, not localStorage — the app is SPA and
 * the teacher session stays alive the whole time).
 */
import { createContext, useContext, useState } from 'react'

const MCQContext = createContext(null)

export function MCQProvider({ children }) {
  const [mcqState, setMcqState] = useState({
    subject: 'DSA',
    topic: '',
    questions: [],
    title: '',
    published: false,
  })

  const setSubject  = (subject)   => setMcqState(s => ({ ...s, subject, published: false }))
  const setTopic    = (topic)     => setMcqState(s => ({ ...s, topic,   published: false }))
  const setQuestions = (questions) => setMcqState(s => ({ ...s, questions, published: false }))
  const setTitle    = (title)     => setMcqState(s => ({ ...s, title }))
  const markPublished = ()        => setMcqState(s => ({ ...s, published: true }))

  const updateQuestion = (idx, field, value) =>
    setMcqState(s => {
      const questions = [...s.questions]
      questions[idx] = { ...questions[idx], [field]: value }
      return { ...s, questions }
    })

  const updateOption = (idx, key, value) =>
    setMcqState(s => {
      const questions = [...s.questions]
      questions[idx] = {
        ...questions[idx],
        options: { ...questions[idx].options, [key]: value },
      }
      return { ...s, questions }
    })

  const clearMCQ = () =>
    setMcqState({ subject: 'DSA', topic: '', questions: [], title: '', published: false })

  return (
    <MCQContext.Provider value={{
      mcqState,
      setSubject,
      setTopic,
      setQuestions,
      setTitle,
      markPublished,
      updateQuestion,
      updateOption,
      clearMCQ,
    }}>
      {children}
    </MCQContext.Provider>
  )
}

export const useMCQ = () => useContext(MCQContext)
