/**
 * RoleHead Component
 *
 * This component provides the interface for managing roles in the application. It allows users to create 
 * new roles through a modal dialog and validates the input before dispatching actions to update the state.
 *
 * @component
 * @example
 * return (
 *   <RoleHead />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 * - useState: Hook for managing component state.
 * - useDispatch: Hook for accessing the Redux dispatch function.
 * - createRoleList: Redux action for creating a new role.
 * - roleListDetails: Redux action for fetching role details.
 * - Button: A custom button component for actions.
 * - Card: A custom card component for layout.
 * - CustomInput: A custom input component for form fields.
 * - CustomModal: A custom modal component for displaying dialogs.
 *
 * @returns {JSX.Element} The rendered RoleHead component containing role management UI.
 *
 * @state
 * - showModal {boolean}: Controls the visibility of the modal for creating a new role.
 * - roleName {string}: Stores the name of the role being created.
 * - errors {object}: Holds validation error messages for the form inputs.
 *
 * @logic
 * - Initializes state using `useState` for modal visibility, role name, and errors.
 * - Defines `handleOpen` and `handleClose` functions to manage modal visibility.
 * - Implements `validateForm` to check for input errors (e.g., required field, minimum length).
 * - Handles form submission with `handleSubmit`, validating input and dispatching actions if valid.
 * - Renders a button to open the modal and a modal containing the role creation form.
 *
 * @events
 * - handleOpen: Opens the modal for creating a new role.
 * - handleClose: Closes the modal and resets the form fields and errors.
 * - validateForm: Validates the role name input and returns any errors.
 * - handleSubmit: Validates the form on submission and dispatches the create role action if valid.
 */


import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';

import { createRoleList } from "../../redux/rolePermission";
import {
    roleListDetails,
} from '../../redux/rolePermission';
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import CustomInput from '../customInput/customInput';
import CustomModal from '../modal/Modal';


function RoleHead() {
    const [showModal, setShowModal] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        dispatch(roleListDetails());
        setRoleName("")
        setShowModal(false);

    };

    const validateForm = () => {
        const errors = {};
        if (!roleName.trim()) {
            errors.roleName = t("ROLE_NAME_IS_REQUIRED");
        } else if (roleName.length < 3) {
            errors.roleName = t("ROLE_NAME_MUST_BE_THREE_CHARACTER_LONG");
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            dispatch(createRoleList(roleName));

            handleClose();
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className='mb-3'>
            <div className='d-flex justify-content-end align-items-center'>
                <div className='d-flex justify-content-end gap-2'>
                    <Button
                        type="button"
                        name={t("ADD_ROLE")}
                        featureName={constant.SETTINGS}
                        permissionName={constant.CREATE_ROLE}
                        onClick={handleOpen}
                    />
                </div>
            </div>


            <CustomModal show={showModal} handleClose={handleClose} body={
                <div>
                    <h3 className='mb-3'>{t("CREATE_A_NEW_ROLE")}</h3>
                    <form onSubmit={handleSubmit}>
                        <CustomInput
                            type="text"
                            label={t("NEW_ROLE")}
                            className="mb-3"
                            value={roleName}
                            onChange={(e) => {
                                setRoleName(e.target.value);
                                if (errors.roleName) {
                                    setErrors((prev) => ({ ...prev, roleName: null }));
                                }
                            }}
                            name="roleName"
                        />
                        {errors.roleName && (
                            <p style={{ color: 'red', fontSize: '0.875rem' }}>
                                {errors.roleName}
                            </p>
                        )}
                        <div className='d-flex justify-content-end gap-2 mt-3'>
                            <Button
                                name={t("CANCEL")}
                                style={{ backgroundColor: "#6c757d", color: "white" }}
                                onClick={handleClose}
                            />
                            <Button
                                type="submit"
                                name={t("SAVE")}
                            />
                        </div>
                    </form>
                </div>
            } />
        </div>
    );
}

export default RoleHead;
