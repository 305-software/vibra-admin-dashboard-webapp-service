
/**
 * Header Component
 * 
 * A responsive header component that displays the application logo, user profile information,
 * and options for searching, language selection, and logging out. It includes a notification icon 
 * and handles user interactions such as profile navigation and logout confirmation.
 * 
 * @component
 * @example
 * return <Header toggleSidebar={toggleSidebarFunction} isOpen={isSidebarOpen} />;
 * 
 * @param {Object} props - The component props.
 * @param {function} props.toggleSidebar - Function to toggle the sidebar visibility.
 * @param {boolean} props.isOpen - Indicates if the sidebar is currently open.
 * 
 * @returns {JSX.Element} The rendered Header component.
 * 
 * @state
 * - `isMobile`: Boolean indicating if the viewport width is less than or equal to 1330 pixels.
 * - `show`: Boolean to control the visibility of the user options toast.
 * - `showModal`: Boolean to control the visibility of the logout confirmation modal.
 * 
 * @hooks
 * - Uses `useEffect` to listen for window resize events and clicks outside the toast to manage visibility.
 * - Uses `useNavigate` from React Router for navigation.
 * - Uses `useRef` to reference the toast element for click detection.
 * 
 * @functions
 * - `handleShow`: Toggles the visibility of the user options toast.
 * - `handleClose`: Closes the logout confirmation modal.
 * - `handleopen`: Opens the logout confirmation modal.
 * - `handleResize`: Updates the `isMobile` state based on the window width.
 * - `handleClickOutside`: Closes the toast if a click occurs outside of it.
 * - `handleProfile`: Navigates to the settings page.
 * - `handleLogout`: Clears user cookies and redirects to the login page.
 * 
 * @render
 * - Displays the application logo and a search input.
 * - Shows user options including profile navigation and logout within a toast.
 * - Includes a modal for confirming logout actions.
 */



import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Toast from 'react-bootstrap/Toast';
import { useTranslation } from "react-i18next";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";

import Notification from "../assets/icons/notification.svg";
import logo from "../assets/vibra_logo.png";
import profile from "../assets/Profile.png";
import unitedState from "../assets/unitedState.png";
import Button from "../components/button/button";
import CustomModal from '../components/modal/Modal';
import config from "../config";
import NotificationComponent from "../containers/notification";
import { createNotification } from '../redux/notificationSlice';
import * as constant from "../utlis/constant";

const NotificationIconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
  background-color: rgba(246, 176, 39, 1);
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const ToggleButton = styled.button`
  display: none;

  @media (max-width: 1330px) {
    margin-left: auto; // Align it to the right
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: block; // Show the button on smaller screens
  }
`;


const NotificationBadge = styled.div`
position: absolute;
top: 27px;
right: 228px;
background-color: red;
color: white;
border-radius: 50%;
font-size: 8px;
font-weight: bold;
padding: 2px 6px;


`;

function Header({ toggleSidebar, isOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1330);
  const [show, setShow] = useState(false); // Corrected state declaration
  const cookies = new Cookies(null, { path: "/" });
  const handleShow = () => setShow(prev => !prev); // Toggle show state
  const roles = cookies.get("roles");
  const name = cookies.get("name");
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const toastRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language); // Track current language


  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    // Optionally save the language preference
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [i18n]);


  const languageOptions = [
    { code: 'en', name: t('ENGLISH'), flag: unitedState },
    { code: 'fr', name: t('FRENCH'), flag: unitedState },
    { code: 'zh', name: t('CHINESE'), flag: unitedState },
    { code: 'es', name: t('SPANISH'), flag: unitedState }
  ];

  const unreadNotificationsCount = useSelector((state) =>
    state.notification?.notification?.[0]?.unreadNotificationsCount
  );
  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const handleClose = () => {
    setShowModal(false)
  }
  const handleopen = () => {
    setShowModal(true)
  }



  useEffect(() => {
    dispatch(createNotification());

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1330);
    };

    const handleClickOutside = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        setShow(false);
      }
    };



    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);

    };
  }, [dispatch]);



  const handleprofile = () => {
    navigate('/settings')
  }

  const handleLogout = async () => {


    await axios.get(config.logout, {
      withCredentials: true
    });
    cookies.remove(constant.USER);
    cookies.remove(constant.NAME_SMALL);
    localStorage.removeItem(constant.LASTPATH);
    cookies.remove(constant.ROLES)
    cookies.remove(constant.LASTPATH)
    window.location.href = '/';


  };


  return (
    <div className="headerContainer">
      <div className="logoContainer">
        <img src={logo} alt="logo" className="logo" />
        <h1>{t("VIBRA")}</h1>
      </div>

      <div className="profile-container">

        <div className="userOptions">

          <select
            className="custom-select-english"
            value={currentLanguage}
            onChange={handleLanguageChange}
          >
            {languageOptions.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <NotificationIconContainer onClick={handleNotificationClick}>
        <img src={Notification} alt="notification" width="24px" height="24px" />
          <NotificationBadge className="NotificationBadge">
            {unreadNotificationsCount}
          </NotificationBadge>
        </NotificationIconContainer>

        <NotificationComponent
          toastRef={toastRef}
          show={showNotifications}
          onClose={handleNotificationClose}
        />

        {isMobile && (
          <ToggleButton
            onClick={toggleSidebar}
            aria-expanded={isOpen}
            id="toggle-button"
            aria-controls="sidebar"
          >
            {isOpen ? "✖" : "☰"}
          </ToggleButton>
        )}

        <img src={profile} alt="User Icon" width="50px" height="50px" />
        <div>
          <div className="profile-content d-flex align-items-center gap-3" onClick={handleShow}>
            <div>

              <h3>{name}</h3>
              {roles?.map((role) => (
                <p className="header-owner">{role.roleName}</p>
              ))}
            </div>

            <div className="event-icons" ></div>
          </div>
        </div>

      </div>

      <Toast ref={toastRef} show={show} onClose={handleShow} style={{ position: 'absolute', top: '70px', right: '15px', width: "10%" }}>
        <Toast.Body style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="d-flex align-items-center gap-3 mb-2" onClick={handleprofile}>
            <CgProfile className="icon-color" size={22} />
            <h5 style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}>{t("PROFILE")} </h5>
          </div>
          <div className="d-flex align-items-center gap-3 " onClick={handleopen}>
            <MdOutlineLogout className="icon-color" size={22} />
            <h5 style={{ margin: 0, cursor: "pointer", fontWeight: 500 }}>{t("LOGOUT")}</h5>
          </div>
        </Toast.Body>
      </Toast>


      <CustomModal

        show={showModal}
        handleClose={handleClose}
        handleConfirm={handleLogout}
        body={
          <div>
            <h3 className='mb-3'>{t("LOGOUT")} </h3>
            <h5>{t("ARE_YOU_SURE_YOU_WANT_TO_LOGOUT")}</h5>
            <div className='d-flex justify-content-end gap-2 mt-3'>
              <Button name={t("CANCEL")} style={{ backgroundColor: "#6c757d", color: "white" }} onClick={handleClose} />
              <Button style={{ backgroundColor: "rgb(231, 28, 28)", color: "white" }} name={t("LOGOUT")} onClick={() => handleLogout()} />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Header;
