/**
 * App Component
 *
 * This component renders a calendar interface that allows users to select dates. It manages the
 * selected date state and communicates the selected date back to a parent component via a callback.
 * The calendar supports month and year selection, along with a reset button to clear the selection.
 *
 * @component
 * @example
 * return (
 *   <App setCalender={(date) => console.log(date)} />
 * )
 *
 * @imports
 * - 'dayjs/locale/zh-cn': Chinese locale for dayjs.
 * - { Calendar, Col, Row, Select } from 'antd': Ant Design components for UI.
 * - dayjs: A date manipulation library.
 * - dayLocaleData: A dayjs plugin for locale data.
 * - React: The React library for building user interfaces.
 * - Button: A custom button component.
 *
 * @props
 * - setCalender (function): A callback function to set the selected date in the parent component.
 *
 * @state
 * - currentDate (Date | null): The currently selected date, initially set to null.
 *
 * @functions
 * - onPanelChange: Handles changes to the calendar panel (month/year).
 * - onDateSelect: Handles date selection from the calendar.
 * - handleReset: Resets the selected date and clears the calendar.
 *
 * @returns {JSX.Element} The rendered App component displaying the calendar interface.
 */




import 'dayjs/locale/zh-cn';

import { Calendar, Col, Row, Select } from 'antd';
import dayjs from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import React, { useState } from 'react';

import Button from '../button/button';
dayjs.extend(dayLocaleData);

const App = ({ setCalender }) => {
  const [currentDate, setCurrentDate] = useState(null);

  const onPanelChange = (value) => {
    setCurrentDate(value);
    setCalender(value.format('YYYY-MM-DD'));
  };

  const onDateSelect = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setCurrentDate(date);
    setCalender(formattedDate);
  };

  const handleReset = () => {
    setCurrentDate(null);
    setCalender('');
  };

  return (
    <div>
      <div className="calender-details">
        <Calendar
          fullscreen={false}
          value={currentDate} // This will be null by default
          defaultValue={null} // Explicitly set default value to null
          headerRender={({ value, onChange }) => {
            // Use a fallback to current date if value is null
            const safeValue = value || dayjs();
            
            const start = 0;
            const end = 12;
            const monthOptions = [];
            let current = safeValue.clone();
            const localeData = safeValue.localeData();
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

            const year = safeValue.year();
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
                  <Col lg="4" md="4" className='mb-3'>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      value={safeValue.month()}
                      onChange={(newMonth) => {
                        const now = safeValue.clone().month(newMonth);
                        onChange(now);
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>

                  <Col lg="4" md="4" className='mb-3'>
                    <Select
                      size="small"
                      popupMatchSelectWidth={false}
                      className="my-year-select"
                      value={year}
                      onChange={(newYear) => {
                        const now = safeValue.clone().year(newYear);
                        onChange(now);
                      }}
                    >
                      {options}
                    </Select>
                  </Col>

                  <Col lg="4" md="4" className='mb-3'>
                    <Button name="Reset" className='reset-button' type='Reset' onClick={handleReset} />
                  </Col>
                </Row>
              </div>
            );
          }}
          onPanelChange={onPanelChange}
          onSelect={onDateSelect}
        />
      </div>
    </div>
  );
};

export default App;