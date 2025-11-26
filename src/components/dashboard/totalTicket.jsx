/**
 * TotalTicket Component
 *
 * This component displays the total number of tickets sold and unsold, represented by a radial bar chart.
 * It allows users to filter ticket data by category through a dropdown menu. The component fetches
 * event categories and total ticket data from the Redux store.
 *
 * @component
 * @example
 * return (
 *   <TotalTicket />
 * )
 *
 * @imports
 * - 'react-circular-progressbar/dist/styles.css': Styles for circular progress bars.
 * - React: The React library for building user interfaces.
 * - { useEffect, useState } from 'react': React hooks for managing side effects and state.
 * - Chart from 'react-apexcharts': A library for rendering charts in React.
 * - { Col, Row } from 'react-bootstrap': Components for layout and grid structure.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - { totalTicketDashboardList } from '../../redux/dashboardSlice': Action to fetch total ticket data.
 * - { eventCategoryDetails } from "../../redux/eventSlice": Action to fetch event categories.
 * - Card: A component for displaying a card layout.
 * - ChartLabel: A component for displaying labels in the chart.
 * - CustomInput: A component for displaying custom input fields, including dropdowns.
 *
 * @effects
 * - useEffect: Fetches event categories and total ticket data when the component mounts or the selected category changes.
 *
 * @state
 * - selectedCategory: The currently selected category from the dropdown.
 *
 * @returns {JSX.Element} The rendered TotalTicket component displaying ticket sales data and a radial chart.
 */



import 'react-circular-progressbar/dist/styles.css';
import 'react-loading-skeleton/dist/skeleton.css';

import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';

import { totalTicketDashboardList } from '../../redux/dashboardSlice';
import { eventCategoryDetails } from "../../redux/eventSlice";
import Card from '../card/card';
import ChartLabel from '../chart/chartLabel';
import CustomInput from '../customInput/customInput';

function TotalTicket() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const {totalTicketDashboard:totalEvent , loading} = useSelector((state) => state.dashboardSlice) || {};

    useEffect(() => {
        dispatch(eventCategoryDetails());
        dispatch(totalTicketDashboardList(selectedCategory));
    }, [dispatch, selectedCategory]);

    if (loading) {
        return (
            <div>
                <Skeleton />
            </div>
        );
    }

    const totalTickets = totalEvent.ticketsSold + totalEvent.ticketsLeft || 0;
    const soldPercentage = (totalEvent.ticketsSold / totalTickets) * 100 || 0;

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
                        offsetY:  -2,
                        fontSize: '16px',
                        formatter: function(val) {
                            return val.toFixed(2) + '%';
                        }
                    },
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


    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };

    return (
        <div className='mb-4'>
            <Card loading={loading} >
                <div className="event-height-piechart">


                    <div >
                        <Row style={{ alignItems: "center", marginBottom: "5px" }}>
                            <Col>
                                <h3 className='piechat-head'>{t("TICKETS_SOLD_BY")}</h3>
                            </Col>
                            <Col>
                                <CustomInput
                                    type="dropdown"
                                    options={categories}
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                />

                            </Col>
                        </Row>
                    </div>


                    <div>
                        <div className="progress-circle mt-4">
                            <Chart
                                options={options}
                                series={options.series}
                                type="radialBar"
                                height={290}
                            />

                        </div>
                        <div className='d-flex justify-content-around mb-3 ticket-round'>
                            <ChartLabel title={t("SOLD")} className={["tickets-styles", "tickets-sold", "tickets-design"]} value={totalEvent.ticketsSold} />

                            <ChartLabel title={t("UNSOLD")} className={["tickets-styles-unsold", "tickets-sold" , "tickets-design"]} value={totalEvent.ticketsLeft} />

                        </div>

                    </div>

                </div>
            </Card>
        </div>
    );
}

export default TotalTicket;

