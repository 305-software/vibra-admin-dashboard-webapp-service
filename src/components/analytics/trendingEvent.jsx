import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { trendingEventsData } from '../../redux/dashboardSlice';
import Card from '../card/card';

/**
 * TrendingEvent Component
 * 
 * This component displays a list of trending events. It fetches the trending events data from the Redux store 
 * and updates the component accordingly.
 * 
 * @component
 * @example
 * return (
 *   <TrendingEvent />
 * )
 */

function TrendingEvent() {
    const dispatch = useDispatch();
    const {trendingEvents:totalEvent , loading} = useSelector((state) => state.dashboardSlice) || [];
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(trendingEventsData());
    }, [dispatch]);

    return (
        <div className="mb-4">
            <Card loading={loading}>
                <div className='trendingevent'>
                    <h3>{t("TRENDING_EVENTS")}</h3>
                    {totalEvent.length > 0 ? (
                        totalEvent.map((details, index) => (
                            <div className='trending-div' key={index._id}>
                                <div className='trending-main'>
                                <p className='trending-index'>{index + 1}</p>
                                <p className='trending-name'>{details.eventName}</p>
                                </div>
                                <div className="trending-sales">
                                    <span className='trending-seats'> {details.bookedSeatsCount}</span>
                                    <span className='trending-sales'>Sales</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-transactions' style={{ textAlign: 'center' }}>
                            <p>{t("NO_TRENDING_EVENTS_AVAILABLE")}</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default TrendingEvent;
