import React, { useState, useEffect } from "react";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom"; // Added import for Navigate
import { Link, useLocation } from 'react-router-dom';

export const AdminDashboard = () => {
    const { user, isLoading, isAuthenticated, authorizationToken, API } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        admins: 0,
        regularUsers: 0
    });
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        isAdmin: false
    });

    // Fetch all users data (for admin only)
    const getAllUsersData = async () => {
        try {
            setIsUsersLoading(true);
            const response = await fetch(`${API}/api/auth/users`, {
                method: "GET",
                headers: {
                    Authorization: authorizationToken,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.userData);
                
                // Calculate stats
                const admins = data.userData.filter(user => user.isAdmin).length;
                setStats({
                    totalUsers: data.userData.length,
                    admins: admins,
                    regularUsers: data.userData.length - admins
                });
            } else {
                toast.error("Failed to fetch users data");
            }
        } catch (error) {
            console.error("Error fetching users data:", error);
            toast.error("Something went wrong while fetching users");
        } finally {
            setIsUsersLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.isAdmin) {
            getAllUsersData();
        }
    }, [user]);

    // Handle updating a user
    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin
        });
        setShowUpdateModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/api/auth/users/${selectedUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authorizationToken,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("User updated successfully");
                setShowUpdateModal(false);
                getAllUsersData(); // Refresh users list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Something went wrong while updating user");
        }
    };

    // Handle deleting a user
    const handleDeleteUser = async (userId) => {
        toast(
          ({ closeToast }) => (
            <div className="delete-confirmation">
              <div className="confirmation-icon">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#ff4757" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              
              <h3 className="confirmation-title">Delete User</h3>
              <p className="confirmation-message">Are you sure you want to delete this user? This action cannot be undone.</p>
              
              <div className="confirmation-actions">
                <button
                  onClick={closeToast}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    closeToast();
                    try {
                      // Show loading toast
                      const loadingId = toast.loading("Deleting user...");
                      
                      const response = await fetch(`${API}/api/auth/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                          Authorization: authorizationToken,
                        },
                      });
                      
                      // Dismiss loading toast
                      toast.dismiss(loadingId);
                      
                      if (response.ok) {
                        toast.success("User successfully deleted", {
                          icon: "🗑️",
                        });
                        getAllUsersData(); // Refresh users list
                      } else {
                        const errorData = await response.json();
                        toast.error(errorData.message || "Failed to delete user");
                      }
                    } catch (error) {
                      console.error("Error deleting user:", error);
                      toast.error("Something went wrong while deleting user");
                    }
                  }}
                  className="btn-delete"
                >
                  Delete User
                </button>
              </div>
            </div>
          ),
          {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            className: "custom-toast-confirmation",
            hideProgressBar: true,
          }
        );
      };
      
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user || !user.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                    <div className="text-center">
                        <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="mt-4 text-2xl font-bold text-gray-800">Access Denied</h2>
                        <p className="mt-2 text-gray-600">Sorry, you don't have permission to access the admin dashboard.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Admin Header */}
                <div className="bg-white rounded-xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                                <span className="text-black font-medium">Welcome, {user.username}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Admin Card */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 shadow">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-indigo-100 rounded-full p-3">
                                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Your Profile</h3>
                                        <p className="text-sm text-gray-600">Admin User</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Username:</span>
                                        <span className="text-sm font-medium text-gray-800">{user.username}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Email:</span>
                                        <span className="text-sm font-medium text-gray-800">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Phone:</span>
                                        <span className="text-sm font-medium text-gray-800">{user.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Role:</span>
                                        <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Administrator
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats Cards */}
                            <div className="bg-white rounded-lg p-6 shadow">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Statistics</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-600">Total Users</span>
                                            <span className="text-sm font-medium text-gray-800">{stats.totalUsers}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 rounded-full h-2" style={{ width: '100%' }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-600">Admin Users</span>
                                            <span className="text-sm font-medium text-gray-800">{stats.admins}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-indigo-600 rounded-full h-2" style={{ width: `${(stats.admins / stats.totalUsers) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-600">Regular Users</span>
                                            <span className="text-sm font-medium text-gray-800">{stats.regularUsers}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-500 rounded-full h-2" style={{ width: `${(stats.regularUsers / stats.totalUsers) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg p-6 shadow">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition">
                                        <svg className="h-6 w-6 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Add User</span>
                                    </button>
                                    
                                    <button className="flex flex-col items-center justify-center bg-indigo-50 rounded-lg p-4 hover:bg-indigo-100 transition">
                                        <svg className="h-6 w-6 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                                    </button>
                                    
                                    <button className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4 hover:bg-green-100 transition">
                                        <svg className="h-6 w-6 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Reports</span>
                                    </button>
                                    
                                    <Link to="/logout" className="flex flex-col items-center justify-center bg-red-50 rounded-lg p-4 hover:bg-red-100 transition">
                                        <svg className="h-6 w-6 text-red-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users List Section */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">User Management</h2>
                    </div>
                    
                    <div className="p-6">
                        {isUsersLoading ? (
                            <div className="text-center py-12">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="mt-3 text-gray-600">Loading users data...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <p className="mt-4 text-lg text-gray-700">No users found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-50 text-left">
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Username</th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Phone</th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-800">{user.username}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                                                <td className="px-4 py-3 text-sm text-gray-800">{user.phone}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {user.isAdmin ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            className="p-1 rounded-md hover:bg-indigo-50 text-indigo-600"
                                                            onClick={() => handleUpdateClick(user)}
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Update user
                                                        </button>
                                                        <button 
                                                            className="p-1 rounded-md hover:bg-red-50 text-red-600"
                                                            onClick={() => handleDeleteUser(user._id)}
                                                        >
                                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete User
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Update User Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update User</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={formData.isAdmin}
                                        onChange={handleFormChange}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">Admin User</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

