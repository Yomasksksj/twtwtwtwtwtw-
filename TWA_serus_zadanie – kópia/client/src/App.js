import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="d-flex justify-content-center align-items-start vh-100">
      <h1 className="mt-4">Eshop s hudobnými cd</h1>
    </div>
  );
}

function Tracks() {
  return (
    <div className="d-flex justify-content-center align-items-start vh-100">
      <h1 className="mt-4">Skladby</h1>
    </div>
  );
}

function Director() {
  return (
    <div className="d-flex justify-content-center align-items-start vh-100">
      <h1 className="mt-4">Režisér</h1>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div
          className={`bg-dark text-white position-fixed h-100`}
          style={{
            width: '200px',
            left: isSidebarOpen ? '0' : '-200px',
            transition: 'left 0.3s ease',
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <button
            className="btn btn-dark position-absolute"
            style={{
              top: '20px',
              right: '-40px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
          <h1 className="h4 text-center mt-4">
            <Link to="/" className="text-white text-decoration-none" onClick={toggleSidebar}>
              Serus
            </Link>
          </h1>
          <nav className="mt-5">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/tracks" onClick={toggleSidebar}>
                  Skladby
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/director" onClick={toggleSidebar}>
                  Režisér
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/director" element={<Director />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
