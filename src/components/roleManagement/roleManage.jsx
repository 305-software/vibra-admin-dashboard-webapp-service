import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    editRoleList,
    featuresListDetails,
    permissionListDetails,
    permissionListDetailsById,
    resetPermissionList,
    roleListDetails} from '../../redux/rolePermission';
import * as constant from "../../utlis/constant";
import Button from '../button/button';
import Card from '../card/tableCard';
import Toggle from '../customInput/customCheckbox';
import CustomInput from '../customInput/customInput';
import RoleHead from './roleHead';
/**
 * RoleManagement component for managing user roles and feature permissions.
 * It provides a form to select a role and manage its associated permissions.
 *
 * @component
 * @returns {JSX.Element} RoleManagement component
 */

const RoleManagement = () => {
    const dispatch = useDispatch();
    const roles = useSelector((state) => state.rolePermission.roleList) || [];
    const features = useSelector((state) => state.rolePermission.featuresList) || [];
    const permissions = useSelector((state) => state.rolePermission.permissionList) || [];
    const rolePermissionById = useSelector((state) => state.rolePermission.permissionListById) || {};
    const { t } = useTranslation();

    const initialFormState = {
        id: '',
        roleId: '',
        featurePermissions: [],
    };

    const [formValues, setFormValues] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    // Fetch initial data
    useEffect(() => {
        dispatch(roleListDetails());
        dispatch(featuresListDetails());
        dispatch(permissionListDetails());
        return () => {
            dispatch(resetPermissionList());
            setFormValues(initialFormState);
        };
    }, [dispatch]);
    useEffect(() => {
        return () => {
            setFormValues(initialFormState);
        };
    }, []);

    // Fetch role permissions when a role is selected
    useEffect(() => {
        if (formValues.roleId) {
            dispatch(permissionListDetailsById(formValues.roleId));
        }
    }, [dispatch, formValues.roleId]);

    // Update form values with fetched role permissions
    useEffect(() => {
        if (rolePermissionById?.role?.rolePermissions) {
            setFormValues(prev => ({
                ...prev,
                featurePermissions: rolePermissionById.role.rolePermissions.map((rolePermission) => ({
                    featureId: rolePermission.featureId,
                    permissions: rolePermission.permissions?.map((perm) => perm.permissionId || perm._id) || [],
                }))
            }));
        } else if (formValues.roleId) {
            // Reset permissions if no existing permissions found
            setFormValues(prev => ({
                ...prev,
                featurePermissions: []
            }));
        }
    }, [rolePermissionById]);

    const handleCategoryChange = (event) => {
        const selectedRoleId = event.target.value;
        setFormValues(() => ({
            roleId: selectedRoleId,
            featurePermissions: []
        }));
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === constant.PERMISSIONID) {
            const [featureId, permissionId] = value.split('-');
            if (!featureId || !permissionId) {
                console.error(t("INVALID_FEATURE_AND_PERMISSION_ID"));
                return;
            }

            setFormValues((prevValues) => {
                const featurePermissions = [...prevValues.featurePermissions];
                const featureIndex = featurePermissions.findIndex((item) => item.featureId === featureId);

                const viewPermission = permissions.find((perm) => perm.permissionName === constant.VIEW_ROLE);
                const createPermission = permissions.find((perm) => perm.permissionName === constant.CREATE_ROLE);

                if (featureIndex > -1) {
                    const permissionsSet = new Set(featurePermissions[featureIndex].permissions);

                    if (checked) {
                        // Adding permission logic
                        permissionsSet.add(permissionId);

                        // Automatically enable View if Create is checked
                        if (permissionId === (createPermission?._id || createPermission?.permissionId)) {
                            permissionsSet.add(viewPermission._id || viewPermission.permissionId);
                        }
                    } else {
                        // Disabling permission logic
                        permissionsSet.delete(permissionId);
                    }

                    featurePermissions[featureIndex].permissions = Array.from(permissionsSet);
                } else if (checked) {
                    const newPermissions = [permissionId];
                    if (permissionId === (createPermission?._id || createPermission?.permissionId)) {
                        newPermissions.push(viewPermission._id || viewPermission.permissionId);
                    }
                    featurePermissions.push({
                        featureId,
                        permissions: newPermissions,
                    });
                }

                return { ...prevValues, featurePermissions };
            });
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        if (!formValues.roleId) {

            setLoading(false);
            return;
        }



        // Filter out features with no permissions
        const filteredFeaturePermissions = formValues.featurePermissions.filter(
            (item) => item.permissions.length > 0
        );

        const payload = {

            roleId: formValues.roleId,
            featurePermissions: filteredFeaturePermissions.map((item) => ({
                featureId: item.featureId,
                permissions: item.permissions,
            })),
        };

        try {

            await dispatch(editRoleList(payload)).unwrap();
            toast.success(t("ROLE_UPDATED_SUCCESSFULLY"), {
                display: 'flex',
                toastId: 'user-action',
                autoClose: 2000,
            });



        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Container fluid>

                <Form className="create-event" onSubmit={handleSubmit}>
                    <Row>
                        <Col lg={12} md={12} className="mb-4">
                            <Card>
                                <div className="booking-main-head">
                                    <RoleHead />
                                    <Form.Group controlId="roleId" className="mb-4">
                                        <CustomInput
                                            type="dropdown"
                                            label={t("ROLE_NAME")}
                                            options={roles}
                                            className="form-control"
                                            name="roleId"
                                            defaultOption="select"
                                            value={formValues.roleId}
                                            onChange={handleCategoryChange}
                                        />
                                    </Form.Group>
                                    <h3 className="mb-4">{t("PERMISSION_LIST")}</h3>
                                    <Row className="mb-4">
                                        <Col className="d-flex align-items-center justify-content-between">
                                            <Col xs={3}><h3 className="mb-0">{t("MODULES")}</h3></Col>
                                            <Col xs={2}><h3 className="mb-0">{t("VIEW_ROLE")}</h3></Col>
                                            <Col xs={2}><h3 className="mb-0">{t("CREATE_EDIT")}</h3></Col>
                                        </Col>
                                    </Row>
                                    {features.map((feature) => {
                                        const hasPermissions = permissions.some(permission =>
                                            permission.permissionName === constant.VIEW_ROLE || permission.permissionName === constant.CREATE_ROLE
                                        );

                                        return hasPermissions ? (
                                            <Row key={feature._id}>
                                                <Col className="d-flex align-items-center justify-content-between">
                                                    <Col xs={3}><h5>{feature.featureName}</h5></Col>
                                                    {permissions.map((perm) => (
                                                        (perm.permissionName === constant.VIEW_ROLE || perm.permissionName === constant.CREATE_ROLE) && (
                                                            <Col xs={2} key={perm._id}>
                                                                <Toggle
                                                                    isChecked={formValues.featurePermissions.some(
                                                                        (featurePermission) =>
                                                                            featurePermission.featureId === feature._id &&
                                                                            featurePermission.permissions.includes(perm._id || perm.permissionId)
                                                                    )}
                                                                   
                                                                    onToggle={(newState) => {
                                                                        handleChange({
                                                                            target: {
                                                                                name: 'permissionId',
                                                                                value: `${feature._id}-${perm.permissionId || perm._id}`,
                                                                                checked: newState,
                                                                            },
                                                                        });
                                                                    }}
                                                                />
                                                            </Col>
                                                        )
                                                    ))}
                                                </Col>
                                                <hr className="mt-2 hr-line" />
                                            </Row>
                                        ) : null;
                                    })}
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            type="submit"
                                            name={t("SAVE")}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
};

export default RoleManagement;