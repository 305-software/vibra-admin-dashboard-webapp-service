import 'dayjs/locale/zh-cn';

import { Calendar, Col, Row, Select } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import React, { useEffect,useState } from 'react';

import Card from '../card/card';
import UpcomingEvent from "../dashboard/upcomingEvent";


/**
 * Calender Component
 * 
 * This component displays a calendar and updates the current date when a new date is selected. 
 * It also shows upcoming events based on the selected date.
 * 
 * @component
 * @example
 * return (
 *   <Calender />
 * )
 */

dayjs.extend(dayLocaleData);


const Calender = () => {
    // Initialize with today's date using dayjs
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [calender, setCalender] = useState(dayjs().format('YYYY-MM-DD'));

    // Set initial date when component mounts
    useEffect(() => {
        const today = dayjs();
        setCurrentDate(today);
        setCalender(today.format('YYYY-MM-DD'));
    }, []);

    const onPanelChange = (value) => {
        setCurrentDate(value);
        setCalender(value.format('YYYY-MM-DD'));
    };

    const onDateSelect = (date) => {
        setCurrentDate(date);
        setCalender(date.format('YYYY-MM-DD'));
    };

    return (
        <div className='card-bottom'>
            <Card>
                <div>
                    <Calendar
                        fullscreen={false}
                        value={currentDate}
                        headerRender={({ value, onChange }) => {
                            const start = 0;
                            const end = 12;
                            const monthOptions = [];
                            let current = value.clone();
                            const localeData = value.localeData();
                            const months = [];

                            for (let i = 0; i < 12; i++) {
                                current = current.month(i);
                                months.push(localeData.monthsShort(current));
                            }

                            for (let i = start; i < end; i++) {
                                monthOptions.push(
                                    <Select.Option key={i} value={i} className="month-item">
                                        {months[i]}
                                    </Select.Option>,
                                );
                            }

                            const year = value.year();
                            const options = [];
                            for (let i = year - 10; i < year + 10; i += 1) {
                                options.push(
                                    <Select.Option key={i} value={i} className="year-item">
                                        {i}
                                    </Select.Option>,
                                );
                            }

                            return (
                                <div className='calender-event'>
                                    <Row style={{ gap: "5px" }}>
                                        <Col lg="4" md="6" className='mb-3'>
                                            <Select
                                                size="small"
                                                popupMatchSelectWidth={false}
                                                value={value.month()}
                                                onChange={(newMonth) => {
                                                    const now = value.clone().month(newMonth);
                                                    onChange(now);
                                                }}
                                            >
                                                {monthOptions}
                                            </Select>
                                        </Col>
                                        <Col lg="4" md="6" className='mb-3'>
                                            <Select
                                                size="small"
                                                popupMatchSelectWidth={false}
                                                className="my-year-select"
                                                value={year}
                                                onChange={(newYear) => {
                                                    const now = value.clone().year(newYear);
                                                    onChange(now);
                                                }}
                                            >
                                                {options}
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        }}
                        onPanelChange={onPanelChange}
                        onSelect={onDateSelect}
                    />
                </div>
                <UpcomingEvent calender={calender} />
            </Card>
        </div>
    );
};

export default Calender;