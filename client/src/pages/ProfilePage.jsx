import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const ProfilePage = () => {
  const { API, user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setProfile(user);
        setFormData({
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, user]);

  // Fetch saved itineraries
  useEffect(() => {
    const fetchSavedItineraries = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch(`${API}/api/itineraries/clone`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch itineraries');
        }

        const data = await response.json();
        setSavedItineraries(data);
      } catch (error) {
        console.error('Error fetching saved itineraries:', error);
      }
    };

    if (activeTab === 'itineraries') {
      fetchSavedItineraries();
    }
  }, [isAuthenticated, activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setUpdateError(null);

    try {
      const response = await fetch(`${API}/api/auth/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfile(updatedUser);
      setIsEditing(false);
      setUpdateSuccess(true);
      
      // Show success message then hide after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateError(error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
          <svg className="w-16 h-16 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <h2 className="text-2xl font-bold mt-4 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute left-0 right-0 -bottom-16 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profile?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Name and Role Badge */}
          <div className="mt-16 text-center">
            <h1 className="text-3xl font-bold text-gray-800">{profile?.username || 'User'}</h1>
            <div className="mt-2 flex justify-center">
              {profile?.isAdmin && (
                <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow">
                  Admin
                </span>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('itineraries')}
                  className={`${
                    activeTab === 'itineraries'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  Saved Itineraries
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`${
                    activeTab === 'security'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  Security
                </button>
              </nav>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-3xl mx-auto">
                {updateSuccess && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Profile updated successfully!
                  </div>
                )}
                
                {updateError && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    {updateError}
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Username</p>
                          <p className="mt-1 text-lg text-gray-800">{profile?.username}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="mt-1 text-lg text-gray-800">{profile?.email}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Phone</p>
                          <p className="mt-1 text-lg text-gray-800">{profile?.phone}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Account Type</p>
                          <p className="mt-1 text-lg text-gray-800">
                            {profile?.isAdmin ? 'Administrator' : 'Regular User'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Saved Itineraries Tab */}
            {activeTab === 'itineraries' && (
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Your Saved Itineraries</h2>
                  <Link 
                    to="/explore" 
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Explore New Itineraries
                  </Link>
                </div>
                
                {savedItineraries.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg shadow">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved itineraries yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Start exploring cities and create your personalized travel plans to see them here.
                    </p>
                    <div className="mt-6">
                      <Link 
                        to="/explore" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Start Exploring
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedItineraries.map((itinerary) => (
                      <div key={itinerary._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-xl font-bold text-white">{itinerary.city}</h3>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">Created: {formatDate(itinerary.createdAt)}</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {itinerary.totalDays} {itinerary.totalDays === 1 ? 'Day' : 'Days'}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-gray-700 mb-3">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Budget: ${itinerary.userBudget}
                          </div>
                          
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-500 mb-1">Places to Visit:</div>
                            <div className="flex flex-wrap gap-2">
                              {itinerary.selectedPlaces.slice(0, 3).map((place, index) => (
                                <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                  {place.name}
                                </span>
                              ))}
                              {itinerary.selectedPlaces.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  +{itinerary.selectedPlaces.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between mt-4">
                            <Link 
                            //   to={`/itinerary/${itinerary._id}`}
                              to={`/saved-itineraries`}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center text-sm font-medium"
                            >
                              View Details
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </Link>
                            
                            <button className="text-gray-500 hover:text-gray-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-50 rounded-lg shadow p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Security</h2>
                    
                    <div className="space-y-6">
                      {/* <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div>
                          <h3 className="font-medium text-gray-900">Password</h3>
                          <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Change Password
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div>
                          <h3 className="font-medium text-gray-900">Login Sessions</h3>
                          <p className="text-sm text-gray-500 mt-1">Manage your active sessions and sign out from other devices.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                          Manage Sessions
                        </button>
                      </div> */}
                      
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg shadow-sm border border-yellow-200">
                        <div>
                          <h3 className="font-medium text-yellow-800">Delete Account</h3>
                          <p className="text-sm text-yellow-700 mt-1">Permanently delete your account and all your data.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage