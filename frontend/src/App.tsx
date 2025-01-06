import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Carregar lista de tarefas do backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>('https://simple-tasker-backend.onrender.com/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post<Task>('https://simple-tasker-backend.onrender.com/tasks', {
        title: newTaskTitle,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  const toggleCompleteTask = async (task: Task) => {
    try {
      const response = await axios.patch<Task>(`https://simple-tasker-backend.onrender.com/tasks/${task.id}`, {
        completed: !task.completed,
      });

      const updatedTasks = tasks.map((t) =>
        t.id === task.id ? response.data : t
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const removeTask = async (taskId: number) => {
    try {
      await axios.delete(`https://simple-tasker-backend.onrender.com/tasks/${taskId}`);
      const updatedTasks = tasks.filter((t) => t.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  };

  return (
    <div className="App">
      <h1>Simple Tasker</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={addTask}>Adicionar</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <span onClick={() => toggleCompleteTask(task)}>{task.title}</span>
            <button onClick={() => removeTask(task.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
