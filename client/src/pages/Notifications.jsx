import React, { useEffect, useState } from 'react';
import { useAuth } from '../store/auth';

const NotificationsPage = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const {API} = useAuth()

  useEffect(() => {
    fetch(`${API}/api/auth/user`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        setFriendRequests(data.userData.friendRequests || []);
        setUsername(data.userData.username);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const handleAction = async (id, action) => {
    const endpoint =
      action === 'accept'
        ? `${API}/api/friends/accept`
        : `${API}/api/friends/reject`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ requesterId: id })
    });

    if (res.ok) {
      // Immediately remove the handled request from UI
      setFriendRequests(prev => prev.filter(req => req.from !== id));
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-6 flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow-md">
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            {friendRequests.length} new
          </span>
        </div>
      </div>

      <div className="p-2 md:p-4">
        {friendRequests.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <p className="text-gray-500 font-medium">You're all caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No new friend requests</p>
          </div>
        ) : (
          <div className="space-y-2">
            {friendRequests.map(req => (
              <div
                key={req.from}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {(req.fromUsername || username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      <span className="font-semibold">{req.fromUsername || 'Someone'}</span>
                      <span className="text-gray-500"> sent you a friend request</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date().toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        hour: 'numeric', 
                        minute: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    onClick={() => handleAction(req.from, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none"
                    onClick={() => handleAction(req.from, 'reject')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage