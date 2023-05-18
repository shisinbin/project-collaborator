import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

// styles
import './Signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    thumbnail: null,
  });
  const [thumnailError, setThumbnailError] = useState(null);
  const { signup, isPending, error } = useSignup();

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleFileChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        thumbnail: null,
      };
    });

    // get the first file selected
    let selected = event.target.files[0];

    // checks:
    // ... a file was selected
    if (!selected) {
      setThumbnailError('Please select a file');
      return;
    }
    // ... the file is an image
    if (!selected.type.includes('image')) {
      setThumbnailError('Selected file must be an image');
      return;
    }
    // ... the file doesn't exceed file size limit
    if (selected.size > 100000) {
      setThumbnailError('Image file size must be less than 100kb');
      return;
    }

    // reset the error, if any
    setThumbnailError(null);

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        thumbnail: selected,
      };
    });

    console.log('thumbnail updated');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    signup(
      formData.email,
      formData.password,
      formData.displayName,
      formData.thumbnail
    );
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        <span>email:</span>
        <input
          required
          type='email'
          name='email'
          onChange={handleChange}
          value={formData.email}
        />
      </label>
      <label>
        <span>password:</span>
        <input
          required
          type='password'
          name='password'
          onChange={handleChange}
          value={formData.password}
        />
      </label>
      <label>
        <span>display name:</span>
        <input
          required
          type='text'
          name='displayName'
          onChange={handleChange}
          value={formData.displayName}
        />
      </label>
      <label>
        <span>profile thumbnail:</span>
        <input
          required
          type='file'
          name='thumbnail'
          onChange={handleFileChange}
          // value={formData.thumbnail}
        />
      </label>
      {thumnailError && <div className='error'>{thumnailError}</div>}
      {!isPending ? (
        <button className='btn'>Sign up</button>
      ) : (
        <button className='btn' disabled>
          Loading...
        </button>
      )}
      {error && <div className='error'>{error}</div>}
    </form>
  );
}
