import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar  from './components/Navbar'
import { Analytics } from '@vercel/analytics/react'

// Critical pages (load immediately)
import Home  from './pages/Home'
import  Login  from './pages/Login'
import Register  from './pages/Registration'
import  Error  from './pages/Error'
import Loader from './components/Loader' 
import ScrollToTop from './components/ScrollToTop'


// Lazy-loaded pages
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Events = lazy(() => import('./pages/Events'))
const Explore = lazy(() => import('./pages/Explore'))
const Tour = lazy(() => import('./pages/Tour'))
const Logout = lazy(() => import('./pages/Logout'))
const AddItinerary = lazy(() => import('./pages/AddItenirary'))
const AddCity = lazy(() => import('./pages/AddCity'))
const AdminCity = lazy(() => import('./pages/AdminCityDashboard'))
const AdminItinerary = lazy(() => import('./pages/AdminIteniraryDashboard'))
const AdminDashboard = lazy(() => import('./pages/Admin'))
const Hotel = lazy(() => import('./pages/Hotels'))
const CityPlaces = lazy(() => import('./pages/Place'))
const SavedItineraries = lazy(() => import('./pages/SavedItineraries'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const UserPage = lazy(() => import('./pages/UserPage'))
const FriendsPage = lazy(() => import('./pages/FriendsPages'))
const NotificationsPage = lazy(() => import('./pages/Notifications'))
const ItineraryViewer = lazy(() => import('./pages/Itinerary'))
const SeasonalCities = lazy(() => import('./pages/SeasonalCities'))
const City = lazy(() => import('./pages/City'))


export const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/city" element={<Tour />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/explore/seasonal/:season" element={<SeasonalCities />} />
          <Route path="/place" element={<CityPlaces />} />
          <Route path="/saved-itineraries" element={<SavedItineraries />} />
          <Route path="/u/:username" element={<UserPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/city/:cityName" element={<City />} />
          <Route path="/it/:id" element={<ItineraryViewer />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-itinerary" element={<AddItinerary />} />
          <Route path="/admin/add-city" element={<AddCity />} />
          <Route path="/admin/cities" element={<AdminCity />} />
          <Route path="/admin/itineraries" element={<AdminItinerary />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  )
}