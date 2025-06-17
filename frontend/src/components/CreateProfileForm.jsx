import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CreateProfileForm.css';

const CreateProfileForm = () => {
  const MAX_NAME_LENGTH = 50;
  const MAX_BIO_LENGTH = 250;
  const DEFAULT_IMAGE_URL = '/default-avatar.jpg';

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profile_picture: null,
    creative_fields: [],
    portfolio_links: [{ url: '', label: '' }],
  });

  const [creativeFields, setCreativeFields] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/creative-fields/')
      .then((res) => setCreativeFields(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (submitMessage) {
      const timeout = setTimeout(() => setSubmitMessage(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [submitMessage]);

  useEffect(() => {
    if (submitMessage) {
      setFadeOut(false); // reset on new message

      const fadeTimer = setTimeout(() => setFadeOut(true), 3000); // start fade after 3s
      const removeTimer = setTimeout(() => setSubmitMessage(null), 4000); // remove after 5s

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [submitMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profile_picture: file }));
    if (file) setPreviewURL(URL.createObjectURL(file));
  };

  const handleCreativeFieldsToggle = (fieldId) => {
    setFormData((prev) => {
      const updated = prev.creative_fields.includes(fieldId)
        ? prev.creative_fields.filter(id => id !== fieldId)
        : [...prev.creative_fields, fieldId];
      return { ...prev, creative_fields: updated };
    });
  };

  const handlePortfolioLinkChange = (index, e) => {
    const newLinks = [...formData.portfolio_links];
    newLinks[index][e.target.name] = e.target.value;
    setFormData((prev) => ({ ...prev, portfolio_links: newLinks }));
  };

  const addPortfolioLink = () => {
    if (formData.portfolio_links.length < 3) {
      setFormData((prev) => ({
        ...prev,
        portfolio_links: [...prev.portfolio_links, { url: '', label: '' }],
      }));
    }
  };

  const removePortfolioLink = (index) => {
    if (formData.portfolio_links.length <= 1) return;
    const updated = formData.portfolio_links.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, portfolio_links: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('bio', formData.bio);
    if (formData.profile_picture) {
      data.append('profile_picture', formData.profile_picture);
    }
    for (const id of formData.creative_fields) {
      data.append('creative_fields', id);
    }
    data.append('portfolio_links_json', JSON.stringify(formData.portfolio_links));

    try {
      await axios.post('http://127.0.0.1:8000/api/profiles/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSubmitMessage('Profile created successfully!');
      setIsError(false);
    } catch (err) {
      console.error(err);
      setSubmitMessage('Error: Something went wrong.');
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h1>Create Your Profile</h1>

      <div className="form-grid">
        {/* LEFT: Name, Bio, Upload, Preview */}
        <div className="form-left">
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              maxLength={MAX_NAME_LENGTH}
              value={formData.name}
              onChange={handleChange}
              required
            />
            <small>{MAX_NAME_LENGTH - formData.name.length} characters remaining</small>
          </div>

          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              rows={6}
              maxLength={MAX_BIO_LENGTH}
              value={formData.bio}
              onChange={handleChange}
              required
              style={{ resize: 'none' }}
            />
            <small>{MAX_BIO_LENGTH - formData.bio.length} characters remaining</small>
          </div>

          <div>
            <label>Profile Picture</label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <label htmlFor="profile_picture" className="custom-file-upload">
              Upload Profile Picture
            </label>

            <div className="preview-container">
              <img
                src={previewURL || DEFAULT_IMAGE_URL}
                alt="Preview"
                className="preview-img"
              />
              {previewURL && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, profile_picture: null }));
                    setPreviewURL(null);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Links + Tags */}
        <div className="form-right">
          <label>Portfolio Links</label>
          {formData.portfolio_links.map((link, index) => (
            <div key={index} className="portfolio-link-row">
              <div className="portfolio-link-fields">
                <input
                  type="text"
                  name="url"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) => handlePortfolioLinkChange(index, e)}
                  required
                />
                <input
                  type="text"
                  name="label"
                  placeholder="Label (e.g., Instagram, Website)"
                  value={link.label}
                  onChange={(e) => handlePortfolioLinkChange(index, e)}
                />
              </div>
              {formData.portfolio_links.length > 1 && (
                <button
                  type="button"
                  className="remove-link-btn"
                  onClick={() => removePortfolioLink(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {formData.portfolio_links.length < 3 && (
            <button type="button" className="add-link-btn" onClick={addPortfolioLink}>
              + Add Another Link
            </button>
          )}

          <div>
            <label>Creative Fields</label>
            <div className="tag-options">
              {creativeFields.map(field => (
                <button
                  key={field.id}
                  type="button"
                  className={`tag-option ${formData.creative_fields.includes(field.id) ? 'selected' : ''}`}
                  onClick={() => handleCreativeFieldsToggle(field.id)}
                >
                  {field.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit">Submit</button>
      </div>

      {submitMessage && (
        <div className={`submit-message ${isError ? 'error' : 'success'} ${fadeOut ? 'fade-out' : ''}`}>
          {submitMessage}
        </div>
      )}

    </form>
  );
};

export default CreateProfileForm;
