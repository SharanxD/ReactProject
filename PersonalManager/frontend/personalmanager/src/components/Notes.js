import React, { useState } from 'react';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import {useEffect } from 'react';

const NotesPage = () => {
 const navigate = useNavigate();
    
        
        const username=localStorage.getItem('username');
        const tokenid=localStorage.getItem('jwttoken');
        const [notes, setNotes] = useState([]);
          const [notedata, setDesc] = useState('');
          const [error, setError] = useState('');

          // Adding Notes Function
    const addnewnote = async (e) => {
      e.preventDefault();
      const postdata={username,tokenid,notedata};
      try{
      const responseAddNote = await fetch('http://localhost:4567/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenid}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postdata)
      });
      if(responseAddNote.ok){
        alert("Note Added Successfuly");
        fetchData();

      }else{
        alert("Error in adding note");
      }
    } catch (error) {
      console.error('Error in posting:', error);
      alert(error);
    }

    } ;

    // Fetching data
        const fetchData = async () => {
            try {
                const responseNote = await fetch('http://localhost:4567/noteslist', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${tokenid}`,
                    'Content-Type': 'application/json'
                  }
                });
                const dataNotes = await responseNote.json();
                if (!responseNote.ok) {
                  throw new Error('Failed to fetch data');
                }
                setNotes(dataNotes);
              } catch (error) {
                console.error('Error fetching data:', error);
                alert(error);
                return []; // return empty array if error occurs
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
          <a href="/tasks" className="nav-link text-dark fw-bold">
            <i className="bi bi-speedometer2 me-2"></i>
            Tasks
          </a>
        </li>
        <li>
          <a href="/notes" className="nav-link text-secondary">
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
    {/* NOTES VIEW */}
      <div className="col-md-7 p-4 d-flex flex-column" id="Notes" style={{ height: "calc(100vh - 30px)" }}>
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
  {/* New Notes Form */}
      <div className="col-md-4 d-flex align-items-center justify-content-center bg-white p-5 shadow-lg">

      {error && <div className="alert alert-danger">{error}</div>}
        <div className="w-100 shadow-lg p-3 mb-5 rounded" style={{ maxWidth: '500px' }}>
          <h2 className="text-center mb-4">Personal Manager</h2>
          <h4 className="text-center mb-4 text-muted">New Note</h4>
          <form onSubmit={addnewnote}>
            <div className="mb-3">
              <label htmlFor="Description" className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={notedata}
                onChange={(e) => setDesc(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Add new Note</button>
          </form>

          

          
        </div>
        </div>
      </div>
  );
};

export default NotesPage;
