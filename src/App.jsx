import "./App.css";
import './stylesheets/style.scss';
import 'react-toastify/dist/ReactToastify.css';

import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AuthProvider from "./components/context/authProvider";
import ProtectedRoute from "./components/context/protectedRoute";
import UserProvider from "./components/context/userContext";
import EditEvent from "./components/createEvent/editEvent";
import ViewDetails from "./components/eventList/viewDetails";
import ForgotPassword from "./components/login/forgotPassword";
import Login from "./components/login/login";
import Otp from "./components/login/otp";
import ResetPassword from "./components/login/resetPassword";
import VerifyIp from "./components/login/verifyIp";
import Analytics from "./containers/analytics";
import Booking from "./containers/booking";
import CreateEvent from "./containers/createEvent";
import Customer from "./containers/customer";
import Dashboard from "./containers/dashboard";
import EventList from "./containers/eventList";
import Setting from "./containers/setting";
import Transaction from "./containers/transaction";
import Main from "./layout/main";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<UserProvider><Login /></UserProvider>} />
          <Route path="/login" element={<UserProvider><Login /></UserProvider>} />
          <Route path="/verifyIp" element={<UserProvider><VerifyIp /></UserProvider>} />
          <Route path="/otp" element={<UserProvider><Otp /></UserProvider>} />
          <Route path="/forgotPassword" element={<UserProvider><ForgotPassword /></UserProvider>} />
          <Route path="/resetPassword" element={<UserProvider><ResetPassword /></UserProvider>} />

          <Route path="dashboard" element={<ProtectedRoute><Main><Dashboard /></Main></ProtectedRoute>} />
          <Route path="eventList" element={<ProtectedRoute><Main><EventList /></Main></ProtectedRoute>} />
          <Route path="/eventList/createEvent/:id" element={<ProtectedRoute><Main><EditEvent /></Main></ProtectedRoute>} />
          <Route path="/eventList/createEvent" element={<ProtectedRoute><Main><CreateEvent /></Main></ProtectedRoute>} />
          <Route path="booking" element={<ProtectedRoute><Main><Booking /></Main></ProtectedRoute>} />
          <Route path="/eventList/viewDetails/:id" element={<ProtectedRoute><Main><ViewDetails /></Main></ProtectedRoute>} />
          <Route path="customer" element={<ProtectedRoute><Main><Customer /></Main></ProtectedRoute>} />
          <Route path="transaction" element={<ProtectedRoute><Main><Transaction /></Main></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Main><Setting /></Main></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute><Main><Analytics /></Main></ProtectedRoute>} />
        </Routes>

        {/* Global Toast Notification Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default App;
