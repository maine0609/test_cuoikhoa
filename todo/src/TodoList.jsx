import React, { useState, useEffect } from "react";
import "./TodoList.css";
function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [showInput, setShowInput] = useState(true); 

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks !== null) { 
      const parsedTasks = JSON.parse(storedTasks);
      setTasks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);
  
  useEffect(() => {
    setShowDeleteAll(filter === "completed");
    setShowInput(filter !== "completed"); 
  }, [filter]);

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteAll = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
  });

  return (
    <div className="Container">
      <div className="Header">#todo</div>
      <div className="navWrapper">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "active" ? "active" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>
      {showInput && (
        <div className="inputWrapper">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
          />
          <button onClick={addTask}>Add Task</button>
        </div>
      )}
      {filteredTasks.map((task) => (
        <div className="taskList" key={task.id}>
          <div className="task">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.text}
            </span>
          </div>
          <div className="deleteBtnWrapper">
            <button className="deleteBtn" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      {showDeleteAll && (
        <button className="deleteallBtn" onClick={deleteAll}>
          Delete All
        </button>
      )}
    </div>
  );
}

export default TodoApp;