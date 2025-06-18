import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/PublicProfilePage.css';

const PublicProfilePage = () => {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);

  const defaultImage = process.env.PUBLIC_URL + '/default-avatar.jpg';

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/profiles/slug/${slug}/`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [slug]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="public-profile">
      <h2>{profile.name}</h2>

      <img
        src={profile.profile_picture || defaultImage}
        alt={profile.name}
        className="profile-img-lg"
        onError={(e) => e.target.src = defaultImage}
      />

      <p className="profile-bio-lg">{profile.bio}</p>

      <div className="profile-tags-lg">
        {profile.creative_fields.map(field => (
          <span key={field.id} className="tag">{field.name}</span>
        ))}
      </div>

      <div className="profile-links">
        {profile.portfolio_links.map((link, index) => (
            <a
                key={index}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link-button"
            >
                {link.label || 'Link'}
            </a>
        ))}
      </div>

        {profile.skills && (
            <div className="profile-skills">
                <div className="skills-header">
                    <h4>Skills</h4>
                </div>
                <p>{profile.skills}</p>
        </div>
      )}
    </div>
  );
};

export default PublicProfilePage;
