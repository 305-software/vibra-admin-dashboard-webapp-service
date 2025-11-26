/**
 * CustomModal Component
 *
 * This component renders a Bootstrap modal dialog. It displays a body content passed as a prop 
 * and provides a method to close the modal.
 *
 * @component
 * @example
 * return (
 *   <CustomModal show={isModalVisible} handleClose={closeModal} body={<p>Your content here</p>} />
 * )
 *
 * @props
 * - show {boolean}: Indicates whether the modal is visible or not.
 * - handleClose {function}: Function to call when the modal should be closed.
 * - body {JSX.Element}: The content to be displayed inside the modal body.
 *
 * @returns {JSX.Element} The rendered CustomModal component containing the modal dialog.
 *
 * @logic
 * - Renders a Bootstrap modal that is controlled by the `show` prop.
 * - Displays the `body` content inside the modal.
 * - Calls `handleClose` when the modal is requested to be hidden.
 */



import React from 'react';
import { Modal } from 'react-bootstrap';

const CustomModal = ({ show, handleClose, body }) => {
    return (
        <Modal

            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show} onHide={handleClose}>

            <Modal.Body>
                {body}
            </Modal.Body>

        </Modal>
    );
};

export default CustomModal;
