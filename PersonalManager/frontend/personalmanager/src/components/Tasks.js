import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { replace, useNavigate } from 'react-router-dom';
import {useEffect } from 'react';

const TaskPage = () => {
 const navigate = useNavigate();
    
        
        const username=localStorage.getItem('username');
        const tokenid=localStorage.getItem('jwttoken');
        const [tasks, setTasks] = useState([]);
        const [title, setTitle] = useState('');
          const [desc, setDesc] = useState('');
          const [endtime, setendtime] = useState('');
          const [error, setError] = useState('');

          //Task Adding Function
      const addnewtask = async (e) =>{
        e.preventDefault();
        const sqlDateTime = endtime.replace("T", " ") + ":00";
        setendtime(sqlDateTime);
        const taskdata= {username,tokenid,title,desc,endtime};
        try{
          const responseAddTask = await fetch('http://localhost:4567/tasks', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokenid}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskdata)
          });
          if(responseAddTask.ok){
            alert("Task Added Successfuly");
            fetchData();
          }else{
            alert("Error in adding Task");
          }
        } catch (error) {
          console.error('Error in posting:', error);
          alert(error);
        }
        
      }
    // Fetching data
        const fetchData = async () => {
            try {
                const responseTask = await fetch('http://localhost:4567/tasklist', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${tokenid}`,
                    'Content-Type': 'application/json'
                  }
                });
                const dataTask = await responseTask.json();
                if (!responseTask.ok) {
                  throw new Error('Failed to fetch data');
                }
                setTasks(dataTask);
              } catch (error) {
                console.error('Error fetching data:', error);
                alert(error);
                return []; 
              }
          };
          useEffect(() => {
            fetchData();
          }, []); 
          const handleLogout = () => {
            const isConfirmed = window.confirm("Are you sure you want to logout?");
            if (isConfirmed) {
              localStorage.removeItem('jwttoken');
              localStorage.removeItem('username');
              navigate('/login',{ replace:true})
              alert("Logging out...");
            } else {
              alert("Logout cancelled.");
            }
          };
        
  return (
    <div className="container-fluid vh-100 d-flex p-0 image-side">
      {/* NAVBAR */}
        <div className="d-flex flex-column p-3 bg-light" style={{ width: '250px', height: '100vh' }}>

      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <i className="bi bi-bootstrap-fill me-2 fs-4"></i>
        <span className="fs-4">Personal Manager</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="/home" className="nav-link text-dark fw-bold">
            <i className="bi bi-house-fill me-2"></i>
            Home
          </a>
        </li>
        <li>
          <a href="/tasks" className="nav-link text-secondary">
            <i className="bi bi-speedometer2 me-2"></i>
            Tasks
          </a>
        </li>
        <li>
          <a href="/notes" className="nav-link text-dark fw-bold">
            <i className="bi bi-gear-fill me-2"></i>
            Notes
          </a>
        </li>
        
      </ul>
      <hr/>
      <button className="btn btn-secondary" onClick={fetchData}>Refresh</button>
      <hr/>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
    {/* Tasks View */}
      <div className="col-md-7 p-4 d-flex flex-column" id="tasks" style={{ height: "calc(100vh - 30px)" }}>
    <div className="card shadow-sm flex-grow-1 d-flex flex-column">
      <div className="card-body overflow-auto">
        <h4 className="card-title">Tasks</h4>
        {tasks.map((task, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{task.title}</h5>
              <p className="card-text">{task.desc}</p>
              <p className="card-text"><strong>End Time:</strong> {task.endtime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  {/* Tasks ADD form */}
      <div className="col-md-4 d-flex align-items-center justify-content-center bg-white p-5 shadow-lg" >
        
        <div className="w-100 shadow-lg p-3 mb-5 rounded" style={{ maxWidth: '500px' }}>
          <h2 className="text-center mb-4">Personal Manager</h2>
          <h4 className="text-center mb-4 text-muted">New Task</h4>
          <form onSubmit={addnewtask}>
          <div className="mb-3">
              <label htmlFor="Title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="EndTime" className="form-label">EndTime</label>
              <input
                type="datetime-local"
                className="form-control"
                id="desc"
                value={endtime}
                onChange={(e) => setendtime(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Add new Task</button>
          </form>

        </div>
        </div>
      </div>
  );
};

export default TaskPage;
