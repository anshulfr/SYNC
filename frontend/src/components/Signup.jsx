import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $profilePicture: String) {
    signup(username: $username, email: $email, password: $password, profilePicture: $profilePicture) {
      user {
        id
        username
      }
      token
    }
  }
`

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: ''
  });
  const navigate = useNavigate();
  const [signup, { loading }] = useMutation(SIGNUP, {
    onCompleted: data => {
      localStorage.setItem('token', data.signup.token);
      navigate('/Login');
    },
    onError: error => {
      console.log(error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup({
        variables: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          profilePicture: formData.profilePicture
        }
      });
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://freeiconshop.com/wp-content/uploads/edd/sync-flat.png"
            alt="Sync"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
           
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-gray-800 border border-purple-500 placeholder-gray-500 text-gray-300 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm mb-4"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-gray-800 border border-purple-500 placeholder-gray-500 text-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm mb-4"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 bg-gray-800 border border-purple-500 placeholder-gray-500 text-gray-300 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm mb-4"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label 
              htmlFor="profile-picture" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Profile Picture
            </label>
            <label 
              htmlFor="profile-picture" 
              className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-gray-800 hover:bg-gray-700"
            >
              <img 
                src="https://cdn-icons-png.flaticon.com/128/8191/8191581.png" 
                alt="Upload Icon" 
                className="w-6 h-6 mr-2"
              />
              <input 
                id="profile-picture" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {formData.profilePicture && (
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={formData.profilePicture} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
            <h3 className='text-gray-300 text-sm mt-4'>Already have an account? <Link to="/Login" className="text-purple-500 hover:text-purple-700">Sign in</Link></h3>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;