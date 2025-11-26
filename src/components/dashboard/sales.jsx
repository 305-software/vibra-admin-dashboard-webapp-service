import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { salesRevenueList } from '../../redux/dashboardSlice';
import Card from '../card/card';
import ApexChartComponent from '../chart/chart';


const CandlestickChart = () => {
    const dispatch = useDispatch();
    const { salesRevenue: totalEvent, loading } = useSelector((state) => state.dashboardSlice) || [];
    const [series, setSeries] = useState([]);
    const { t } = useTranslation();

    const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));

    useEffect(() => {
        if (selectedYear) {
            dispatch(salesRevenueList(selectedYear));
        }
    }, [dispatch, selectedYear]);

    useEffect(() => {
        if (!Array.isArray(totalEvent)) {
            console.error('Expected totalEvent to be an array:', totalEvent);
            return;
        }

        const monthData = Array(12).fill(0);

        totalEvent.forEach(item => {
            if (item.month && item.totalPrice !== undefined) {
                const monthIndex = item.month - 1;
                monthData[monthIndex] = item.totalPrice;
            } else {
                console.warn('Invalid item structure:', item);
            }
        });

        const transformedData = monthData.map(value => value || 0);

        setSeries([{
            name: 'Revenue',
            data: transformedData
        }]);
    }, [totalEvent]);

    const handleYearChange = (date, dateString) => {
        const yearToUse = dateString || dayjs().format('YYYY');
        setSelectedYear(yearToUse);
    };

    const options = {
        chart: {
            type: 'line',
            height: "250",
            toolbar: { show: false },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            labels: {
                rotate: -45,
                style: {
                    colors: '#757575', // Change color of x-axis labels
                    fontSize: '14px', // Change font size of x-axis labels
                    fontWeight: "400"
                }
            },

        },
        yaxis: {
            labels: {
                style: {
                    colors: '#757575', // Change color of x-axis labels
                    fontSize: '12px', // Change font size of x-axis labels
                    fontWeight: "400"
                }
            }
        },
        tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            x: {
                show: false
            },
            y: {
                formatter: function (value) {
                    return `$${value.toLocaleString()}`;
                }
            },
            marker: {
                show: true,
            }
        },
        plotOptions: {
            line: {
                backgroundColor: '#FF9900',
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2,
            colors: ['#FF9900'],
        },
        grid: {
            strokeDashArray: 4,
        },
        colors: ['#FF9900'],
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 3,
            strokeWidth: 0,
            hover: {
                size: 6,
                sizeOffset: 0
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                }
            }
        }
    };

    return (
        <div className='mb-4'>
            <Card loading={loading} >
                <div>
                    <div className='event-Containers'>
                        <h3>{t("REVENUE_BY_SALES")}</h3>
                        <Space direction="vertical">
                            <DatePicker
                                className='form-event-control'
                                onChange={handleYearChange}
                                defaultValue={dayjs()}
                                picker="year"
                             
                            />
                        </Space>
                    </div>
                    {series[0]?.data?.length > 0 ? (
                        <ApexChartComponent
                            type="area"
                            series={series}
                            options={options}
                            height={250}
                        />
                    ) : (
                        <div className='NoEventList'>{t("NO_DATA_AVAILABLE")}</div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CandlestickChart;