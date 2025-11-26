


import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import map from "../../assets/Bitmap-icon.png"
import dashboard from "../../assets/dashboard-icon.png";
import person from "../../assets/person-icon.png";
import ticket from "../../assets/ticket-icon.png";
import { statisticsData } from '../../redux/dashboardSlice';
import DashboardCard from '../card/dashboardCard';

/**
 * Overview Component
 * 
 * This component displays an overview of various statistics such as events, registered users, tickets sold, 
 * and total revenue. It fetches these statistics from the Redux store and displays them in DashboardCard components.
 * 
 * @component
 * @example
 * return (
 *   <Overview />
 * )
 */

function Overview() {

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
           
                <div className="">
                    <Row>
                        <Col lg={3} md={6} xs={12}>
                            <DashboardCard
                                 title={t("EVENTS")} 
                                 value={data?.comparison?.events?.yearly}
                                icon={dashboard}
                                className="text-white icon-container "
                                onClick={() => console.log('New Events clicked')}
                                loading={loading}
                            />
                        </Col>
                        <Col lg={3} md={6} xs={12}>
                            <DashboardCard
                                 title={t("REGISTERED_USERS")}
                                 value={data?.comparison?.users?.yearly}
                                icon={person}
                                className="text-white  icon-container-register"
                                onClick={() => console.log('User Registration clicked')}
                                loading={loading}
                            />
                        </Col>
                        <Col lg={3} md={6} xs={12}>
                            <DashboardCard
                                title={t("TICKETS_SOLD_BY")}
                                value={data?.comparison?.tickets?.yearly}
                                icon={ticket}
                                className=" text-white icon-container-sold"
                                onClick={() => console.log('Ticket Sold clicked')}
                                loading={loading}
                            />
                        </Col>
                    
                        <Col lg={3} md={6} xs={12}>
                            <DashboardCard
                                title={t("TOTALREVENUE")}
                                icon={map}
                                value={`$ ${getValueOrDefault(data?.comparison?.revenue?.yearly.toLocaleString('en-US'))}`}
                                className="text-white icon-container-revenue"
                                onClick={() => console.log('Total Revenue clicked')}
                                loading={loading}
                            />
                        </Col>
                    </Row>
                </div>
           
        </div>
    );
}

export default Overview;

