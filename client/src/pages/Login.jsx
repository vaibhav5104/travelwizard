import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { storeTokenInLS, API } = useAuth();

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const res_data = await response.json();
            if (response.ok) {
                storeTokenInLS(res_data.token);
                setUser({ email: "", password: "" });
                toast.success("Login successful");
                navigate("/");
            } else {
                toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
            }
        } catch (e) {
            console.log("error is  : ", e);
        }
    };

    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API}/api/auth/google-login`, {
                credential: credentialResponse.credential,
            });

            const data = res.data;
            if (data.token) {
                storeTokenInLS(data.token);
                toast.success("Login successful with Google");
                navigate("/");
            } else {
                toast.error("No token received from Google login");
            }

        } catch (err) {
            console.error("Google login error: ", err);
            toast.error("Google login failed");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                {/* Floating Elements */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-300 bg-opacity-20 rounded-full animate-bounce"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-300 bg-opacity-15 rounded-full animate-pulse"></div>
                <div className="absolute bottom-32 right-10 w-12 h-12 bg-green-300 bg-opacity-20 rounded-full animate-bounce"></div>
                
                {/* Travel Icons Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-white text-opacity-5 text-8xl">
                        ✈️
                    </div>
                    <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 translate-y-1/2 text-white text-opacity-5 text-6xl">
                        🗺️
                    </div>
                    <div className="absolute top-1/2 left-1/6 transform -translate-x-1/2 -translate-y-1/2 text-white text-opacity-5 text-7xl">
                        🏖️
                    </div>
                    <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2 text-white text-opacity-5 text-5xl">
                        🏔️
                    </div>
                </div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    {/* Login Card */}
                    <div className="bg-gray-900 bg-opacity-60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-600 border-opacity-50">
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-pink-500 group-focus-within:text-pink-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required
                                                autoComplete="email"
                                                value={user.email}
                                                onChange={handleInput}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition-all duration-200 bg-gray-700 focus:bg-gray-600"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-pink-500 group-focus-within:text-pink-400 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                required
                                                autoComplete="current-password"
                                                value={user.password}
                                                onChange={handleInput}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none transition-all duration-200 bg-gray-700 focus:bg-gray-600"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-300"
                                    >
                                        <span className="flex items-center justify-center">
                                            Start Your Journey
                                            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-600"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-gray-800 text-gray-200 font-medium">Or explore with</span>
                                    </div>
                                </div>

                                {/* Social Login Buttons */}
                                <div className="mt-6 space-y-3">
                                    <div className="w-full transform hover:scale-105 transition-transform duration-200">
                                        <GoogleLogin
                                            onSuccess={handleSuccess}
                                            onError={() => console.log('Login Failed')}
                                            width="100%"
                                            size="large"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <div className="text-sm">
                                    <span className="text-gray-400">New to adventures?</span>{" "}
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300 hover:to-rose-300 focus:outline-none transition-all duration-200"
                                    >
                                        SignUp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;