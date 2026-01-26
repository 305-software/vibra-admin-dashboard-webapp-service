import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import { Layout } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';

import map from "../../assets/map.png";
import { UserContext } from '../context/userContext';
import { eventListDetails } from "../../redux/eventSlice";
import FormattedDate from '../../utlis/date';
import Button from '../button/button';
const { Content } = Layout;

/**
 * App Component
 * 
 * This component displays a full calendar with events and their details. It allows users to view events on a specific date and provides an interactive UI to select and view event details.
 * 
 * @component
 * @example
 * return (
 *   <App />
 * )
 */

const App = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [dropdownEvents, setDropdownEvents] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);
    const events = useSelector((state) => state.eventSlice.eventList) || [];
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(eventListDetails('', '', user?.data.user?._id));
    }, [dispatch, user]);

    const calendarEvents = events.reduce((acc, event) => {
        const eventDate = event.eventDate;
        const existingEventIndex = acc.findIndex(e => e.start === eventDate);

        if (existingEventIndex === -1) {
            // If no event exists for this date, create a new one
            acc.push({
                title: ' ',
                start: eventDate,
                end: eventDate,
                events: [event] // Store events array
            });
        } else {
            // If event exists for this date, add to its events array
            acc[existingEventIndex].events.push(event);
        }

        return acc;
    }, []);

    const renderEventContent = (eventInfo) => {
        const eventsForDate = eventInfo.event.extendedProps.events;

        return (
            <div className="event-cell" style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                gap: '2px',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2px',
                position: 'relative',
            }}>
                {/* Show first two unique events */}
                {eventsForDate.slice(0, 2).map((event, index) => (
                    <img
                        key={event.id || index}
                        src={event.imageUrl}
                        alt={event.eventName}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                ))}

                {/* Show count for additional events */}
                {eventsForDate.length > 2 && (
                    <div>
                        +{eventsForDate.length - 2}
                    </div>
                )}
            </div>
        );
    };

    // Handle calendar event click
    const handleEventClick = (info) => {
        const rect = info.el.getBoundingClientRect();
        setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX
        });

        const clickedDate = new Date(info.event.start);
        const eventsOnDate = events.filter(event => {
            const eventDate = new Date(event.eventDate);
            return eventDate.toDateString() === clickedDate.toDateString();
        });

        setDropdownEvents(eventsOnDate);
        setShowDropdown(true);
        setSelectedEvent(null);
    };

    // Event dropdown component
    const EventDropdown = () => (
        showDropdown && (
            <div
                className="bg-white shadow-lg rounded-lg p-2"
                style={{
                    position: 'absolute',
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    zIndex: 1000,
                    minWidth: '200px',
                    cursor: 'pointer'
                }}
            >

                {dropdownEvents.map((event, index) => (
                    <div
                        key={index}
                        className="d-flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                            setSelectedEvent(event);
                            setShowDropdown(false);
                        }}
                    >
                        <div>
                            <img
                                src={event.imageUrl}
                                alt={event.eventName}
                                style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: "100px" }} />

                        </div>
                        <div>
                            <div className="font-medium">{event.eventName}</div>
                        </div>
                    </div>
                ))
                }
            </div >
        )
    );

    // Event details sidebar
    const EventDetails = () => (
        selectedEvent && (
            <div className='calendermain'>

         
            <div width={400} className='calenderEvent-container' >
                <div>
                    {/* Close Button */}
                    <IoCloseOutline
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            cursor: 'pointer',
                            fontSize: '20px',
                        }}
                        onClick={() => setSelectedEvent(null)}
                    />
                    <h3>{t("EVENT_DETAILS")}</h3>
                    <div className="calender-event-detail">
                        <div className="calender-event-time">{selectedEvent.eventTime}</div>
                        <div className="calender-event-info">
                            <h3 className="calender-event-title">{selectedEvent.eventName}</h3>
                        </div>
                    </div>
                    <div className='eventlist-loc-container'>
                        <p className='eventlist-location-calender'>
                            <img src={map} alt="Map" style={{ marginRight: "5px" }} /> {selectedEvent.location}
                        </p>
                        <p className='d-flex gap-2 align-items-center'><MdOutlineDateRange /> <FormattedDate date={selectedEvent.eventDate}/></p>
                    </div>
                    <div className='mt-3'>
                        <h3 className='mb-3'>{t("EVENT_DESCRIPTION")}</h3>
                        <p className='eventColor'>{selectedEvent.eventDescription}</p>
                    </div>
                    {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                        <div className='mt-3'>
                            <h3 className='eventColor'>{t("EVENT_SPEAKER")}</h3>
                            <div className='eventlist-coArtist'>
                                {selectedEvent.speakers.map((speaker, speakerIndex) => (
                                    <img
                                        key={speakerIndex}
                                        src={`${speaker.speakerImage}`}
                                        className="profile-image"
                                        alt="Co-Artist"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ marginTop: "20px" }}>
                        <h3 className='event-details-heading mb-3'>{t("EVENT_GUIDELINES_AND_POLICIES")}:</h3>
                        <ol>
                            <li><p className='eventColor'>{selectedEvent.eventGuideline} </p></li>
                        </ol>
                    </div>
                    <div>
                        <Button type="Submit" style={{ width: "100%" }} name={`${t("TICKET_PRICE")}: $${selectedEvent?.price.toLocaleString('en-US')}`} />
                    </div>
                </div>
            </div>
            </div>
        )
    );

    // Handle clicking outside dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.calendar-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <div className="relative min-h-screen">
            <Content className="p-6 bg-white ">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={calendarEvents}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                    height="auto"
                    style={{ marginTop: "10px" }}
                />
                <div className="calendar-dropdown">
                    <EventDropdown />
                </div>
                <EventDetails />
            </Content>
        </div>
    );
};

export default App;