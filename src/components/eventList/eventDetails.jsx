/**
 * EventDetails Component
 *
 * This component fetches and displays details of events based on the selected category and calendar date.
 * It uses Redux for state management and React Router for navigation to individual event detail pages.
 * The component shows event images, names, times, locations, prices, descriptions, speakers, and ticket sales progress.
 *
 * @component
 * @example
 * return (
 *   <EventDetails selectedCategory="music" calender={true} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { Col, Row } from 'react-bootstrap': Bootstrap components for layout.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with the Redux store.
 * - { useNavigate } from 'react-router-dom': Hook for programmatic navigation.
 * - map: A map image asset for displaying event locations.
 * - { eventListDetails } from "../../redux/eventSlice": Action to fetch event details from Redux store.
 * - Button: A custom button component.
 * - Card: A custom card component for displaying event information.
 * - ProgressBarComponent: A component for showing ticket sales progress.
 *
 * @props
 * - selectedCategory (string): The category of events to filter and display.
 * - calender (boolean): Indicates if the calendar view is active.
 *
 * @state
 * - data (Array): List of events fetched from the Redux store.
 *
 * @effects
 * - useEffect: Fetches event data from the Redux store when the component mounts or when selectedCategory or calender changes.
 *
 * @functions
 * - ViewDetails: Navigates to the detailed view of a selected event.
 *
 * @returns {JSX.Element} The rendered EventDetails component displaying event cards with relevant information.
 */



import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import map from "../../assets/map.png";
import { eventListDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import Card from '../card/card';
import ProgressBarComponent from '../progressBar/progressBar';

function EventDetails({ selectedCategory, calender }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {eventList:data , loading} = useSelector((state) => state.eventSlice) || [];
    const { t } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(eventListDetails(selectedCategory, calender));
        };
        fetchData();
    }, [dispatch, selectedCategory, calender,t]);

    const ViewDetails = (name) => {
        navigate(`viewDetails/${name}`);
    };

    return (
        <div className='event-details'>
            <Row>
                {data?.length > 0 ? (
                    data.map((details, index) => {
                        const bookedSeatsCount = details.seats.filter(seat => seat.isBooked).length;
                        return (
                            <Col className='mb-4 my-0 mx-0' key={index} lg={6} md={12} xs={12}>
                                <Card loading={loading}>
                                    <img
                                        src={`${details.imageUrl}`}
                                        alt="Event"
                                        className="event-card-image"
                                    />
                                    <div className='mt-4'>
                                        <div className='eventlist-loc-container mt-2'>
                                            <h3  className='eventNameEllipse'>{details.eventName}</h3>
                                            <p className="eventColor">{details.eventTime}</p>
                                        </div>
                                        <div className='eventlist-loc-container mt-2'>
                                            <p className='eventColor event-details-location'>
                                                <img src={map} alt="Map Icon" style={{ marginRight: "10px" }} />
                                                {details.location}
                                            </p>
                                            <p className="eventlist-ticketSold">${details.price.toLocaleString('en-US')}</p>
                                        </div>
                                        <p className='eventColor description-height mt-2'>{details.eventDescription}</p>
                                        <div className='d-flex align-items-center mt-2'>
                                            <p className='co-artist-details'>{t("CO_ARTIST")}: </p>
                                            {details?.speakers?.length > 0 && (
                                                <div className="speakers-container">
                                                    {details.speakers.slice(0, 2).map((speaker, speakerIndex) => (
                                                        <div className='d-flex align-items-center' key={speakerIndex}>
                                                            <img
                                                                src={`${speaker.speakerImage}`}
                                                                className="profile-image event-location"
                                                                alt="Co-Artist"
                                                            />
                                                        </div>
                                                    ))}
                                                    {details?.speakers?.length > 2 && (
                                                        <div className="more-speakers">
                                                            <span>+{details.speakers.length - 2}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                       
                                        </div>
                                        <div className='eventlist-loc-container-progress mt-2'>
                                            <div className='eventlist-loc-container-details'>
                                                <h6 className='eventlist-ticketSold'>{t("TICKETS_SOLD")} : </h6>
                                                <div style={{ width: "95%" }}>
                                                    <ProgressBarComponent
                                                        data={(bookedSeatsCount / details.totalSeats) * 100}
                                                        variant='warning'
                                                    />
                                                </div>
                                                <p>{bookedSeatsCount}/{details.totalSeats}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                featureName={constant.EVENTS}
                                                permissionName={constant.VIEW_ROLE}
                                                name={t("VIEW_DETAILS")}
                                                onClick={() => ViewDetails(details._id)} // Pass the event name
                                            />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <Card>
                        <div className="no-transactions event-height ">
                            <p>{t("NO_EVENTS_AVAILABLE") }</p>
                        </div>
                    </Card>

                )}
            </Row>
        </div>
    );
}

export default EventDetails;
