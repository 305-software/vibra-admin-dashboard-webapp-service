/**
 * RoleTable Component
 * 
 * This component displays a list of roles in a table format with options to edit and delete roles.
 * It fetches role data from the Redux store and provides modals for editing and deleting roles.
 * 
 * @component
 * @returns {JSX.Element} The rendered RoleTable component.
 * 
 * @dependencies
 * - React
 * - Redux (useDispatch, useSelector)
 * - react-toastify (toast notifications)
 * - i18next (translation)
 * - Custom components: Button, Card, CustomModal, CustomTable, RoleHead
 * 
 * @example
 * <RoleTable />
 * 
 * @functions
 * - fetchRoles: Fetches the list of roles from the Redux store.
 * - handleDelete: Deletes a role and refreshes the list.
 * - handleEdit: Opens the edit modal with the selected role.
 * - handleDeleteClick: Opens the delete confirmation modal.
 * - handleCloseEditModal: Closes the edit modal and refreshes the list.
 * - handleCloseDeleteModal: Closes the delete modal and refreshes the list.
 * 
 * @state
 * - showDeleteModal {boolean} - Controls visibility of the delete confirmation modal.
 * - showEditModal {boolean} - Controls visibility of the edit modal.
 * - selectedRoleId {string|null} - Stores the ID of the selected role for editing or deletion.
 * - selectedCategory {string} - Stores the currently selected category for filtering roles.
 * 
 */



import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { deleteRoleDetails, roleListDetails } from '../../../../redux/rolePermission';
import * as constant from "../../../../utlis/constant";
import Button from '../../../button/button';
import Card from '../../../card/tableCard';
import CustomModal from '../../../modal/Modal';
import CustomTable from '../../../table/analyticsTable';
import RoleHead from "./createRole";

const RoleTable = () => {
    const dispatch = useDispatch();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [selectedCategory] = useState('');
    const { t } = useTranslation();
    const roles = useSelector((state) => state.rolePermission.roleList) || [];

    useEffect(() => {
        fetchRoles();
    }, [dispatch, selectedCategory]);


 

    const fetchRoles = async () => {
        try {
            await dispatch(roleListDetails(selectedCategory));
        } catch (error) {
            toast.error(error?.message || 'Failed to fetch roles');
        }
    };

    const handleDelete = async () => {
        if (!selectedRoleId) return;

        try {
            await dispatch(deleteRoleDetails(selectedRoleId)).unwrap();
            toast.success(t("ROLE_DELETED_SUCCESSFULLY"), {
                display: 'flex',
                toastId: 'user-action',
                autoClose: 2000,
                closeOnClick: true,
                pauseOnHover: false,
            });

            fetchRoles(); // Refresh the list
            handleCloseDeleteModal();
        } catch (error) {
            toast.error(error?.message || 'Failed to delete role');
        }
    };

    const handleEdit = async (row) => {
        setSelectedRoleId(row.id);
        setShowEditModal(true);

    };



    const handleDeleteClick = (row) => {
        setSelectedRoleId(row.id);
        setShowDeleteModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedRoleId(null);
        fetchRoles()
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedRoleId(null);
        fetchRoles()

    };

    const handleRoleUpdate = () => {
        fetchRoles();
    };

    const tableData = roles?.map((role, index) => ({
        [t("SNO")]: index + 1,
        [t("NAME")]: role.roleName,
        [constant.ID]: role._id
    }));

    const tableHeaders = [
        t("SNO"),
        t("NAME"),
        t("ACTIONS")
    ];

    return (
        <Card>
            <RoleHead  onRoleUpdate={handleRoleUpdate}/>
            <div className='booking-main-head'>
                {tableData.length > 0 ? (
                    <CustomTable
                        headers={tableHeaders}
                        data={tableData}
                        rowsPerPage={10}
                        featureName={constant.SETTINGS}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                ) : (
                    <div className='no-details NoEventList text-center p-4'>
                        <p>{t("NO_ROLES_AVAILABLE")}</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <CustomModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                body={
                    <RoleHead
                        onClose={handleCloseEditModal}
                        userId={selectedRoleId}
                        isEditMode={true}
                    />
                }
            />


            {/* Delete Modal */}
            <CustomModal
                show={showDeleteModal}
                handleClose={handleCloseDeleteModal}
                handleConfirm={handleDelete}
                body={
                    <div>
                        <h3 className='mb-3'>{t("DELETE")}</h3>
                        <h5>{t("ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_ROLE")}</h5>
                        <div className='d-flex justify-content-end gap-2 mt-3'>
                            <Button
                                type="button"
                                name={t("CANCEL")}
                                style={{ backgroundColor: "#6c757d", color: "white" }}
                                onClick={handleCloseDeleteModal}
                            />
                            <Button
                                type="button"
                                style={{ backgroundColor: "rgb(231, 28, 28)", color: "white" }}
                                name={t("DELETE")}
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                }
            />
        </Card>
    );
};

export default RoleTable;