import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { deleteUser, getUserById, getUserDetails } from '../../redux/userSlice';
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import Card from '../card/tableCard';
import CustomModal from '../modal/Modal';
import CustomTable from '../table/analyticsTable';
import CreateUser from './createUser';
import UserHead from './userHead';

const UserTable = () => {
    const dispatch = useDispatch();

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { t } = useTranslation();
    const users = useSelector((state) => state.userSlice.listUser) || [];

    useEffect(() => {
        fetchUsers();
    }, [dispatch, selectedCategory]);

    const fetchUsers = async () => {
        try {
            await dispatch(getUserDetails(selectedCategory)).unwrap();
        } catch (error) {
            toast.error(error?.message || 'Failed to fetch users');
        }
    };

    const handleDelete = async () => {
        if (!selectedUserId) return;

        try {

            await dispatch(deleteUser(selectedUserId)).unwrap();
            await fetchUsers(); // Refresh the list
            handleCloseDeleteModal();
        } catch (error) {
            toast.error(error?.message || 'Failed to delete user');
        }
    };

    const handleEdit = async (row) => {
        try {
            // Fetch the full user details
            await dispatch(getUserById(row.id)).unwrap();
           
            // Open the modal in edit mode
            setSelectedUserId(row.id);
            setShowEditModal(true);
        } catch (error) {
            toast.error(error?.message || 'Failed to fetch user details');
        }
    };
    const handleDeleteClick = (row) => {
        setSelectedUserId(row.id);
        setShowDeleteModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedUserId(null);
         fetchUsers();
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUserId(null);
    }

    const tableData = users.map((user, index) => ({
        [t("SNO")]: index + 1,
        [t("EMAIL")]: user.email,
        [t("NAME")]: user.userName,
        [t("ROLE_SMALL")]: user.role || 'N/A',
        [constant.ID]: user._id
    }));

    const tableHeaders = [
        t("SNO"), 
        t("EMAIL"), 
        t("NAME"), 
        t("ROLE_SMALL"), 
        t("ACTIONS")
    ];

    return (
        <Card>
    
            <div className='booking-main-head'>
                <UserHead setSelectedCategory={setSelectedCategory} />
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
                        <p>{t("NO_USERS_AVAILABLE")}</p>
                    </div>
                )}
            </div>

                {/* Edit Modal */}
                <CustomModal
                show={showEditModal}
                handleClose={handleCloseEditModal}
                body={
                    <CreateUser
                        onClose={handleCloseEditModal}
                        userId={selectedUserId}
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
                        <h5>{t("ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_USER")}</h5>
                        <div className='d-flex justify-content-end gap-2 mt-3'>
                            <Button
                                name={t("CANCEL")}
                                style={{ backgroundColor: "#6c757d", color: "white" }}
                                onClick={handleCloseDeleteModal}
                            />
                            <Button
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

export default UserTable;