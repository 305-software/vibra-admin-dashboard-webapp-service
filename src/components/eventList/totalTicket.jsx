/**
 * TotalTicket Component
 *
 * This component renders a radial bar chart showing the percentage of tickets sold for a specific event.
 * It fetches the total event data from the Redux store based on the provided event ID and displays the sold and unsold tickets.
 *
 * @component
 * @example
 * return (
 *   <TotalTicket id="event123" />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useEffect: Hook for performing side effects in function components.
 * - Chart: A component from react-apexcharts for rendering charts.
 * - Col, Row: Bootstrap components for layout.
 * - useDispatch: Hook to access the Redux dispatch function.
 * - useSelector: Hook to access the Redux store state.
 * - eventList: Redux action for fetching event ticket data.
 * - Card: A custom card component for layout.
 * - ChartLabel: A custom component for displaying chart labels.
 *
 * @props
 * - id (string): The ID of the event for which ticket data is to be fetched.
 *
 * @returns {JSX.Element} The rendered TotalTicket component displaying a radial bar chart and ticket details.
 *
 * @logic
 * - Fetches total event data based on the provided ID using Redux when the component mounts or when the ID changes.
 * - Calculates total tickets sold and unsold.
 * - Computes the percentage of tickets sold for display in the radial bar chart.
 * - Configures the options for the radial bar chart, including appearance and data labels.
 * - Renders the radial bar chart along with labels for sold and unsold tickets.
 */



import React, { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { eventList } from '../../redux/dashboardSlice';
import Card from '../card/card';
import ChartLabel from '../chart/chartLabel';

function TotalTicket({ id }) { // Accept id as a prop
    const dispatch = useDispatch();
    const {totalEvent , loading} = useSelector((state) => state.dashboardSlice) || {};
    const { t } = useTranslation();
    useEffect(() => {
        if (id) {
            dispatch(eventList(id)); // Pass the id to the API call
        }
    }, [dispatch, id]); // Include id in the dependency array

    const totalTickets = totalEvent.ticketsSold + totalEvent.ticketsLeft || 0;
    const soldPercentage = totalTickets > 0 ? (totalEvent.ticketsSold / totalTickets) * 100 : 0;
    const options = {
        series: [soldPercentage],
        chart: {
            type: 'radialBar',
            height: 250,
            offsetY: -20,
            shadow: {
                enabled: false,
            },
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '80%',
                    margin: 5,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: '16px',
                        show: true,
                        formatter: function(val) {
                          // Format to exactly 2 decimal places
                          return val.toFixed(2) + '%';
                        }
                      }
                },
            },
        },
        grid: {
            padding: {
                top: -10,
            },
        },

            fill: {
            type: 'solid',
            colors: ['rgba(246, 176, 39, 1)']
        },
        labels: ['sold'],
    };

    return (
        <div className='mb-4'>
            <Card loading={loading}>
                <div className="event-height-piechart">
                    <div>
                        <Row style={{ alignItems: "center", marginBottom: "5px" }}>
                            <Col>
                                <h3 className='piechat-head'>{t("TICKETS_SOLD_BY")}</h3>
                            </Col>
                        </Row>
                    </div>

                   
                        <div>
                            <div className="progress-circle">
                                <Chart
                                    options={options}
                                    series={options.series}
                                    type="radialBar"
                                    height={290}
                                />
                         
                            </div>
                            <div className='d-flex justify-content-around ticket-round mb-3'>
                                <ChartLabel title={t("SOLD")} className={["tickets-styles", "tickets-sold" , "tickets-design"]} value={totalEvent.ticketsSold} />
                                <ChartLabel title={t("UNSOLD")} className={["tickets-styles-unsold", "tickets-sold" ,"tickets-design"]} value={totalEvent.ticketsLeft} />
                            </div>
                        </div>
                  
                </div>
            </Card>
        </div>
    );
}

export default TotalTicket;
