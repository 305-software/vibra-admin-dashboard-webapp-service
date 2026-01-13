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
import BusinessVerification from "./containers/businessVerification";
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
          <Route path="/businessVerification" element={<UserProvider><BusinessVerification /></UserProvider>} />
          <Route path="/otp" element={<UserProvider><Otp /></UserProvider>} />
          <Route path="/forgotPassword" element={<UserProvider><ForgotPassword /></UserProvider>} />
          <Route path="/resetPassword" element={<UserProvider><ResetPassword /></UserProvider>} />

          <Route path="dashboard" element={<ProtectedRoute><UserProvider><Main><Dashboard /></Main></UserProvider></ProtectedRoute>} />
          <Route path="eventList" element={<ProtectedRoute><UserProvider><Main><EventList /></Main></UserProvider></ProtectedRoute>} />
          <Route path="/eventList/createEvent/:id" element={<ProtectedRoute><UserProvider><Main><EditEvent /></Main></UserProvider></ProtectedRoute>} />
          <Route path="/eventList/createEvent" element={<ProtectedRoute><UserProvider><Main><CreateEvent /></Main></UserProvider></ProtectedRoute>} />
          <Route path="booking" element={<ProtectedRoute><UserProvider><Main><Booking /></Main></UserProvider></ProtectedRoute>} />
          <Route path="/eventList/viewDetails/:id" element={<ProtectedRoute><UserProvider><Main><ViewDetails /></Main></UserProvider></ProtectedRoute>} />
          <Route path="customer" element={<ProtectedRoute><UserProvider><Main><Customer /></Main></UserProvider></ProtectedRoute>} />
          <Route path="transaction" element={<ProtectedRoute><UserProvider><Main><Transaction /></Main></UserProvider></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><UserProvider><Main><Setting /></Main></UserProvider></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute><UserProvider><Main><Analytics /></Main></UserProvider></ProtectedRoute>} />
        </Routes>

        {/* Global Toast Notification Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default App;
