import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './store/auth.jsx'
import {ToastContainer, Bounce } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import {App} from './App'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="982582505218-13jkb29neha7n0stl5ltvao2hin2u0cu.apps.googleusercontent.com">
    <AuthProvider>
      <StrictMode>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
          bodyClassName="toastBody"
        />
      </StrictMode>
    </AuthProvider>
  </GoogleOAuthProvider>

  
)
