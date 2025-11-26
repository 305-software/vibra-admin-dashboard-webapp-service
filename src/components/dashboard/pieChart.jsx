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
import React, { useEffect ,useState} from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import CustomInput from "../../components/customInput/customInput"
import { eventStatusList } from "../../redux/eventSlice";
import { eventCategoryDetails } from "../../redux/eventSlice";
import Card from '../card/card';
import ApexChartComponent from '../chart/chart';
import ChartLabel from '../chart/chartLabel';

function DonutChart() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [date, setDate] = useState(null);

    const dispatch = useDispatch();
    const { eventCategory: categories, loading } = useSelector((state) => state.eventSlice) || {};
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(eventCategoryDetails());
        dispatch(eventStatusList(selectedCategory, date));
    }, [dispatch, selectedCategory, date ,t]);

    const onChange = (date, dateString) => {
        setDate(dateString);
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };
  

    const eventStatus = useSelector((state) => state.eventSlice.eventStatus) || {
        totalEvents: 0,
        completedEvents: 0,
        pendingEvents: 0,
        cancelledEvents: 0
    };


    const data = {
        series: [
            eventStatus.completedEvents || 0,
            eventStatus.pendingEvents || 0,
            eventStatus.cancelledEvents || 0
        ],
        options: {
            chart: {
                type: 'donut',
                height: "250px"
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
                ' rgb(216, 33, 72)',
                'rgb(1, 200, 151)',
                'rgb(0, 30, 108)'
            ],
            labels: ['Completed', 'Pending', 'Cancelled'],
        },
    };

    // Check if there's no data
    const isNoData = !eventStatus.completedEvents && !eventStatus.pendingEvents && !eventStatus.cancelledEvents;

    return (
        <div className="mb-4 ">
            <Card loading={loading}>
                <div className='event-height-piechart'>
                    <div className='event-Containers'>
                        <h3 className='totalEvent'>{t("BOOKINGS")}</h3>
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
                            <div className='event-Containers-piechart d-flex justify-content-around align-items-center'>
                                <div className='chat-resize'>
                                    <ApexChartComponent
                                        options={data.options}
                                        series={data.series}
                                        type="donut"
                                        height="250px"
                                    />
                                </div>


                                {/* Chart labels */}
                                <div className="mt-4 d-grid">
                                    <ChartLabel
                                        title={t("COMPLETED")}
                                        value={eventStatus.completedEvents}
                                        className={["piechart-name-sold", "piechart-details", "piechat-event"]} />
                                    <ChartLabel
                                        title={t("PENDING")}
                                        value={eventStatus.pendingEvents}
                                        className={["piechart-name-held", "piechart-details", "piechat-event"]}
                                    />
                                    <ChartLabel
                                        title={t("CANCELLED")}
                                        value={eventStatus.cancelledEvents}
                                        className={["piechart-name-left", "piechart-details", "piechat-event"]}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default DonutChart;
