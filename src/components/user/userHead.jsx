/**
 * UserHead Component
 * 
 * A component that serves as a header for the user management section. 
 * It allows users to select a category and navigate to the user creation page.
 * 
 * @component
 * @example
 * const setSelectedCategory = (categoryId) => { /* Handle category selection 
 * return <UserHead setSelectedCategory={setSelectedCategory} />;
 * 
 * @param {Object} props - The component props.
 * @param {Function} props.setSelectedCategory - A function to set the selected category in the parent component.
 * 
 * @returns {JSX.Element} The rendered UserHead component.
 * 
 * @hooks
 * - Uses `useEffect` to dispatch an action that fetches the list of roles when the component mounts.
 * - Uses `useSelector` to retrieve the role list from the Redux store.
 * - Uses `useDispatch` to dispatch actions to the Redux store.
 * 
 * @functions
 * - `handleCategoryChange`: Updates the selected category in the parent component based on user selection from the dropdown.
 * - `handleClick`: Navigates to the user creation page when the button is clicked.
 */


import React, { useEffect,useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { roleListDetails } from "../../redux/rolePermission";
import { getUserDetails } from '../../redux/userSlice';
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import CustomInput from '../customInput/customInput';
import CustomModal from '../modal/Modal';
import CreateUser from './createUser';

function UserHead({ setSelectedCategory }) {
    const [showModal, setShowModal] = useState(false);
    const { t } = useTranslation();

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId); // Pass selected category to parent
    };

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        dispatch(getUserDetails());

    };

    const roles = useSelector((state) => state.rolePermission.roleList) || [];
    const dispatch = useDispatch();



    useEffect(() => {
        dispatch(roleListDetails());
    }, [dispatch]); // Add dependency array

    return (
        <div className='mb-3'>
            <div className='d-flex justify-content-end align-items-center'>
            <div className='d-flex justify-content-end gap-2'>
                    <CustomInput
                        type="dropdown"
                        options={roles}
                        className="form-control"
                        name='eventcategory'
                        onChange={handleCategoryChange}
                    />
                    <Button type="button" name={t("ADD_NEW")} featureName={constant.SETTINGS}
                        permissionName="Create" onClick={handleOpen} />

                    <CustomModal
                        show={showModal}
                        handleClose={handleClose}
                        body={
                            <CreateUser onClose={handleClose} />
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default UserHead;
