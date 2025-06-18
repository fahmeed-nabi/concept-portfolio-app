import React from 'react';
import { Link } from 'react-router-dom';
import '../css/ProfileCard.css';

const ProfileCard = ({ profile }) => {
  const { name, profile_picture, bio, creative_fields, portfolio_links, slug } = profile;
  const defaultImage = process.env.PUBLIC_URL + '/default-avatar.jpg';

  return (
    <Link to={`/profiles/${slug}`} className="profile-card-link">
      <div className="profile-card">
        <img
          src={profile_picture || defaultImage}
          onError={(e) => (e.target.src = defaultImage)}
          alt={name}
          className="profile-img"
        />

        <h3 className="profile-name">{name}</h3>

        <p className="profile-bio">
          {bio.length > 100 ? bio.slice(0, 100) + '...' : bio}
        </p>

        <div className="profile-tags">
          {creative_fields.map((field) => (
            <span key={field.id} className="tag">
              {field.name}
            </span>
          ))}
        </div>

        <div className="profile-links">
          {portfolio_links.map((link, index) => (
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
      </div>
    </Link>
  );
};

export default ProfileCard;
