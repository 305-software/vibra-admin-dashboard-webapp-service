/**
 * CustomFileInput Component
 *
 * This component renders a file input field with an optional label.
 * It allows users to upload files and notifies the parent component of changes.
 *
 * @component
 * @example
 * return (
 *   <CustomFileInput label="Upload File" onChange={handleFileChange} name="fileUpload" />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 *
 * @props
 * - {string} label: The label to display above the file input.
 * - {function} onChange: Callback function to handle file input changes.
 * - {string} name: The name attribute for the file input, used for form submission.
 *
 * @returns {JSX.Element} The rendered CustomFileInput component containing the label and file input.
 */


import React from 'react';

const CustomFileInput = ({ label, onChange, name }) => {
    return (
        <div className="form-group">
            <h4 className='mb-1'> {label && <label>{label}</label>}</h4>

            <div>
                <input
                    type="file"
                    className="form-event-control custom-file-input"
                    onChange={onChange}
                    name={name}
                />
            </div>

        </div>
    );
};

export default CustomFileInput;
