import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../store/auth";

const UserPage = () => {
  const { username } = useParams();
  const { API,authorizationToken, user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/auth/users/${username}`, {
          headers: {
            Authorization: authorizationToken,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setProfileUser(data.userProfile);
          // console.log("User is : ",user);
          // Check if we've already sent a request
          if (data.userProfile.friendRequests?.some(req => 
            req.from === user?._id || req.to === user?._id)) {
            setRequestSent(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, authorizationToken, user]);

  const sendFriendRequest = async () => {
    try {
      const res = await fetch(`${API}/api/friends/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ recipientId: profileUser._id }),
      });

      if (res.ok) {
        setRequestSent(true);
      } else {
        console.error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md text-center">
        <div className="text-red-500 text-xl font-medium">User not found</div>
        <p className="text-gray-500 mt-2">This profile doesn't exist or may have been removed.</p>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-blue">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Cover photo */}
        <div className="h-40 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        
        {/* Profile header */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-white shadow-md">
            {getInitials(profileUser.username)}
          </div>
          
          {/* Username and add friend button */}
          <div className="flex justify-between items-start pt-16 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profileUser.username}
              </h1>
              <p className="text-gray-500 text-sm">
                Joined {new Date().toLocaleDateString()}
              </p>
            </div>
            
            {user && user.username !== profileUser.username && (
              <div>
                {requestSent ? (
                  <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center">
                    <span className="mr-2">Request Sent</span>
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                ) : (
                  <div>
                  {profileUser.friends.includes(user._id) ? (
  <button 
    className="bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-colors duration-200"
    disabled
  >
    <span className="text-green-600">✓</span>
    Already friend
  </button>
) : (
  <button 
    className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
    onClick={sendFriendRequest}
  >
    <span>+</span>
    Add Friend
  </button>
)}

                  </div>
                  
                )}
              </div>
            )}
          </div>
          
          {/* Divider */}
          <div className="border-b border-gray-200 my-4"></div>
          
          {/* Profile info */}
          <div className="mt-6 space-y-4">
            <div className="flex">
              <div className="w-8 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{profileUser.email}</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="w-8 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-800">{profileUser.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 border-t border-gray-200">
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{profileUser.itineraries.length}</p>
            <p className="text-sm text-gray-500">Itineraries</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{profileUser.friends.length}</p>
            <p className="text-sm text-gray-500">Friends</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500">Photos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserPage