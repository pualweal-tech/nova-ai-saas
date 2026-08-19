import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useNova } from '../app/NovaProvider'
import { AppLayout } from '../components/layout'
import { Button, Icon } from '../components/ui'

export function ProjectsPage() {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    sendMessage,
    createAnalysis,
    analysisOpen,
    setAnalysisOpen,
    historyOpen,
    setHistoryOpen,
  } = useNova()
  const [historyQuery, setHistoryQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const active = chats.find((chat) => chat.id === activeChatId) ?? chats[0]

  const grouped = useMemo(() => {
    const filtered = chats.filter((chat) => chat.title.toLowerCase().includes(historyQuery.toLowerCase()))
    return ['Today', 'Previous 7 days'].map((group) => ({
      group,
      items: filtered.filter((chat) => chat.group === group),
    }))
  }, [chats, historyQuery])

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [active?.messages])

  const submit = (text = draft) => {
    if (!text.trim()) return
    sendMessage(text)
    setDraft('')
  }

  return (
    <AppLayout workspace>
      <div className="workspace-page">
        <div className="workspace-shell">
          <aside className={`workspace-history${historyOpen ? ' is-open' : ''}`}>
            <div className="workspace-history__controls">
              <Button full type="button" onClick={() => createAnalysis('New Chat')}>
                <Icon name="add" />
                New Chat
              </Button>
              <label className="workspace-search">
                <Icon name="search" />
                <input value={historyQuery} placeholder="Search history..." onChange={(event) => setHistoryQuery(event.target.value)} />
              </label>
            </div>
            <div className="workspace-history__list">
              {grouped.every((group) => group.items.length === 0) ? (
                <div className="empty-state">No conversations match that search.</div>
              ) : (
                grouped.map((group) =>
                  group.items.length ? (
                    <div key={group.group}>
                      <p className="history-label">{group.group}</p>
                      {group.items.map((chat) => (
                        <button
                          key={chat.id}
                          className={`history-item${chat.id === active.id ? ' history-item--active' : ''}`}
                          type="button"
                          onClick={() => {
                            setActiveChatId(chat.id)
                            setHistoryOpen(false)
                          }}
                        >
                          <Icon name="chat_bubble" />
                          <span>
                            <strong>{chat.title}</strong>
                            <small>{chat.subtitle}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null,
                )
              )}
            </div>
          </aside>

          <section className="workspace-chat">
            <header className="workspace-chat__header">
              <button className="workspace-mobile-button" type="button" onClick={() => setHistoryOpen(true)} aria-label="Show history">
                <Icon name="menu" />
              </button>
              <div>
                <h1>{active.title.replace(' Analysis', '')}</h1>
                <p>
                  <span className="context-dot" />
                  Context Active: {active.context}
                </p>
              </div>
              <div className="workspace-chat__tools">
                <button className="icon-button" type="button" aria-label="Download">
                  <Icon name="download" />
                </button>
                <button className="icon-button" type="button" aria-label="Share">
                  <Icon name="share" />
                </button>
                <button className="workspace-mobile-button" type="button" onClick={() => setAnalysisOpen(true)} aria-label="Analysis">
                  <Icon name="insights" />
                </button>
              </div>
            </header>
            <div className="chat-transcript" ref={transcriptRef}>
              <div className="chat-timestamp">Today, 10:23 AM</div>
              {active.messages.length === 0 ? (
                <div className="empty-state">
                  <Icon name="auto_awesome" />
                  <p>Ask Nova to analyze a dataset, generate a report, or find anomalies.</p>
                </div>
              ) : null}
              {active.messages.map((message) => {
                if (message.role === 'user') {
                  return (
                    <article key={message.id} className="chat-message chat-message--user">
                      <p>{message.text}</p>
                    </article>
                  )
                }
                if (message.role === 'file') {
                  return (
                    <article key={message.id} className="file-attachment">
                      <span className="file-attachment__icon icon">description</span>
                      <span>
                        <strong>{message.name}</strong>
                        <small>{message.meta}</small>
                      </span>
                      <span className="icon file-attachment__check">check_circle</span>
                    </article>
                  )
                }
                if (message.role === 'loading') {
                  return (
                    <div key={message.id} className="chat-loading">
                      <span className="ai-avatar icon icon--filled">auto_awesome</span>
                      Nova is analyzing
                      <span className="typing-dots">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  )
                }
                return (
                  <article key={message.id} className="chat-message chat-message--assistant">
                    <span className="ai-avatar icon icon--filled">auto_awesome</span>
                    <div>
                      <p>
                        {message.rich ? (
                          <>
                            I've analyzed the dataset. Overall, global revenue grew by <strong className="positive-text">+14.2%</strong> year-over-year. Here is the breakdown of revenue trends across NA, EMEA, and APAC for 2023.
                          </>
                        ) : (
                          message.text
                        )}
                      </p>
                      {message.rich ? (
                        <>
                          <article className="workspace-chart-card">
                            <header>
                              <strong>
                                <Icon name="bar_chart" /> Revenue Growth (Q1 - Q4)
                              </strong>
                              <button className="text-button" type="button">
                                Expand Data
                              </button>
                            </header>
                            <div className="workspace-bars">
                              <div style={{ '--bar-height': '38%' } as CSSProperties}><span>Q1</span></div>
                              <div style={{ '--bar-height': '58%' } as CSSProperties}><span>Q2</span></div>
                              <div className="workspace-bars__focus" style={{ '--bar-height': '32%' } as CSSProperties}><span>Q3</span></div>
                              <div style={{ '--bar-height': '84%' } as CSSProperties}><span>Q4</span></div>
                            </div>
                          </article>
                          <div className="insight-grid">
                            <article className="insight-card insight-card--alert">
                              <Icon name="trending_down" />
                              <h2>EMEA Q3 Anomaly</h2>
                              <p>Revenue dropped by 18% in Q3 for the EMEA region, largely correlating with supply chain disruptions logged in September.</p>
                            </article>
                            <article className="insight-card insight-card--positive">
                              <Icon name="rocket_launch" />
                              <h2>APAC Acceleration</h2>
                              <p>APAC showed consistent quarter-over-quarter growth, peaking in Q4 with a 32% increase driven by new product lines.</p>
                            </article>
                          </div>
                        </>
                      ) : null}
                      <div className="message-actions">
                        <button
                          className="icon-button"
                          type="button"
                          aria-label="Copy"
                          onClick={() => {
                            void navigator.clipboard?.writeText(message.text)
                            setCopied(true)
                            window.setTimeout(() => setCopied(false), 1200)
                          }}
                        >
                          <Icon name="content_copy" />
                        </button>
                        <button className="icon-button" type="button" aria-label="Regenerate" onClick={() => sendMessage('Regenerate the last analysis with more regional detail.') }>
                          <Icon name="refresh" />
                        </button>
                        <button className="icon-button" type="button" aria-label="Like">
                          <Icon name="thumb_up" />
                        </button>
                        {copied ? <span className="muted">Copied</span> : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="composer-area">
              <div className="suggestion-row">
                {['Generate Q3 Board Report', 'Drill down into EMEA Q3', 'Forecast Q4 performance'].map((prompt) => (
                  <button key={prompt} type="button" onClick={() => submit(prompt)}>
                    {prompt}
                  </button>
                ))}
              </div>
              <form
                className="chat-composer"
                onSubmit={(event) => {
                  event.preventDefault()
                  submit()
                }}
              >
                <textarea
                  rows={2}
                  placeholder="Ask Nova AI to analyze data, generate reports, or find patterns..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      submit()
                    }
                  }}
                />
                <div className="composer-footer">
                  <div>
                    <button className="icon-button" type="button" aria-label="Attach file">
                      <Icon name="attach_file" />
                    </button>
                    <button className="icon-button" type="button" aria-label="Voice input">
                      <Icon name="mic" />
                    </button>
                    <span className="composer-divider" />
                    <button className="composer-prompts" type="button">
                      <Icon name="bookmark" />
                      Prompts
                    </button>
                  </div>
                  <button className="send-button" type="submit" aria-label="Send" disabled={!draft.trim()}>
                    <Icon name="send" />
                  </button>
                </div>
              </form>
              <p className="composer-disclaimer">Nova AI can make mistakes. Consider verifying important data.</p>
            </div>
          </section>

          <aside className={`analysis-context${analysisOpen ? ' is-open' : ''}`}>
            <header>
              <h2>
                <Icon name="insights" />
                Analysis Context
              </h2>
              <button className="icon-button" type="button" aria-label="Close analysis" onClick={() => setAnalysisOpen(false)}>
                <Icon name="close" />
              </button>
            </header>
            <div className="analysis-context__content">
              <section className="confidence-card">
                <div>
                  <span>Model confidence</span>
                  <strong>94%</strong>
                </div>
                <div className="confidence-track">
                  <span />
                </div>
                <p>Data completeness is high. Minimal missing values detected.</p>
              </section>
              <section>
                <h3>Detected patterns</h3>
                <article className="context-card context-card--violet">
                  <Icon name="sync" />
                  <div>
                    <strong>Seasonality</strong>
                    <p>Strong Q4 bias detected globally, consistent with retail cycles.</p>
                  </div>
                </article>
                <article className="context-card context-card--error">
                  <Icon name="warning" />
                  <div>
                    <strong>Variance Alert</strong>
                    <p>EMEA Q3 standard deviation exceeds normal operational thresholds.</p>
                  </div>
                </article>
              </section>
              <section>
                <h3>Recommended next steps</h3>
                {['Cross-reference EMEA supply logs', 'Generate Q4 specific forecast', 'Compare with 2022 dataset'].map((item) => (
                  <button key={item} className="recommendation" type="button" onClick={() => submit(item)}>
                    {item}
                    <Icon name="arrow_forward" />
                  </button>
                ))}
              </section>
              <section>
                <h3>Active dataset scope</h3>
                <div className="dataset-stats">
                  <article>
                    <strong>120.4k</strong>
                    <span>Rows Analyzed</span>
                  </article>
                  <article>
                    <strong>24</strong>
                    <span>Columns</span>
                  </article>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}
