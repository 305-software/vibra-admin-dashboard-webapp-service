import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { roleListDetails } from '../../redux/rolePermission';
import { createUserListDetails, editUserList, getUserById } from "../../redux/userSlice";
import Button from '../button/button';
import CustomInput from '../customInput/customInput';

const CreateUser = ({ onClose, userId}) => {
    const initialFormValues = {
        email: '',
        roleId: '',
        userName: '',
    };
    const { t } = useTranslation();

    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState(initialFormValues);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const roles = useSelector((state) => state.rolePermission.roleList) || [];
    const userDetails = useSelector((state) => state.userSlice.userById);

    // Fetch roles and user details if editing
    useEffect(() => {
        dispatch(roleListDetails());

        // If userId is provided, fetch user details
        if (userId) {
            dispatch(getUserById(userId));
        }
    }, [dispatch, userId]);

    // Update form values when user details are fetched
    useEffect(() => {
        if (userId && userDetails) {
            setFormValues({
                email: userDetails.email,
                roleId: userDetails.roleId,
                userName: userDetails.userName,
            });
        } else {
            setFormValues(initialFormValues);
        }
    }, [userDetails, userId]);

    const validate = () => {
        const newErrors = {};
        if (!formValues.roleId?.trim()) {
            newErrors.roleId = t("PLEASE_SELECT_THE_ROLE");
        }
        if (!formValues.email?.trim()) {
            newErrors.email =t("PLEASE_ENTER_THE_EMAIL");
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            newErrors.email = t("PLEASE_ENTER_A_VALID_EMAIL");
        }
        if (!formValues.userName?.trim()) {
            newErrors.userName = t("PLEASE_ENTER_THE_NAME");
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            if (userId) {
                // Edit existing user
                await dispatch(editUserList({
                    id: userId,
                    formValues
                })).unwrap();

                toast.success(t("USER_UPDATED_SUCCESSFULLY"), {
                    display: 'flex',
                    toastId: 'user-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: false,
                });

            } else {
                // Create new user
                await dispatch(createUserListDetails(formValues)).unwrap();
                toast.success(t("USER_CREATED_SUCCESSFULLY"), {
                    display: 'flex',
                    toastId: 'user-action',
                    autoClose: 2000,
                    closeOnClick: true,
                    pauseOnHover: false,
                });
            }

            // Reset form and close modal
          
            setTimeout(() => {
                onClose();
                setFormValues(initialFormValues);
            }, 2000);
        } catch (error) {
            toast.error(error?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Container fluid>

            <div>

                <Form className='create-event' onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={12} md={12} className='mb-4'>
                            <div className='booking-main-head'>
                                <h3 className='mb-4'>{userId ? t("EDIT_USER") : t("USER_DETAILS")}</h3>

                                <Form.Group controlId="roleId" className="mb-3">
                                    <CustomInput
                                        type="dropdown"
                                        label={t("ROLE_NAME")}
                                        options={roles}
                                        name='roleId'
                                        value={formValues.roleId}
                                        onChange={handleChange}
                                        isInvalid={!!errors.roleId}
                                        defaultOption="Select"
                                    />
                                    {errors.roleId && <p className="text-danger">{errors.roleId}</p>}
                                </Form.Group>

                                <Form.Group controlId="userName" className="mb-3">
                                    <CustomInput
                                        type="text"
                                        label={t("NAME")}
                                        name="userName"
                                        value={formValues.userName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.userName}
                                    />
                                    {errors.userName && <p className="text-danger">{errors.userName}</p>}
                                </Form.Group>

                                <Form.Group controlId="email" className="mb-3">
                                    <CustomInput
                                        type="email"
                                        label={t("EMAIL")}
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                    />
                                    {errors.email && <p className="text-danger">{errors.email}</p>}
                                </Form.Group>

                                <div className='d-flex justify-content-end gap-2 mt-3'>
                                <Button
                                    name={t("CANCEL") }
                                    type="button"
                                    style={{ backgroundColor: "#6c757d", color: "white" }}
                                    onClick={onClose}
                                />
                                    <Button
                                        type="submit"
                                        name={userId ? t("UPDATE") : t("SAVE")}
                                        loading={loading}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Container>
    );
};

export default CreateUser;