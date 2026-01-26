/**
 * EventHead Component
 *
 * This component serves as the header for the events page, allowing users to select event categories,
 * toggle between different views (dashboard, grid, calendar), and navigate to the event creation page.
 * It utilizes Redux for state management and React Router for navigation.
 */

import { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Img3 from '../../assets/Updatedcalendar.png';
import Img2 from '../../assets/updatedgrid1.png';
import Img from '../../assets/UpdatedLayer56.png';
import { UserContext } from '../context/userContext';
import { eventCategoryDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button'; // eslint-disable-line no-unused-vars
import Card from '../card/HeaderCard'; // eslint-disable-line no-unused-vars
import CustomInput from '../customInput/customInput'; // eslint-disable-line no-unused-vars

function EventHead({ setView, setSelectedCategory }) {
    const [activeIcon, setActiveIcon] = useState('dashboard');
    const [showBoostRequiredModal, setShowBoostRequiredModal] = useState(false);
    const [showMaxEventsModal, setShowMaxEventsModal] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const eventList = useSelector((state) => state.eventSlice.eventList) || [];
    const { t } = useTranslation();

    const handleIconClick = (newView) => {
        setView(newView);
        setActiveIcon(newView);
    };

    useEffect(() => {
        dispatch(eventCategoryDetails());
    }, [dispatch]);

    const handleClick = () => {
        // Check if user has reached maximum of 2 events
        if (eventList && eventList.length >= 2) {
            setShowMaxEventsModal(true);
        }
        // Check if user has 1 event and needs to boost
        else if (eventList && eventList.length === 1) {
            setShowBoostRequiredModal(true);
        } else {
            navigate("/eventList/createEvent");
        }
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };

    const handleBoostRedirect = () => {
        setShowBoostRequiredModal(false);
        // Navigate to boost page or show boost options
        // You can customize this to navigate to a specific boost page
        navigate('/boost/checkout'); // Or wherever your boost page is
    };

    const handleCloseBoostModal = () => {
        setShowBoostRequiredModal(false);
    };

    const handleCloseMaxEventsModal = () => {
        setShowMaxEventsModal(false);
    };

    const handleManageEvents = () => {
        setShowMaxEventsModal(false);
        navigate('/eventList');
    };

    return (
        <div className='mb-4'>
            <Card>
                <div className='event-main-container'>
                    <h3>{t("ALL_EVENTS")}</h3>
                    <div className='event-flex-page'>
                        <CustomInput
                            type="dropdown"
                            options={categories}
                            className="form-control"
                            name='eventcategory'
                            onChange={handleCategoryChange}
                        />
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('dashboard')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img}
                                width={24}
                                height={24}
                                alt="Dashboard View"
                                style={{
                                    filter: activeIcon === 'dashboard' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('grid')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img2}
                                width={24}
                                height={24}
                                alt="Grid View"
                                style={{
                                    filter: activeIcon === 'grid' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('calendar')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img3}
                                width={24}
                                height={24}
                                alt="Calendar View"
                                style={{
                                    filter: activeIcon === 'calendar' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                type="button"
                                name={t("CREATE")}
                                featureName={constant.EVENTS}
                                permissionName={constant.CREATE_ROLE}
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Boost Required Modal */}
            {showBoostRequiredModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={handleCloseBoostModal}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <svg 
                                width="80" 
                                height="80" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ff4d4f" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ margin: '0 auto' }}
                            >
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: '#333'
                        }}>
                            {t("BOOST_REQUIRED") || "Boost Required"}
                        </h2>
                        <p style={{ 
                            fontSize: '16px', 
                            color: '#666', 
                            marginBottom: '32px',
                            lineHeight: '1.5'
                        }}>
                            {t("BOOST_REQUIRED_MESSAGE") || "You need to boost at least one of your existing events before you can create a new one."}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            justifyContent: 'center' 
                        }}>
                            <button
                                onClick={handleCloseBoostModal}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: '2px solid #d9d9d9',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#999';
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                    e.currentTarget.style.color = '#666';
                                }}
                            >
                                {t("CANCEL") || "Cancel"}
                            </button>
                            <button
                                onClick={handleBoostRedirect}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: 'none',
                                    backgroundColor: '#56D436',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4AC030';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#56D436';
                                }}
                            >
                                {t("BOOST_NOW") || "Boost Now"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Maximum Events Modal */}
            {showMaxEventsModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={handleCloseMaxEventsModal}
                >
                    <div 
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '40px',
                            maxWidth: '500px',
                            width: '90%',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <svg 
                                width="80" 
                                height="80" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#faad14" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ margin: '0 auto' }}
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                <line x1="12" y1="9" x2="12" y2="13"/>
                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                        </div>
                        <h2 style={{ 
                            fontSize: '24px', 
                            fontWeight: '600', 
                            marginBottom: '16px',
                            color: '#333'
                        }}>
                            {t("MAXIMUM_EVENTS_REACHED") || "Maximum Events Reached"}
                        </h2>
                        <p style={{ 
                            fontSize: '16px', 
                            color: '#666', 
                            marginBottom: '32px',
                            lineHeight: '1.5'
                        }}>
                            {t("MAXIMUM_EVENTS_MESSAGE") || "You have reached the maximum of 2 active events. In order to maintain safety and clearance, please manage your existing events before creating a new one."}
                        </p>
                        <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            justifyContent: 'center' 
                        }}>
                            <button
                                onClick={handleCloseMaxEventsModal}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: '2px solid #d9d9d9',
                                    backgroundColor: '#fff',
                                    color: '#666',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#999';
                                    e.currentTarget.style.color = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = '#d9d9d9';
                                    e.currentTarget.style.color = '#666';
                                }}
                            >
                                {t("CANCEL") || "Cancel"}
                            </button>
                            <button
                                onClick={handleManageEvents}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    border: 'none',
                                    backgroundColor: '#56D436',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#4AC030';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#56D436';
                                }}
                            >
                                {t("MANAGE_EVENTS") || "Manage Events"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventHead;