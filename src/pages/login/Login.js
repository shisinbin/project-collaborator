import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';

// styles
import './Login.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, isPending, error } = useLogin();

  const handleChange = (event) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(formData.email, formData.password);
    // console.log('formData', formData);
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      {!isPending ? (
        <button className='btn'>Login</button>
      ) : (
        <button className='btn' disabled>
          Loading...
        </button>
      )}
      {error && <div className='error'>{error}</div>}
    </form>
  );
}
