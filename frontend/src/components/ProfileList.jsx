import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import SearchBar from './SearchBar';
import '../css/ProfileCard.css';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({ search: '', fields: [] });

  const fetchProfiles = () => {
    const { search, fields } = searchParams;
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    fields.forEach((id) => params.append('creative_fields', id));
    params.append('page', page);

    axios.get(`http://127.0.0.1:8000/api/profiles/?${params.toString()}`)
      .then((res) => {
        setProfiles(res.data.results);
        setCount(res.data.count);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProfiles();
  }, [page, searchParams]);

  const totalPages = Math.ceil(count / 9);

  const handleSearch = (params) => {
    setPage(1); // reset page on new search
    setSearchParams(params);
  };

  return (
    <div className="profile-list-container">
      <SearchBar onSearch={handleSearch} />

      <div className="profile-count">
        Showing {profiles.length} of {count} creators
      </div>

      <div className="profile-grid">
        {profiles.map((profile, index) => (
            <motion.div
                key={profile.id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: index * 0.05}}
            >
              <ProfileCard profile={profile}/>
            </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileList;