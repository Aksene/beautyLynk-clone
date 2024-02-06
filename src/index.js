import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from './Auth/auth'
import { AuthProvider2 } from './Auth/auth2'

// Pages
import Home from './pages/Home';
import BookNow from './pages/BookNow';
import Advisor from './pages/Advisor'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookingConfirm from './pages/BookingConfirm'
import BookingDetails from './pages/BookingDetails';
import UploadImages from './pages/Upload';
import StylistProfileEdit from './pages/StylistProfileEdit';
import StylistProfile from './pages/StylistProfile';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';

import ProtectedRoute from './components/ProtectedRoute';
import Playground from './pages/Playground'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider2>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path={"professionals"} element={<App/>}/>
        <Route path={"book-now"} element={<BookNow/>}/>
        <Route path={"book-now/:type"} element={<BookNow/>}/>
        <Route path={"playground"} element={<Playground/>}/>
        <Route path={"advisor"} element={<Advisor/>}/>
        <Route path={"dashboard"} element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
        <Route path={"dashboard/:type"} element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
        <Route path={"booking-confirmation/"} element={<ProtectedRoute> <BookingConfirm/> </ProtectedRoute>}/>
        <Route path={"booking-confirmation/:type"} element={<ProtectedRoute> <BookingConfirm/> </ProtectedRoute>}/>
        <Route path={"booking-details/"} element={<ProtectedRoute> <BookingDetails/> </ProtectedRoute>}/>
        <Route path={"booking-details/:type"} element={<ProtectedRoute> <BookingDetails/> </ProtectedRoute>}/>
        <Route path={"upload/"} element={<ProtectedRoute> <UploadImages/> </ProtectedRoute>}/>
        <Route path={"upload/:type"} element={<ProtectedRoute> <UploadImages/> </ProtectedRoute>}/>
        <Route path={"profile/"} element={<ProtectedRoute> <StylistProfile/> </ProtectedRoute>}/>
        <Route path={"profile/:type"} element={<ProtectedRoute> <StylistProfile/> </ProtectedRoute>}/>
        <Route path={"login"} element={<Login/>}/>
        <Route path={"register"} element={<Register/>}/>
        <Route path={"contact-us"} element={<ContactUs/>}/>
        <Route path={"about-us"} element={<AboutUs/>}/>
      </Routes>
    </BrowserRouter>
  </AuthProvider2>
);
