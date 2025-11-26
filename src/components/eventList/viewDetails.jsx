/**
 * ViewDetails Component
 *
 * This component fetches and displays detailed information about a specific event, including its name, description, date, time, location, speakers, guidelines, and recent bookings.
 * It utilizes Redux to fetch event data based on the event ID from the URL parameters.
 *
 * @component
 * @example
 * return (
 *   <ViewDetails />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useEffect: Hook for performing side effects in function components.
 * - useParams: Hook for accessing URL parameters.
 * - Col, Container, Row: Bootstrap components for layout.
 * - MdOutlineDateRange: An icon component for displaying date information.
 * - useDispatch: Hook to access the Redux dispatch function.
 * - useSelector: Hook to access the Redux store state.
 * - eventByIdList: Redux action for fetching event details by ID.
 * - map: Image asset representing a map.
 * - LineChart: A custom component for displaying event-related data in a line chart.
 * - Button: A custom button component.
 * - Card: A custom card component for layout.
 * - RecentBookingEvent: A custom component for displaying recent booking details.
 * - TotalTicket: A custom component for displaying total ticket information.
 *
 * @returns {JSX.Element} The rendered ViewDetails component displaying event details and related components.
 *
 * @logic
 * - Retrieves the event ID from the URL parameters using `useParams`.
 * - Fetches event data from the Redux store using the `eventByIdList` action when the component mounts or when the ID changes.
 * - Displays the event name, description, date, time, location, speakers, guidelines, and a button for ticket purchase.
 * - Renders a line chart and total ticket information in a side column.
 * - Displays a section for recent bookings related to the event.
 */


import React, { useEffect ,useState} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { MdOutlineDateRange } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import map from "../../assets/map.png";
import LineChart from "../../components/eventList/lineChart";
import { eventByIdList } from "../../redux/eventSlice";
import Spinner from "../../utlis/spinner"
import Button from '../button/button';
import Card from '../card/HeaderCard';
import RecentBookingEvent from "./recentBookingTable";
import TotalTicket from './totalTicket';


function ViewDetails() {
    const { id } = useParams();
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const {eventById:data } = useSelector((state) => state.eventSlice) || {};

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);
  
  

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(eventByIdList(id));
        };
        fetchData();
    }, [dispatch, id]);


    if (loading) {
        return <Spinner />;
    }
  

    return (
        <Container fluid>
            <div>
                <div className='mb-4'>
                    <Card>
                        <div>
                            <h3>{data.eventName}</h3>
                        </div>

                    </Card>

                </div>

                <Row>

                    <Col lg="8">
                        <Card >
                            <div className='event-details-colors'>
                                <Row>
                                    <Col lg="5">
                                        <img src={`${data.imageUrl}`} alt="Event" className='event-details-images' />
                                    </Col>
                                    <Col className='mt-1' lg="7">
                                        <h3>{t("EVENT_DESCRIPTION")}</h3>
                                        <p className='eventColor mt-4  description-height-details'>{data.eventDescription}</p>

                                        <div className='eventlist-loc-container-details mt-4'>
                                            <h6 className='event-border'>
                                                <MdOutlineDateRange /> {data.eventDate ? data.eventDate.split("T")[0] : "No Date"} - {data.eventTime || "No Time"}
                                            </h6>
                                            <h5 className='eventlist-location event-border '>
                                                <img src={map} alt="Map" style={{ marginRight: "3px" }} /> <p className='event-location-view'>{data.location}</p>
                                            </h5>
                                        </div>

                                        <div className='mt-4' >
                                            <Button style={{ width: "100%" }} type="submit" name={`${t("TICKET_PRICE")}: $${data?.price?.toLocaleString('en-US')}`} />
                                                

                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                                        <h3 className='mb-4'>{t("EVENT_SPEAKER")}:</h3>
                                        <Row>
                                            {data.speakers && data.speakers.length > 0 ? (
                                                data.speakers.map((details, index) => (
                                                    <Col lg="2" key={index}>

                                                        <div className='text-center mt-4'>
                                                            <img
                                                                src={`${details.speakerImage}`}
                                                                alt={`Speaker ${index + 1}`}
                                                                style={{ width: '100%', height: "100px", objectFit: "cover" }}
                                                            />
                                                        </div>

                                                        <div className='p-2 text-center'>
                                                            <h5 className='coArtist-event'>{details.speakerName}</h5>
                                                            <p className='coArtist-content'>{details.speakerType}</p>

                                                        </div>

                                                    </Col>
                                                ))
                                            ) : (
                                                <p>{t("NO_SPEAKER_AVAILABLE")}</p>
                                            )}
                                        </Row>
                                    </div>
                                </Row>

                                <Row>
                                    <Col>
                                        <h3>{t("EVENT_GUIDELINES_AND_POLICIES")}:</h3>
                                        <ol>
                                            <p className='eventColor event-guideline  mt-4'><li >{data.eventGuideline}</li></p>
                                        </ol>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <div>
                            <LineChart id={id} />
                            <TotalTicket id={id} />
                        </div>
                    </Col>


                </Row>

                <Row>
                    <Container fluid>
                        <div className='mt-3 mb-3'>
                            <Card>
                                <h3>{t("RECENT_BOOKINGS")}</h3>
                            </Card>

                        </div>
                        <Card>

                            <RecentBookingEvent data={data} />
                        </Card>
                    </Container>
                </Row>
            </div>
        </Container>
    );
}

export default ViewDetails;
