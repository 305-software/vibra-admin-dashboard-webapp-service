/**
 * EventHead Component
 *
 * This component serves as the header for the events page, allowing users to select event categories,
 * toggle between different views (dashboard, grid, calendar), and navigate to the event creation page.
 * It utilizes Redux for state management and React Router for navigation.
 */

import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Img3 from '../../assets/Updatedcalendar.png';
import Img2 from '../../assets/updatedgrid1.png';
import Img from '../../assets/UpdatedLayer56.png';
import { eventCategoryDetails } from "../../redux/eventSlice";
import * as constant from "../../utlis/constant";
import Button from '../button/button'; // eslint-disable-line no-unused-vars
import Card from '../card/HeaderCard'; // eslint-disable-line no-unused-vars
import CustomInput from '../customInput/customInput'; // eslint-disable-line no-unused-vars

function EventHead({ setView, setSelectedCategory }) {
    const [activeIcon, setActiveIcon] = useState('dashboard');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state) => state.eventSlice.eventCategory) || [];
    const { t } = useTranslation();

    const handleIconClick = (newView) => {
        setView(newView);
        setActiveIcon(newView);
    };

    useEffect(() => {
        dispatch(eventCategoryDetails());
    }, [dispatch]);

    const handleClick = () => {
        navigate("/eventList/createEvent");
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
    };

    return (
        <div className='mb-4'>
            <Card>
                <div className='event-main-container'>
                    <h3>{t("ALL_EVENTS")}</h3>
                    <div className='event-flex-page'>
                        <CustomInput
                            type="dropdown"
                            options={categories}
                            className="form-control"
                            name='eventcategory'
                            onChange={handleCategoryChange}
                        />
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('dashboard')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img}
                                width={24}
                                height={24}
                                alt="Dashboard View"
                                style={{
                                    filter: activeIcon === 'dashboard' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('grid')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img2}
                                width={24}
                                height={24}
                                alt="Grid View"
                                style={{
                                    filter: activeIcon === 'grid' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div
                            className='event-image-border'
                            onClick={() => handleIconClick('calendar')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={Img3}
                                width={24}
                                height={24}
                                alt="Calendar View"
                                style={{
                                    filter: activeIcon === 'calendar' ? 'brightness(0) saturate(100%) invert(82%) sepia(69%) saturate(6144%) hue-rotate(359deg) brightness(102%) contrast(92%)' : 'none'
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                type="button"
                                name={t("CREATE")}
                                featureName={constant.EVENTS}
                                permissionName={constant.CREATE_ROLE}
                                onClick={handleClick}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default EventHead;