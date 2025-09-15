import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    farmType: 'poultry',
    farmSize: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register Your Farm</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <select
              value={formData.farmType}
              onChange={(e) => setFormData({...formData, farmType: e.target.value})}
            >
              <option value="poultry">Poultry Farm</option>
              <option value="pig">Pig Farm</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Farm Size (acres)"
              value={formData.farmSize}
              onChange={(e) => setFormData({...formData, farmSize: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>
    </div>
  );
};

export default Register;
