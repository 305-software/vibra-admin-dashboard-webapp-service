/**
 * App Component
 *
 * This component renders a calendar interface that allows users to select dates
 * and view upcoming events. It utilizes the Ant Design Calendar component and 
 * integrates with the Day.js library for date manipulation.
 *
 * @component
 * @example
 * return (
 *   <App />
 * )
 *
 * @imports
 * - { Calendar, Col, Row, Select } from 'antd': Ant Design components for UI.
 * - dayjs: A date manipulation library.
 * - dayLocaleData: A Day.js plugin for locale data.
 * - React: The React library for building user interfaces.
 * - UpcomingEvent: A component to display upcoming events based on the selected date.
 *
 * @state
 * - {object} currentDate: Holds the currently selected date.
 * - {string} calender: Holds the formatted string of the currently selected date.
 *
 * @methods
 * - onPanelChange: Updates the current date and formatted calendar date when the panel changes.
 * - onDateSelect: Updates the formatted calendar date when a date is selected from the calendar.
 *
 * @returns {JSX.Element} The rendered App component containing the calendar and upcoming events.
 */



import { Calendar, Col, Row, Select } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import React, { useEffect,useState } from 'react';

import UpcomingEvent from "./upcomingEvent";

dayjs.extend(dayLocaleData);

const App = () => {
  const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with today's date
  const [calender, setCalender] = useState(dayjs().format('YYYY-MM-DD')); // Initialize with today's date

  useEffect(() => {
    // Fetch events for today's date when the component mounts
    setCalender(dayjs().format('YYYY-MM-DD'));
  }, []);

  const onPanelChange = (value) => {
    setCurrentDate(value);
    setCalender(value.format('YYYY-MM-DD'));
  };

  const onDateSelect = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setCalender(formattedDate);
  };

  const wrapperStyle = {
    padding: "10px 10px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div>
      <div style={wrapperStyle}>
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
    </div>
  );
};

export default App;
