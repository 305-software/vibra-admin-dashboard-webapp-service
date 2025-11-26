/**
 * DonutChart Component
 * 
 * This component displays a donut chart representing the status of events (completed, pending, cancelled).
 * It fetches event status data from the Redux store and updates the chart accordingly.
 * 
 * @component
 * @example
 * return (
 *   <DonutChart />
 * )
 */


import { DatePicker, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import CustomInput from "../../components/customInput/customInput"
import { eventStatusList } from "../../redux/eventSlice"; // Assuming this fetches data and sets it in the store
import { eventCategoryDetails } from "../../redux/eventSlice";
import Card from '../card/card';
import ApexChartComponent from '../chart/chart';
import ChartLabel from '../chart/chartLabel';
function DonutChart() {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [date, setDate] = useState(null);
    const { eventStatus } = useSelector((state) => state.eventSlice) || {
        totalEvents: 0,
        completedEvents: 0,
        pendingEvents: 0,
        cancelledEvents: 0
    };
    const onChange = (date, dateString) => {
        setDate(dateString);
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };
    const { eventCategory: categories, loading } = useSelector((state) => state.eventSlice) || {};
    useEffect(() => {
        dispatch(eventCategoryDetails())
        dispatch(eventStatusList(selectedCategory, date));


    }, [dispatch, t, selectedCategory, date]);

    const data = {
        series: [
            eventStatus.completedEvents || 0,
            eventStatus.pendingEvents || 0,
            eventStatus.cancelledEvents || 0
        ],
        options: {
            chart: {
                type: 'donut',
            },
            stroke: {
                colors: ['#fff'],
            },
            fill: {
                opacity: 0.8,
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: false,
            },
            colors: [
                'rgba(59, 130, 246, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(20, 184, 166, 1)'
            ],
            labels: ['Completed', 'Pending', 'Cancelled'],
        },
    };

    // Check if there's no data
    const isNoData = !eventStatus.completedEvents && !eventStatus.pendingEvents && !eventStatus.cancelledEvents;

    return (
        <div className="mb-4 ">
            <Card loading={loading}>
                <div className='event-Containers'>
                    <h3>{t("BOOKINGS")}</h3>
                    <Form>
                        <Row>
                            <Col>
                                <CustomInput
                                    type="dropdown"
                                    options={categories}
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                />

                            </Col>
                            <Col>
                                <Space direction="vertical">
                                    <DatePicker className="form-control" onChange={onChange} picker="month" />
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Check if there's no data, and display the message */}
                {isNoData ? (
                    <div className="no-data-message heigth-total-event no-transactions"> <p>{t("NO_DATA_AVAILABLE")}</p></div>
                ) : (
                    <>
                        {/* Center the chart */}
                        <div className="d-flex justify-content-center donut-chart">
                            <ApexChartComponent
                                options={data.options}
                                series={data.series}
                                type="donut"
                                height="189px"
                            />
                        </div>

                        {/* Chart labels */}
                        <div className="mt-4 d-grid">
                            <ChartLabel
                                title={t("COMPLETED")}
                                value={eventStatus.completedEvents}
                                className={["donut-name-completed", "donut-chart-details", "donut-space"]}
                            />
                            <ChartLabel
                                title={t("PENDING")}
                                value={eventStatus.pendingEvents}
                                className={["donut-name-pending", "donut-chart-details", "donut-space"]}
                            />
                            <ChartLabel
                                title={t("CANCELLED")}
                                value={eventStatus.cancelledEvents}
                                className={["donut-name-cancel", "donut-chart-details", "donut-space"]}
                            />
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default DonutChart;
