/**
 * PolarChart Component
 * 
 * This component displays a donut chart representing various statistics such as new registrations, total events, tickets sold, and tickets unsold.
 * It fetches data from the Redux store and updates the chart accordingly.
 * 
 * @component
 * @example
 * return (
 *   <PolarChart />
 * )
 */



import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import ApexChartComponent from "../../components/chart/chart";
import { fetchTransactionList, totalTicketDashboardList } from '../../redux/dashboardSlice';
import Card from '../card/card';
import ChartLabel from '../chart/chartLabel';


function PolarChart() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const {dashboardList:datas , loading} = useSelector((state) => state.dashboardSlice) || {};
    const {totalEvent} = useSelector((state) => state.dashboardSlice) || {};

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchTransactionList());
            dispatch(totalTicketDashboardList());
        };
        fetchData();
    }, [dispatch]);

    const data = {
        series: [
            datas.totalUsers || 0,
            datas.totalEvents || 0,
            totalEvent.ticketsSold || 0,
            totalEvent.ticketsLeft || 0
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
                'rgba(36, 90, 224, 1)',
                'rgba(216, 33, 72, 1)',
                'rgba(1, 200, 151, 1)',
                'rgba(0, 30, 108, 1)'
            ],
            labels: ['New Registration', 'Total Event', 'Ticket Sold', 'Total Unsold'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            }],
        },
    };

    const hasData = data.series.some(value => value > 0);

    return (
        <div className='mb-4'>
            <div >
                <Card loading={loading}>
                    <div  className='event-overview'>
                        <h3>{t("OVERVIEW")}</h3>
                        {hasData ? (
                            <div>
                                <ApexChartComponent options={data.options} series={data.series} type="donut" height="260px" />
                                <div style={{ marginTop: "35px" }}>
                                    <Row>
                                        <Col lg="6" md="6">
                                            <ChartLabel title={t("REGISTERED_USERS")} className={["polar-name-register", "polar-chart-details"]} />
                                        </Col>
                                        <Col lg="6" md="6">
                                            <ChartLabel title={t("TOTAL_EVENTS")} className={["polar-name-event", "polar-chart-details"]} />
                                        </Col>
                                        <Col lg="6" md="6">
                                            <ChartLabel title={t("TICKETS_SOLD")} className={["polar-name-sold", "polar-chart-details"]} />
                                        </Col>
                                        <Col lg="6" md="6">
                                            <ChartLabel title={t("TICKETS_UNSOLD")} className={["polar-name-unsold", "polar-chart-details"]} />
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        ) : (
                            <div className='no-transactions'  style={{ textAlign: 'center' }}><p>{t("NO_DATA_AVAILABLE")}</p></div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default PolarChart;
