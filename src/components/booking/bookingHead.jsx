/**
 * EventHead Component
 * 
 * This component provides a header for event bookings, including a dropdown to select event categories and a date picker.
 * It fetches event category details from the Redux store and updates the selected category and date in the parent component.
 * 
 * @component
 * @param {function} setSelectedCategory - Function to set the selected category in the parent component.
 * @param {function} setDate - Function to set the selected date in the parent component.
 * @example
 * return (
 *   <EventHead setSelectedCategory={setSelectedCategory} setDate={setDate} />
 * )
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
                    <h3>{t("BOOKINGS")}</h3>
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
