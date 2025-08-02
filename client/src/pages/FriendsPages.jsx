import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/auth';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const {API} = useAuth()

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/friends/list`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await res.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, []);

  // Helper function to get initials for avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  // Helper to generate a random gradient for avatars
  const getRandomGradient = (seed) => {
    const gradients = [
      'from-pink-500 to-purple-500',
      'from-blue-500 to-teal-500',
      'from-green-500 to-teal-400',
      'from-yellow-400 to-orange-500',
      'from-purple-600 to-indigo-500',
      'from-red-500 to-pink-500'
    ];
    
    // Use the string to create a "random" but consistent index
    const index = seed ? seed.charCodeAt(0) % gradients.length : 0;
    return gradients[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4">
      {/* Decorative elements */}
      
      {/* Content */}
      <div className=" mx-auto mt-6 backdrop-blur-sm bg-white bg-opacity-80 rounded-xl shadow-xl overflow-hidden border border-white border-opacity-30 relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-5 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Friends</h2>
            <span className="bg-white bg-opacity-30 backdrop-blur-sm text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {friends.length} total
            </span>
          </div>
        </div>

        {/* Friends list */}
        <div className="p-5">
          {friends.length === 0 ? (
            <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-8 text-center shadow-md">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4 shadow-lg">
                <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <p className="text-gray-700 font-bold text-xl mb-2">No friends yet</p>
              <p className="text-gray-600">Connect with others to build your network</p>
              <Link to="/find-friends" className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-2 px-6 rounded-full font-medium transition-all shadow-md hover:shadow-lg">
                Find Friends
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {friends.map(friend => (
                <Link 
                  to={`/u/${friend.username}`} 
                  key={friend._id} 
                  className="flex items-center bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-white border-opacity-50 cursor-pointer transform hover:-translate-y-1"
                >
                  {/* Avatar */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${getRandomGradient(friend.username)} flex items-center justify-center text-white font-bold text-lg shadow-md mr-4`}>
                    {getInitials(friend.username)}
                  </div>
                  
                  {/* User info */}
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 text-lg">{friend.username}</p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-purple-100 transition-colors text-purple-600" title="Send message">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm" title="View profile">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FriendsPage