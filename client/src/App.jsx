import React from 'react'
import { BrowserRouter,Routes,Route } from "react-router-dom"
import { Login } from "./pages/Login"
import { Register } from "./pages/Registration"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"
import { Events } from "./pages/Events"
import { Explore } from "./pages/Explore"
import { Home } from "./pages/Home"
import { Tour } from "./pages/Tour"
import { Navbar } from "./components/Navbar"
import { Logout } from "./pages/Logout"
// import { Testing } from "./pages/Testing"
import { AddItinerary } from "./pages/AddItenirary"
import { Error } from "./pages/Error"
import { AddCity } from "./pages/AddCity"
// import Sydney from "./components/Sydney"
import { AdminCity } from "./pages/AdminCityDashboard"
// import InteractiveGlobe from './pages/globe'
import { AdminItinerary } from './pages/AdminIteniraryDashboard'
import { AdminDashboard } from './pages/Admin'
// import { EventFetcher } from './pages/EventScrape'
import { Hotel } from './pages/Hotels'
import { CityPlaces } from './pages/Place'
import { SavedItineraries } from './pages/SavedItineraries'
import { ProfilePage } from './pages/ProfilePage'
import { UserPage } from './pages/UserPage'
import { FriendsPage } from './pages/FriendsPages'
import { NotificationsPage } from './pages/Notifications'
// import { Testing2 } from './pages/Testing2'
import { ItineraryViewer } from './pages/Itinerary'
import SeasonalCities from './pages/SeasonalCities'
import City from './pages/City'


export const App = () => {

    return(<>

        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/events" element={<Events/>} />
                <Route path="/explore" element={<Explore/>} />
                <Route path="/city" element={<Tour/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/hotel" element={<Hotel/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/logout" element={<Logout/>} />
                {/* <Route path="/testing" element={<Testing/>} /> */}
                {/* <Route path="/globe" element={<InteractiveGlobe/>} /> */}
                {/* <Route path="/event-scrape" element={<EventFetcher/>} /> */}
                {/* <Route path="/explore/sydney" element={<Sydney/>} /> */}
                <Route path="/explore/seasonal/:season" element={<SeasonalCities/>} />
                <Route path="/place" element={<CityPlaces/>} />
                <Route path="/saved-itineraries" element={<SavedItineraries />} />
                <Route path="/u/:username" element={<UserPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/city/:cityName" element={<City />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/it/:id" element={<ItineraryViewer />} />

                <Route path="/admin" element={<AdminDashboard/>} />
                <Route path="/admin/add-itinerary" element={<AddItinerary/>} />
                <Route path="/admin/add-city" element={<AddCity/>} />
                <Route path="/admin/cities" element={<AdminCity/>} />
                <Route path="/admin/itineraries" element={<AdminItinerary/>} />

                <Route path="*" element={<Error/>} />
                {/* <Route path="/test" element={<Testing2/>} /> */}
                
            </Routes>
        </BrowserRouter>
    </>)

}