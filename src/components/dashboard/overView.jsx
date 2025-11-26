/**
 * TotalEvent Component
 *
 * This component displays a summary of total events, users registered, tickets sold, and revenue.
 * It fetches the relevant data from the Redux store and presents it using DashboardCard components.
 * Each card includes an icon, title, and value, and can trigger a console log when clicked.
 *
 * @component
 * @example
 * return (
 *   <TotalEvent />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { Col, Container, Row } from 'react-bootstrap': Components for layout and grid structure.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - map: An image asset representing a revenue icon.
 * - dashboard: An image asset representing a new events icon.
 * - person: An image asset representing a users registered icon.
 * - ticket: An image asset representing a tickets sold icon.
 * - { fetchTransactionList } from '../../redux/dashboardSlice': Action for fetching transaction data.
 * - DashboardCard: A component for displaying individual dashboard cards with information.
 *
 * @effects
 * - useEffect: Fetches dashboard data when the component mounts.
 *
 * @returns {JSX.Element} The rendered TotalEvent component displaying summary cards.
 */


import 'react-loading-skeleton/dist/skeleton.css';

import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import map from "../../assets/Bitmap-icon.png";
import dashboard from "../../assets/dashboard-icon.png";
import person from "../../assets/person-icon.png";
import ticket from "../../assets/ticket-icon.png";
import { statisticsData } from '../../redux/dashboardSlice';
import DashboardCard from '../card/dashboardCard';

function TotalEvent() {
    const dispatch = useDispatch();
    const { statistics: data, loading } = useSelector((state) => state.dashboardSlice) || [];
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(statisticsData());
        };
        fetchData();
    }, [dispatch]);



    const getValueOrDefault = (value) => value !== undefined ? value : 0;

    return (
        <div>
            <div>
                <Row>
                    <Col lg={6} md={6} xs={12} className="badge-container-col">
                        <DashboardCard
                            title={t("EVENTS")} 
                            value={getValueOrDefault(data?.comparison?.events?.monthly)}
                            icon={dashboard}
                            className="text-white icon-container"
                            onClick={() => console.log('New Events clicked')}
                            loading={loading}
                        />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="badge-container-col">
                        <DashboardCard
                            title={t("REGISTERED_USERS")}
                            value={getValueOrDefault(data?.comparison?.users?.monthly)}
                            icon={person}
                            className="text-white icon-container-register"
                            onClick={() => console.log('User Registration clicked')}
                            loading={loading}

                        />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="badge-container-col">
                        <DashboardCard
                            title={t("TICKETS_SOLD_BY")}
                            value={getValueOrDefault(data?.comparison?.tickets?.monthly)}
                            icon={ticket}
                            className="text-white icon-container-sold"
                            onClick={() => console.log('Ticket Sold clicked')}
                            loading={loading}

                        />
                    </Col>
                    <Col lg={6} md={6} xs={12} className="badge-container-col">
                        <DashboardCard
                            title={t("REVENUE")}
                            value={`$ ${getValueOrDefault(data?.comparison?.revenue?.monthly).toLocaleString('en-US')}`}
                            icon={map}
                            className="text-white icon-container-revenue"
                            onClick={() => console.log('Total Revenue clicked')

                            }
                            loading={loading}

                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default TotalEvent;
