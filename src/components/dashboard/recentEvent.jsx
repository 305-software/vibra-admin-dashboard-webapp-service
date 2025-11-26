/**
 * RecentEvent Component
 *
 * This component displays a list of recent events, including details such as event name,
 * location, price, and ticket sales. It fetches the recent events data from the Redux store
 * and displays it in a card format. If no events are available, it shows a "No Data Available" message.
 *
 * @component
 * @example
 * return (
 *   <RecentEvent />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - map: An image asset representing a location map.
 * - { fetchTransactionList } from '../../redux/dashboardSlice': Action for fetching recent events data.
 * - Card: A component to display content in a card format.
 * - ProgressBarComponent: A component to display progress bars indicating ticket sales.
 *
 * @effects
 * - useEffect: Fetches the recent events when the component mounts.
 *
 * @returns {JSX.Element} The rendered RecentEvent component containing a list of recent events.
 */



import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import map from "../../assets/map.png";
import { recentEventList } from '../../redux/dashboardSlice';
import Card from '../card/card';
import ProgressBarComponent from '../progressBar/progressBar';

const RecentEvent = () => {
  const dispatch = useDispatch();
  const {recentEvent:totalEvent, loading} = useSelector((state) => state.dashboardSlice) || {};
  const { t } = useTranslation();
  useEffect(() => {
    dispatch(recentEventList());
  }, [dispatch]);

  // Check if recentEvents exists and is an array
  const recentEvents = Array.isArray(totalEvent.recentEvents) ? totalEvent.recentEvents : [];


  return (
    <div  className='mb-4'>
      <Card loading={loading} className="event-height-div">
        <div>
          <div className='event-Containers-recent'>
            <h3 >{t("RECENT_EVENTS")}</h3>
          </div>

          <div className="event-height">
            {recentEvents.length > 0 ? (
              recentEvents.map((event) => {
                // Count booked seats
                const bookedSeatsCount = event.seats.filter(seat => seat.isBooked).length;

                return (
                  <div className='mt-3' key={event._id}>
                    <Card>
                      <div className='recent-event'>
                        <img
                          src={`${event.imageUrl}`}
                          alt={event.eventName}
                          className='recent-image-details'
                        />
                        <div className='flex-wrap'>

                          <div className='d-flex justify-content-between mb-2'>
                            <h5 className='recent-name'>{event.eventName}</h5>
                            <h5 className="event-price-recent">${event.price}</h5>

                          </div>


                          <div className='recent-content mb-2'>
                            <div className="recent-location">
                              <img src={map} alt="" />
                              <p className='event-location-recent view-more'>{event.location}</p>

                            </div>
                            <div className='image-screen-details '>

                              <p className="recent-ticketCount ">{bookedSeatsCount}/{event.totalSeats}</p>
                            </div>

                            <div>


                            </div>
                          </div>


                          <div className='recent-event-details'>
                            <div className="co-artist-recent">

                              <p className='event-nowrap'>{t("CO_ARTIST")}: </p>
                              <p className='event-location'>{event.speakers.map(speaker => speaker.speakerName).join(', ')}</p>


                            </div>


                            <div className='upcoming-container-details'>



                              <div>
                                <div className='ticketsold'>
                                  <h4 className='event-nowrap'>{t("TICKETS_SOLD")}</h4>
                                  <ProgressBarComponent
                                    data={(bookedSeatsCount / event.totalSeats) * 100}
                                    variant='warning'
                                  />
                                </div>
                              </div>
                            </div>

                          </div>


                        </div>


                      </div>
                    </Card>
                  </div>
                );
              })
            ) : (
              <div className="no-transactions">
                <p>{t("NO_DATA_AVAILABLE")}</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecentEvent;