import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect,useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { createRoleList, getRoleByIdDetails, roleListDetails,updateRoles  } from "../../../../redux/rolePermission";
import * as constant from "../../../../utlis/constant";
import Button from '../../../button/button';
import CustomInput from '../../../customInput/customInput';
import CustomModal from '../../../modal/Modal';

/**
 * RoleHead component
 * 
 * A functional React component for creating or editing roles.
 * Utilizes Redux for state management, React-i18next for internationalization,
 * React-Toastify for notifications, and custom components for input fields and modals.
 * 
 * @component
 * @example
 * // Usage example:
 * // <RoleHead userId="12345" onClose={handleClose} isEditMode={true} />
 * 
 * @param {Object} props - The props object.
 * @param {string} props.userId - The ID used to fetch role details.
 * @param {function} [props.onClose] - The function to call when the modal is closed.
 * @param {boolean} [props.isEditMode=false] - Flag indicating if the component is in edit mode.
 * @returns {JSX.Element} The rendered RoleHead component.
 */

function RoleHead({ userId, onClose = null, isEditMode = false , onRoleUpdate }) {
    const [showModal, setShowModal] = useState(isEditMode || false);
    const [roleName, setRoleName] = useState('');
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const roleDetails = useSelector((state) => state.rolePermission.getRoleById);
    const { t } = useTranslation();

    useEffect(() => {
        fetchRoles();
        // If userId is provided, fetch role details
        if (userId) {

            dispatch(getRoleByIdDetails(userId));
        }
    }, [dispatch, userId]);

   
    
        const fetchRoles = async () => {
            try {
                await dispatch(roleListDetails());
            } catch (error) {
                toast.error(error?.message || 'Failed to fetch roles');
            }
        };

    useEffect(() => {
        // Populate form with role details when they are fetched
        if (roleDetails && isEditMode) {
            setRoleName(roleDetails.roleName || '');
        }
    }, [roleDetails, isEditMode]);

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setRoleName("");
        setShowModal(false);
        if (onClose) onClose();
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
            if (isEditMode && userId) {
             
                // Update existing role
                dispatch(updateRoles({ id: userId, formValues: { roleName } })).unwrap();

                toast.success(t("ROLE_UPDATED_SUCCESSFULLY"), {
                    display: 'flex',
                    toastId: 'user-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: false,
                });
                if (onRoleUpdate) onRoleUpdate();
                handleClose();
            } else {
                // Create new role
                dispatch(createRoleList(roleName));
                toast.success(t("ROLE_CREATED_SUCCESSFULLY"), {
                    display: 'flex',
                    toastId: 'user-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: false,
                });
            }
            if (onRoleUpdate) onRoleUpdate();
            handleClose();
        } else {
            setErrors(validationErrors);
        }
    };

    // If component is used in edit mode and accessed through modal
    if (isEditMode && onClose) {
        return (
            <div>
                <h3 className='mb-3'>{t("EDIT_ROLE")}</h3>
                <form onSubmit={handleSubmit}>
                    <CustomInput
                        type="text"
                        label={t("ROLE_NAME")}
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
        );
    }

    return (
        <div className=''>
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