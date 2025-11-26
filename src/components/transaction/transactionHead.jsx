/**
 * EventHead Component
 * 
 * A component that allows users to select an event category and a date for transactions.
 * It integrates with Redux to fetch event categories and passes selected values back to the parent component.
 * 
 * @component
 * @example
 * const handleCategoryChange = (categoryId) => {
 *   console.log("Selected Category ID:", categoryId);
 * };
 * const handleDateChange = (dateString) => {
 *   console.log("Selected Date:", dateString);
 * };
 * return (
 *   <EventHead 
 *     setSelectedCategory={handleCategoryChange} 
 *     setDate={handleDateChange} 
 *   />
 * );
 * 
 * @param {Object} props - The component props.
 * @param {function} props.setSelectedCategory - Callback function to set the selected category in the parent component.
 * @param {function} props.setDate - Callback function to set the selected date in the parent component.
 * 
 * @returns {JSX.Element} The rendered EventHead component.
 * 
 * @hooks
 * - Uses `useEffect` to dispatch an action to fetch event categories on component mount.
 * - Uses `useSelector` to retrieve event categories from the Redux store.
 * 
 * @events
 * - `handleCategoryChange`: Triggers when the category dropdown value changes and updates the parent component.
 * - `onChange`: Triggers when the date is selected from the DatePicker and updates the parent component.
 */


import { DatePicker, Space } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { eventCategoryDetails } from "../../redux/eventSlice";
import Card from '../card/HeaderCard';
import CustomInput from '../customInput/customInput';

function EventHead({ setSelectedCategory, setDate }) {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(eventCategoryDetails());
    }, [dispatch]);

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId); // Pass selected category to parent
    };

 
    const onChange = (date, dateString) => {
        setDate(dateString); // Set the date string in the parent
    };

    const dateFormat = 'YYYY-MM-DD';

    return (
        <div className='mb-3'>
            <Card>
                <div className='d-flex justify-content-between align-items-baseline'>
                    <h3>{t("TRANSACTIONS")} </h3>
                    <div className='d-flex justify-content-between gap-2'>

                        <CustomInput
                            type="dropdown"
                            options={categories}
                            className="form-control"
                            name='eventcategory'

                            onChange={handleCategoryChange}
                        />
                        <Space direction="vertical" >

                            <DatePicker
                                className="form-control"
                                onChange={onChange}
                                format={dateFormat} // Ensure the format is consistent
                            />
                        </Space>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default EventHead;
