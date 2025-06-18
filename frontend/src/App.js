import React from 'react';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateProfileForm from './components/CreateProfileForm';
import ProfileList from './components/ProfileList';
import PublicProfilePage from "./components/PublicProfilePage";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1 className="app-title">Concept Portfolio Creator</h1>
          <nav className="nav-buttons">
            <Link to="/" className="nav-link">Create Profile</Link>
            <Link to="/profiles" className="nav-link">View Profiles</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<CreateProfileForm/>}/>
          <Route path="/profiles" element={<ProfileList/>}/>
          <Route path="/profiles/:slug" element={<PublicProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
