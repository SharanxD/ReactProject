import React from 'react';
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {


    const navigate=useNavigate();
    const username=localStorage.getItem('username');
    const tokenid=localStorage.getItem('jwttoken');
    const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  // Data Fetching function.
    const fetchData = async () => {
        try {
            const responseTask = await fetch('http://localhost:4567/tasklist', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${tokenid}`,
                'Content-Type': 'application/json'
              }
            });
            const responseNotes = await fetch('http://localhost:4567/noteslist', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${tokenid}`,
                'Content-Type': 'application/json'
              }
            });
            const dataTask = await responseTask.json();
            const dataNotes = await responseNotes.json();
            if (!responseTask.ok || !responseNotes.ok) {
              throw new Error('Failed to fetch data');
            }
            setTasks(dataTask);
            setNotes(dataNotes);
          } catch (error) {
            console.error('Error fetching data:', error);
            alert(error);
            return []; // returning empty if there is no data.
          }
      };
      useEffect(() => {
        fetchData();
      }, []); 
    
      // Logout function 
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
          <div className="d-flex flex-column p-3 bg-light" style={{ width: '200px', height: '100vh' }}>
            {/* Navbar */}
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
        <i className="bi bi-bootstrap-fill me-2 fs-4"></i>
        <span className="fs-4">Personal Manager</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="/home" className="nav-link text-secondary">
            <i className="bi bi-house-fill me-2"></i>
            Home
          </a>
        </li>
        <li>
          <a href="/tasks" className="nav-link text-dark fw-bold">
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
        {/* Displaying tasks */}
      <div className="col-md-6 p-4 d-flex flex-column" id="tasks" style={{ height: "calc(100vh - 30px)" }}>
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
  {/* Displaying notes */}
  <div className="col-md-5 p-4 d-flex flex-column" id="Notes" style={{ height: "calc(100vh - 30px)" }}>
    <div className="card shadow-sm flex-grow-1 d-flex flex-column">
      <div className="card-body overflow-auto">
        <h4 className="card-title">Notes</h4>
        {notes.map((note, index) => (
          <div key={index} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{note.notedata}</h5>
              <p className="card-text">{note.createtime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
        </div>
      );
};

export default HomePage;
