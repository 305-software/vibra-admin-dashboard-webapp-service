/**
 * EventHead Component
 *
 * This component provides a header section for filtering customer events by category and date.
 * It integrates with Redux to fetch event categories and utilizes Ant Design's DatePicker for date selection.
 *
 * @component
 * @example
 * return (
 *   <EventHead setSelectedCategory={setCategory} setDate={setEventDate} />
 * )
 *
 * @imports
 * - { DatePicker, Space } from 'antd': Ant Design components for date selection.
 * - React, { useEffect }: React library and hooks for managing component lifecycle.
 * - useDispatch, useSelector: Redux hooks for dispatching actions and selecting state.
 * - eventCategoryDetails: Redux action for fetching event category details.
 * - Card: Custom component for displaying content in a card format.
 * - CustomInput: Custom component for rendering input fields.
 *
 * @props
 * - {function} setSelectedCategory: Function to update the selected event category in the parent component.
 * - {function} setDate: Function to update the selected date in the parent component.
 *
 * @state
 * - categories: Array of event categories fetched from the Redux store.
 *
 * @effects
 * - useEffect: Fetches event categories when the component mounts.
 *
 * @methods
 * - handleCategoryChange: Updates the selected category based on user input.
 * - onChange: Updates the selected date based on user input.
 *
 * @returns {JSX.Element} The rendered EventHead component containing category and date selection inputs.
 */



import React, { useContext } from 'react';
import { useTranslation } from "react-i18next";
import { UserContext } from '../context/userContext';

import Card from '../card/HeaderCard';

function EventHead() {
    const { t } = useTranslation();
    const { user, isAdmin } = useContext(UserContext);

    return (
        <div className='mb-3'>
            <Card>
                <div className='d-flex justify-content-between align-items-baseline'>
                    <h3>{t(isAdmin() ? "SETTINGS" : "PROFILE")} </h3>

                </div>
            </Card>
        </div>
    );
}

export default EventHead;
