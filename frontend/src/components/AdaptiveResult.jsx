/**
 * AdaptiveResult
 *
 * Shown after a student submits a test.  The UI adapts based on classification:
 *
 *  Weak         → Full topic explanations + wrong-answer breakdowns + retake CTA
 *  Intermediate → Wrong-answer breakdowns + lab access CTA
 *  Advanced     → Score celebration + direct lab access CTA
 */
import { useState, useEffect } from 'react'
import { api } from '../api/client'

function ScoreRing({ percent, classification }) {
  const color =
    classification === 'Advanced'
      ? 'var(--green)'
      : classification === 'Intermediate'
      ? 'var(--yellow)'
      : 'var(--red)'

  return (
    <div style={{ textAlign: 'center', padding: '1.5rem 0 1rem' }}>
      <div
        style={{
          fontSize: '4rem',
          fontWeight: 900,
          color,
          fontFamily: 'var(--font-head)',
          lineHeight: 1,
        }}
      >
        {percent}%
      </div>
      <span
        className={`badge badge-${classification.toLowerCase()}`}
        style={{ fontSize: '1rem', padding: '0.4rem 1.2rem', marginTop: '0.75rem', display: 'inline-block' }}
      >
        {classification}
      </span>
    </div>
  )
}

function TopicExplanation({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius2)',
        marginBottom: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'var(--bg3)',
          color: 'var(--text)',
          padding: '0.85rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.92rem',
          fontWeight: 600,
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span>📘 {item.topic}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '1rem', background: 'var(--bg2)' }}>
          <p style={{ color: 'var(--text2)', lineHeight: 1.75, marginBottom: '0.85rem' }}>
            {item.explanation}
          </p>
          {item.key_points?.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text3)',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  marginBottom: '0.4rem',
                }}
              >
                KEY POINTS
              </div>
              {item.key_points.map((pt, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.3rem',
                    fontSize: '0.88rem',
                    color: 'var(--text2)',
                  }}
                >
                  <span style={{ color: 'var(--accent2)', flexShrink: 0 }}>→</span>
                  {pt}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function WrongAnswerCard({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: '1px solid rgba(248,113,113,0.25)',
        borderRadius: 'var(--radius2)',
        marginBottom: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'rgba(248,113,113,0.06)',
          color: 'var(--text)',
          padding: '0.85rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '0.75rem',
          fontSize: '0.88rem',
          textAlign: 'left',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span style={{ flex: 1, lineHeight: 1.5 }}>❌ {item.question}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text3)', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '1rem', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: 'var(--radius2)',
              padding: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--green)', fontWeight: 600, marginBottom: '0.25rem' }}>
              WHY IT'S CORRECT
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              {item.why_correct}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(248,113,113,0.06)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 'var(--radius2)',
              padding: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: 'var(--red)', fontWeight: 600, marginBottom: '0.25rem' }}>
              COMMON MISTAKE
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              {item.common_mistake}
            </p>
          </div>
          {item.tip && (
            <div
              style={{
                background: 'rgba(108,99,255,0.08)',
                border: '1px solid rgba(108,99,255,0.25)',
                borderRadius: 'var(--radius2)',
                padding: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--accent2)', fontWeight: 600, marginBottom: '0.25rem' }}>
                MEMORY TIP
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                💡 {item.tip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdaptiveResult({ result, subject, onRetake, onGoToLab }) {
  const { score, total, score_percent, classification, weak_topics, wrong_questions } = result

  const [analysis, setAnalysis]     = useState(null)
  const [analysisLoading, setLoading] = useState(false)
  const [analysisError, setError]    = useState('')

  useEffect(() => {
    // Only fetch analysis for Weak and Intermediate — Advanced goes straight to labs
    if (classification === 'Advanced') return

    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.analyzePerformance(
          subject,
          classification,
          weak_topics || [],
          wrong_questions || [],
        )
        setAnalysis(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1>Test Results — {subject}</h1>
        <p style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
          {new Date(result.date_time).toLocaleString()}
        </p>
      </div>

      {/* Score */}
      <div className="card" style={{ maxWidth: 480, marginBottom: '1.5rem' }}>
        <ScoreRing percent={score_percent} classification={classification} />
        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.9rem' }}>
          {score} / {total} correct
        </p>

        {weak_topics?.length > 0 && (
          <div className="alert alert-warn" style={{ marginTop: '1rem' }}>
            <div>
              <strong>Topics to review:</strong>{' '}
              {weak_topics.join(', ')}
            </div>
          </div>
        )}
      </div>

      {/* ── ADVANCED ─────────────────────────────── */}
      {classification === 'Advanced' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
            <h3 style={{ color: 'var(--green)', marginBottom: '0.5rem' }}>Excellent work!</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '1.25rem' }}>
              You have full access to lab assignments for this subject.
            </p>
            <button className="btn btn-success btn-lg" onClick={onGoToLab}>
              Go to Lab Assignments →
            </button>
          </div>
        </div>
      )}

      {/* ── WEAK / INTERMEDIATE — loading ──────── */}
      {(classification === 'Weak' || classification === 'Intermediate') && analysisLoading && (
        <div className="card" style={{ maxWidth: 680, textAlign: 'center', padding: '2rem' }}>
          <span className="spinner" style={{ width: 28, height: 28, margin: '0 auto 0.75rem' }} />
          <p style={{ color: 'var(--text2)' }}>
            Generating personalised explanations…
          </p>
        </div>
      )}

      {analysisError && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          Could not load explanations: {analysisError}
        </div>
      )}

      {/* ── WEAK ──────────────────────────────────── */}
      {classification === 'Weak' && analysis && (
        <div style={{ maxWidth: 680 }}>
          {analysis.study_plan && (
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              <div>
                <strong>Study Plan:</strong> {analysis.study_plan}
              </div>
            </div>
          )}

          {analysis.topic_explanations?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem', color: 'var(--text2)' }}>
                TOPIC EXPLANATIONS
              </h3>
              {analysis.topic_explanations.map((item, i) => (
                <TopicExplanation key={i} item={item} />
              ))}
            </div>
          )}

          {analysis.wrong_answer_explanations?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem', color: 'var(--text2)' }}>
                WRONG ANSWERS — DETAILED REVIEW
              </h3>
              {analysis.wrong_answer_explanations.map((item, i) => (
                <WrongAnswerCard key={i} item={item} />
              ))}
            </div>
          )}

          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
            <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
              Review the explanations above, then retake the test to unlock lab access.
            </p>
            <button className="btn btn-primary btn-lg" onClick={onRetake}>
              Retake Test
            </button>
          </div>
        </div>
      )}

      {/* ── INTERMEDIATE ────────────────────────── */}
      {classification === 'Intermediate' && analysis && (
        <div style={{ maxWidth: 680 }}>
          {analysis.encouragement && (
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              {analysis.encouragement}
            </div>
          )}

          {analysis.wrong_answer_explanations?.length > 0 ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.85rem', color: 'var(--text2)' }}>
                REVIEW YOUR MISTAKES
              </h3>
              {analysis.wrong_answer_explanations.map((item, i) => (
                <WrongAnswerCard key={i} item={item} />
              ))}
            </div>
          ) : (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              No mistakes to review — great accuracy!
            </div>
          )}

          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔬</div>
            <p style={{ color: 'var(--text2)', marginBottom: '1rem' }}>
              Good progress! You can now access the lab assignments for this subject.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={onRetake}>
                Retake to improve
              </button>
              <button className="btn btn-success btn-lg" onClick={onGoToLab}>
                Go to Lab Assignments →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
