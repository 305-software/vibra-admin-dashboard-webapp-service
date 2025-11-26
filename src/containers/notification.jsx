/**
 * NotificationComponent - Displays user notifications and handles marking them as read.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.show - Controls the visibility of the notification toast.
 * @param {function} props.onClose - Function to close the notification toast.
 * @param {Object} props.toastRef - Reference to the toast component.
 *
 * @returns {JSX.Element | null} The rendered NotificationComponent or null if not visible.
 *
 * @example
 * <NotificationComponent show={true} onClose={() => {}} toastRef={myRef} />
 */
import React, { useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';
import { useTranslation } from "react-i18next";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';

import { createNotification, readNotification } from '../redux/notificationSlice';
import FormattedDate from '../utlis/date';

const NotificationComponent = ({ show, onClose, toastRef }) => {
    const notifications = useSelector((state) =>
        state.notification?.notification?.[0]?.data ?? []
    );

    const { t } = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
        if (show) {
            dispatch(createNotification()).unwrap();
        }

        const handleClickOutside = (event) => {
            if (toastRef.current && !toastRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dispatch, show, toastRef]);

    // Handle marking a single notification as read
    const handleNotificationClick = (notificationId) => {
        dispatch(readNotification(notificationId));
        dispatch(createNotification());
    };

    // Handle marking all notifications as read
    const handleMarkAllRead = () => {
        notifications.forEach(notify => {
            dispatch(readNotification(notify._id));
        });
        dispatch(createNotification());
    };

    // Combined close handler
    const handleClose = () => {
        handleMarkAllRead();
        onClose();
    };

    const renderNotification = (notify) => {
        const containerStyle = {
            color: notify.isRead ? 'lightgrey' : '#000'
        };
        switch (notify.type) {
            case 'NEW_BOOKING':
                return (
                    <div style={containerStyle}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <img
                                src={notify.bookingData?.imageUrl}
                                alt="Event"
                                width="30px"
                                height="30px"
                                style={{ borderRadius: "50px" }}
                            />
                            <p style={containerStyle}>
                                <span className="font-semibold"><strong>{notify.bookingData?.userName}</strong></span>
                                {' '} booked ticket for  {' '}
                                <span className="font-semibold"><strong>{notify.bookingData?.eventName}</strong></span>
                                {' '} and the transaction was successful
                                <br />
                                <p style={containerStyle}>
                                    {FormattedDate(notify.createdAt)}
                                </p>
                            </p>
                        </div>
                    </div>
                );

            case 'NEW_USER':
                return (
                    <div style={containerStyle}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div style={{ width: "30px", height: "30px", borderRadius: "50px", backgroundColor: "rgb(246, 176, 39)" }}>
                                <AiOutlineUser style={{ width: "30px" }} />
                            </div>
                            <p style={containerStyle}>
                                <span className="font-semibold"><strong>{notify.userData?.userName}</strong></span>
                                {' '} has created an account in {' '}
                                <span className="font-semibold"><strong>{notify.userData?.country}</strong></span>
                                <br />
                                <p style={containerStyle}>
                                    {FormattedDate(notify.createdAt)}
                                </p>
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!show) return null;

    return (
        <Toast
            ref={toastRef}
            show={show}
            onClose={handleClose}
            bg="white"
            style={{ 
                position: 'absolute', 
                top: '78px', 
                right: '94px', 
                width: "26%",
                maxHeight: '400px' // Set maximum height for the entire toast
            }}
        >
            <Toast.Header>
                <strong className="me-auto">{t("NOTIFICATIONS")}</strong>
            </Toast.Header>
            <Toast.Body 
                className="bg-white" 
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px', 
                    backgroundColor: "white",
                    maxHeight: '320px', // Set maximum height for the body
                    overflowY: 'auto', // Enable vertical scrolling
                    overflowX: 'hidden', // Hide horizontal scrollbar
                    padding: '10px', // Add some padding for better appearance
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none' // Internet Explorer and Edge
                }}
            >
                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {notifications.map((notify) => (
                            <div
                                key={notify._id}
                                className="hover:bg-gray-50"
                                onClick={() => handleNotificationClick(notify._id)}
                                style={{ 
                                    padding: '8px 0', // Add padding to each notification
                                    cursor: 'pointer' // Add cursor pointer for better UX
                                }}
                            >
                                {renderNotification(notify)}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-500">
                        {t("NO_NOTIFICATIONS_AVAILABLE")}
                    </div>
                )}
            </Toast.Body>
        </Toast>
    );
}

export default NotificationComponent;