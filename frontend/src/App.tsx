import { useCallback, useEffect, useState } from 'react'

import {
  createTask,
  deleteTask,
  listTasks,
  updateTaskStatus,
  type Task,
  type TaskStatus,
} from './api/tasks'

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done',
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO',
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTasks(await listTasks())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim()) return
    try {
      await createTask({ title: title.trim() })
      setTitle('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    }
  }

  async function handleAdvance(task: Task) {
    try {
      await updateTaskStatus(task.id, NEXT_STATUS[task.status])
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    }
  }

  async function handleDelete(task: Task) {
    try {
      await deleteTask(task.id)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknown error')
    }
  }

  return (
    <main className="container">
      <h1>Task Tracker</h1>
      <p className="subtitle">Minimal full-stack CRUD demo — Spring Boot + React</p>

      <form onSubmit={handleCreate} className="task-form">
        <input
          type="text"
          placeholder="New task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
        <button type="submit" disabled={!title.trim()}>
          Add
        </button>
      </form>

      {error && <p className="error">⚠ {error}</p>}
      {loading && <p className="loading">Loading…</p>}

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={`task task--${task.status.toLowerCase()}`}>
            <div className="task__main">
              <span className="task__title">{task.title}</span>
              <span className="task__status">{STATUS_LABELS[task.status]}</span>
            </div>
            <div className="task__actions">
              <button onClick={() => void handleAdvance(task)}>Advance</button>
              <button className="danger" onClick={() => void handleDelete(task)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {!loading && tasks.length === 0 && <li className="empty">No tasks yet — add one above.</li>}
      </ul>
    </main>
  )
}

export default App
