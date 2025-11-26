/**
 * LatestSales Component
 *
 * This component displays the latest sales transactions in a card format.
 * It fetches the sales data from the Redux store and renders a list of recent sales,
 * including details such as event name, customer name, and event date.
 *
 * @component
 * @example
 * return (
 *   <LatestSales />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - { fetchTransactionList } from '../../redux/dashboardSlice': Action for fetching the latest sales transactions.
 * - Card: A component to display content in a card format.
 *
 * @state
 * - {array} data: Holds the latest sales data fetched from the Redux store.
 *
 * @effects
 * - useEffect: Fetches the latest sales transactions when the component mounts.
 *
 * @returns {JSX.Element} The rendered LatestSales component containing the list of recent sales.
 */

import 'react-loading-skeleton/dist/skeleton.css';

import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';

import { latestSalesData } from '../../redux/dashboardSlice';
import FormattedDate from "../../utlis/date";
import Card from '../card/card';

function LatestSales() {
    const dispatch = useDispatch();
    
    const { latestSales: data, loading } = useSelector((state) => state.dashboardSlice) || [];
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(latestSalesData());
        };
        fetchData();
    }, [dispatch]);
    
    
    if (loading) {
            return (
                <div>
                    <Skeleton />
                </div>
            );
        }

    return (
        <div>
            <Card loading={loading}>
                <div className='event-height mt-1 ml-2'>
                    <h3>{t("LATEST_SALES")}</h3>
                    {data && data.latestSales && data.latestSales.length > 0 ? (
                        data.latestSales.map((event, index) => (
                            <div key={index} className=' mt-2'>
                                <div className='sales-layout'>
                                    <div className='latest-details'>
                                        <div className='latest-image'>
                                            <img
                                                src={`${event.eventImage}`}
                                                alt={event.eventName}
                                                width="52px"
                                                height="52px"
                                                style={{ borderRadius: "12px" }}
                                            />
                                            <div>
                                                <h5 className='mb-1 customerName'>{event.customerName}</h5>
                                                <h6 className='view-more latestEventName'>{event.eventName}</h6>
                                            </div>
                                        </div>
                                        <div>
                                        <h6 className='latestSales-sec'>
                                            <FormattedDate date={event.bookingDate} />
                                        </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-transactions">
                            <p>{t("NO_RECENT_SALES_AVAILABLE")}</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default LatestSales;
