/**
 * ticketSoldByToday Component
 *
 * This component displays the number of tickets sold today along with a progress bar
 * indicating the sales. It fetches the ticket sales data from the Redux store and compares
 * it with the previous day's sales.
 *
 * @component
 * @example
 * return (
 *   <ticketSoldByToday />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - { useDispatch, useSelector } from 'react-redux': Hooks for interacting with Redux store.
 * - analysize: An image asset representing an analysis graphic.
 * - { fetchTransactionList } from '../../redux/dashboardSlice': Action for fetching transaction data.
 * - ProgressBar: A component to display a progress bar indicating ticket sales.
 *
 * @effects
 * - useEffect: Fetches ticket sales data when the component mounts.
 *
 * @returns {JSX.Element} The rendered ticketSoldByToday component displaying today's ticket sales and progress.
 */



import 'react-loading-skeleton/dist/skeleton.css';

import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import Skeleton from 'react-loading-skeleton';
import { useDispatch, useSelector } from 'react-redux';

import analysize from "../../assets/analysize.png"
import { statisticsData } from '../../redux/dashboardSlice';
import ProgressBar from '../progressBar/progressBar';

function ticketSoldByToday() {
    const dispatch = useDispatch();
    const {statistics:data , loading} = useSelector((state) => state.dashboardSlice) || [];
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(statisticsData());
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
        <div className='ticket-details mb-4'>
            <h3>{t("TICKETS_SOLD_BY")}</h3>
            <h3>{t("TODAY")}</h3>
            <h1 style={{ marginTop: "12px", marginBottom: "12px" }}>{data?.today?.tickets || 0}</h1>

            <div className='progressData'>
                <ProgressBar
                    className="progress-bar progress-bar-green"
                    data={data?.today?.tickets}
              
                />
            </div>
            <div className='comparison'>
                <div>
                    <h6 className='comparsion-lineheight'>{t("COMPARING")} </h6>
                    <h6>{t("LAST_DAY")}</h6>
                </div>


                <div className='d-flex justify-content-center align-items-center gap-2' ><img src={analysize} /> <h6 className='comparison-percentage'>{data?.today?.comparingLastDay} %</h6> </div>
            </div>
        </div>

    )
}

export default ticketSoldByToday
