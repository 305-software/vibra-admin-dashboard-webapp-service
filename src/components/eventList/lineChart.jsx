import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { eventByIdList } from "../../redux/eventSlice";
import Card from '../card/card';
import ApexChartComponent from '../chart/chart';


/**
 * AreaChart component
 * 
 * A functional React component that displays an area chart with revenue data.
 * Utilizes Redux for state management, React-i18next for internationalization,
 * and ApexCharts for chart rendering.
 * 
 * @component
 * @example
 * // Usage example:
 * // <AreaChart id="12345" />
 * 
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID used to fetch event data.
 * @returns {JSX.Element} The rendered AreaChart component.
 */

function AreaChart({ id }) {
    const dispatch = useDispatch();
    const { eventById: eventData, loading } = useSelector((state) => state.eventSlice) || {};
    const { t } = useTranslation();

    // Debug logging

    // Initialize with a default value
    const defaultYearlyData = {};

    // Safely calculate yearly data with extensive null checks
    const yearlyData = React.useMemo(() => {
        
        try {
            if (!eventData || !eventData.totalRevenue) {
                return defaultYearlyData;
            }

            const data = {};
            eventData.totalRevenue.forEach((item) => {
                
                if (!item) return;

                const year = Number(item.year);
                const month = Number(item.month);
                const price = Number(item.totalPrice);

                if (isNaN(year) || isNaN(month) || isNaN(price)) {
                    return;
                }

                if (!data[year]) {
                    data[year] = Array(12).fill(0);
                }
                data[year][month - 1] = price;
            });

            return data;
        } catch (error) {
            console.error('Error processing yearly data:', error);
            return defaultYearlyData;
        }
    }, [eventData]);

    // Initialize total revenue with a default value
    const defaultTotalRevenue = 0;

    // Safely calculate total revenue
    const totalRevenue = React.useMemo(() => {
        try {
            if (Object.keys(yearlyData).length === 0) {
                return defaultTotalRevenue;
            }

            const total = Object.values(yearlyData)
                .flat()
                .reduce((acc, price) => {
                    const numPrice = Number(price);
                    return acc + (isNaN(numPrice) ? 0 : numPrice);
                }, 0);

            return total;
        } catch (error) {
            console.error('Error calculating total revenue:', error);
            return defaultTotalRevenue;
        }
    }, [yearlyData]);

    // Format total revenue with guaranteed default
    const formattedTotalRevenue = React.useMemo(() => {
        try {
            // Ensure totalRevenue is a number
            const numericTotal = Number(totalRevenue);
            if (isNaN(numericTotal)) {
                return '0';
            }
            return numericTotal.toLocaleString('en-US');
        } catch (error) {
            console.error('Error formatting total revenue:', error);
            return '0';
        }
    }, [totalRevenue]);

    const years = Object.keys(yearlyData).sort();

    const chartData = React.useMemo(() => ({
        series: years.map(year => ({
            name: `Revenue ${year}`,
            data: yearlyData[year] || Array(12).fill(0)
        })),
        options: {
            chart: {
                type: 'area',
                height: 350,
                zoom: { enabled: false }
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            title: {
                text: t("REVENUE"),
                align: 'left',
                style: {
                    fontSize: '16px',
                    fontWeight: 400,
                    lineHeight: '26px',
                    textAlign: 'left',
                    color: "rgba(117, 117, 117, 1)"
                }
            },
            subtitle: {
                text: `$${formattedTotalRevenue}`,
                align: 'left',
                style: {
                    fontFamily: "Lato",
                    fontSize: '34px',
                    fontWeight: 800,
                    lineHeight: '44px',
                    textAlign: 'left',
                    color: "rgba(0,0,0, 1)"
                }
            },
            colors: ['rgba(246, 176, 39, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                type: 'category',
            },
            yaxis: { opposite: true },
            legend: { horizontalAlign: 'left' }
        }
    }), [years, yearlyData, formattedTotalRevenue, t]);

    useEffect(() => {
        if (id) {
            dispatch(eventByIdList(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="mb-4">
                <Card loading={true}>
                    <div className="h-[350px] flex items-center justify-center">
                        Loading...
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <Card>
                    <ApexChartComponent 
                        options={chartData.options} 
                        series={chartData.series} 
                        type="area" 
                        height={350} 
                    />
                </Card>
            </div>
        </div>
    );
}

export default AreaChart;