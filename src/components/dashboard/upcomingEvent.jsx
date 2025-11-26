/**
 * UpcomingEvents Component
 *
 * This component displays a list of upcoming events, including details such as event name,
 * description, date, ticket sold count, and a progress bar indicating the percentage of tickets sold.
 * It fetches upcoming event data from the Redux store based on the provided calendar date.
 *
 * @component
 * @example
 * return (
 *   <UpcomingEvents calender={new Date()} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { useEffect } from 'react': React hook for managing side effects.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - { upcomingEventList } from "../../redux/dashboardSlice": Action to fetch the list of upcoming events.
 * - Card: A component for displaying a card layout.
 * - ProgressBarComponent: A component for displaying a progress bar indicating ticket sales.
 *
 * @props
 * - calender (Date): The date used to filter and fetch upcoming events.
 *
 * @effects
 * - useEffect: Fetches upcoming event data whenever the calendar date changes.
 *
 * @state
 * - data (Array): The list of upcoming events fetched from the Redux store.
 *
 * @returns {JSX.Element} The rendered UpcomingEvents component displaying a list of upcoming events.
 */



import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { upcomingEventList } from "../../redux/dashboardSlice";
import Card from '../card/card';
import ProgressBarComponent from '../progressBar/progressBar';

const UpcomingEvents = ({ calender }) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.dashboardSlice.upcomingList) || [];
    const { t } = useTranslation();
    useEffect(() => {
        const fetchData = async () => {
            await dispatch(upcomingEventList(calender));
        };

        fetchData();
    }, [dispatch, calender]);

    return (
        <div className="card-bottom ">
            <h3 className='mb-3'>{t("UPCOMING_EVENTS")}</h3>
            <div className='event-height-upcoming '>

                {data.length > 0 ? (
                    <div >
                        {data.map((events) => {
                            const bookedSeatsCount = events.seats.filter(seat => seat.isBooked).length;

                            return (
                                <div className="mt-3">
                                    <Card   >
                                        <div key={events._id}>
                                            <div className="upcoming-container-flex" bordered={false}>
                                                <div className="event-date">
                                                    <h4 className='upcoming-date'>{new Date(events.eventDate).getDate()}</h4>
                                                    <h6 className='upcoming-days'>{new Date(events.eventDate).toLocaleString('en-US', { weekday: 'short' })}</h6>
                                                </div>
                                                <div>
                                                    <h5 className='upcomingevent-name' >{events.eventName}</h5>
                                                    <p className='eventDescription upcoming-description'>{events.eventDescription}</p>
                                                </div>
                                            </div>

                                            <div className='upcoming-container-artist'>
                                                <p>{t("TICKETS_SOLD")}</p>
                                                <div className='image-screen-details '>
                                                    {events.speakers.map((speaker, speakerIndex) => (
                                                        speakerIndex < 2 && (
                                                            <img
                                                                key={speakerIndex}
                                                                src={`${speaker.speakerImage}`}
                                                                className="profile-image-event"
                                                                alt="Co-Artist"
                                                            />
                                                        )
                                                    ))}

                                                    {events.speakers.length > 2 && (
                                                        <span className="more-speakers">+{events.speakers.length - 2}</span>
                                                    )}

                                                    <p className="recent-ticketCount">{bookedSeatsCount}/{events.totalSeats}</p>
                                                </div>

                                            </div>

                                            <div>
                                                <ProgressBarComponent
                                                    data={(bookedSeatsCount / events.totalSeats) * 100}
                                                    variant='warning'
                                                />

                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                ) : (
                    <div><p style={{ textAlign: "center", marginTop: "50px" }}>{t("NO_EVENTS_AVAILABLE")}</p></div> // Fixed spelling here
                )}

            </div>
        </div>
    );
};

export default UpcomingEvents;
