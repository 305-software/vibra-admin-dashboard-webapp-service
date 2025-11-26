/**
 * CustomTextArea Component
 *
 * This component renders a customizable text area with an optional label.
 * It allows users to input multi-line text and notifies the parent component of changes.
 *
 * @component
 * @example
 * return (
 *   <CustomTextArea 
 *     label="Comments" 
 *     value={comment} 
 *     onChange={handleCommentChange} 
 *     name="comments" 
 *     required 
 *   />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 *
 * @props
 * - {string} label: The label to display above the text area.
 * - {string} value: The current value of the text area.
 * - {function} onChange: Callback function to handle changes in the text area.
 * - {string} name: The name attribute for the text area, used for form submission.
 * - {boolean} required: Indicates if the text area is required (default is false).
 * - {object} style: Additional styles for the label.
 *
 * @returns {JSX.Element} The rendered CustomTextArea component containing the label and text area.
 */



import React from 'react';

const CustomTextArea = ({ label, value, onChange, name ,required ,style }) => {
    return (
        <div className="form-group">
                        {label && <label htmlFor={name} style={style} className='mb-1'>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>}

            <textarea
                className="form-control"
                value={value}
                onChange={onChange}
                name={name}
            />
        </div>
    );
};

export default CustomTextArea;
