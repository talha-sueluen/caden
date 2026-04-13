import { useState, useEffect } from 'react'
import { loadTasks, saveTasks } from '../services/storage'

export function useTasks() {
  const [tasks, setTasks] = useState(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  function addTask(title) {
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: trimmed,
        date: new Date().toISOString().slice(0, 10),
        completed: false,
        difficulty: null,
        createdAt: new Date().toISOString(),
      },
    ])
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return { tasks, addTask, toggleTask, deleteTask }
}
