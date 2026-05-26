export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TaskCreateRequest {
  title: string
  description?: string | null
  status?: TaskStatus
}

const BASE = '/api/tasks'

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`HTTP ${response.status}: ${detail}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return response.json() as Promise<T>
}

export async function listTasks(status?: TaskStatus): Promise<Task[]> {
  const url = status ? `${BASE}?status=${status}` : BASE
  return handle<Task[]>(await fetch(url))
}

export async function createTask(input: TaskCreateRequest): Promise<Task> {
  const response = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return handle<Task>(response)
}

export async function updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const response = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  return handle<Task>(response)
}

export async function deleteTask(id: number): Promise<void> {
  await handle<void>(await fetch(`${BASE}/${id}`, { method: 'DELETE' }))
}
