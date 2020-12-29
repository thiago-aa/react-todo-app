import React, { useState, useEffect } from 'react';
import { uuid } from 'uuidv4';
import { FiEdit2, FiTrash } from "react-icons/fi";
import './App.css';

interface Task {
  id: string;
  description: string;
  done: boolean;
  createdAt: Date;
}


function App() {
  const [tasks, setTask] = useState<Task[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [taskDraft, setTaskDraft] = useState<string>('new task');
  const [optionChange, setOptionChange] = useState<number>(1);
  const [currentId, setCurrentId] = useState<string>();
  const [buttonName, setButtonName] = useState<any>('ADD');

  useEffect(() => {
    if(localStorage) {
      const taskString = localStorage.getItem('tasks');
      if (taskString) {
        setTask(JSON.parse(taskString));
      }
    }
    document.getElementById('task-input')?.focus();
  }, []);

  useEffect(() => {
    if(localStorage) {
      const tasksString = JSON.stringify(tasks);
      localStorage.setItem('tasks', tasksString);
    }
  }, [tasks])

  function handleAddTask(){
    setErrorMessage('');
    console.log(optionChange);
    if (!taskDraft.trim()) {
      setErrorMessage('Fill the task description.')
    }else{
      if(optionChange === 1){
        let newTask : Task = {
          id : uuid(),
          description : taskDraft,
          done : false,
          createdAt : new Date()
        };
        setTask([...tasks, newTask]);      
      }else{
        let newTasks = tasks.map( t => {
          if (t.id !== currentId){
            return t;
          }else {
            return {
              ...t,
              description: taskDraft
            };
          }
        })
        setTask(newTasks);
        setOptionChange(1);
      }
    }
    document.getElementById('task-input')?.focus();
    setButtonName('ADD');
    setTaskDraft('');
  }

  function handleDeleteTask(id: string){
    setTask(tasks.filter(t => t.id !== id));
    document.getElementById('task-input')?.focus();
  }

  function handleMarkTaskDone(id: string){
    let newTasks = tasks.map( t => {
      if (t.id !== id){
        return t;
      }else {
        return {
          ...t,
          done: !t.done
        };
      }
    })
    setTask(newTasks);
  }

  function handleEditTask(id: string){
    tasks.map(t => {
      if (t.id === id){
        setTaskDraft(t.description);
      }
    });

    setOptionChange(2);
    setCurrentId(id);
    setButtonName(<FiEdit2></FiEdit2>);
    document.getElementById('task-input')?.focus();
  }

  function handleClearTasks(){
    setTask([]);
  }

  return (
    <div className="container">

        <h1 className="title">TO-DO LIST</h1>  
      <div>
        <div className="new-task-box">
          <input 
            type="text" 
            value={ taskDraft } 
            onChange={ e => setTaskDraft(e.target.value) }
            id="task-input"
            onKeyPress={ event => {
                if(event.key === 'Enter') {
                  handleAddTask();
                }
              }
            }
          ></input>
          <button type="button" onClick={ () => handleAddTask() }>{buttonName}</button>  
        </div>
        { errorMessage && <p className="error-message">{ errorMessage }</p> }
      </div>

      <div className="tasks-box">
        {tasks.map( task => {
              return <div className="task">
                <div>       
                  <input className="checkbox" checked={task.done} type="checkbox" onChange={() => handleMarkTaskDone(task.id)}/> 
                  <p className={task.done? "task-done" : "task-not-done"}>{ task.description }</p>
                </div>

                <div>
                  <button id="edit-button" type="button" onClick= { () => handleEditTask(task.id) }><FiEdit2></FiEdit2></button>
                  <button type="button" onClick={ () => { handleDeleteTask(task.id) } }> <FiTrash></FiTrash></button>
                </div>
                
              </div>
            }
          )
        }
      <div className="clear-button-box">
        <button 
          type="button" 
          disabled={tasks.length === 0} 
          onClick={handleClearTasks}
        >CLEAR</button>
      </div> 
    </div>
      </div>
      
  );
}

export default App;