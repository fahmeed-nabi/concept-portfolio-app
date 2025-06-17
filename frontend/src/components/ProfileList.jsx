import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import '../ProfileCard.css';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/profiles/')
      .then((res) => setProfiles(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="profile-list-container">
      <h2>Featured Creators</h2>
      <div className="profile-grid">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default ProfileList;