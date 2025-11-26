/**
 * CustomInput Component
 *
 * This component renders a customizable input field that can handle different types 
 * such as text, file, and dropdown. It supports labels, required indicators, and 
 * integrates with React's ref forwarding.
 *
 * @component
 * @example
 * return (
 *   <CustomInput 
 *     type="text" 
 *     label="Username" 
 *     name="username" 
 *     required 
 *     onChange={handleInputChange} 
 *   />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 *
 * @props
 * - {string} type: The type of input (e.g., "text", "file", "dropdown").
 * - {string} label: The label to display above the input field.
 * - {Array} options: Array of options for dropdown type (default is an empty array).
 * - {string} name: The name attribute for the input, used for form submission.
 * - {string} defaultOption: The default option for dropdown (default is "All").
 * - {boolean} required: Indicates if the input is required (default is false).
 * - {string} value: The current value of the input field.
 * - {object} style: Additional styles for the label.
 * - {number} min: Minimum value for number inputs.
 * - {function} onChange: Callback function to handle input changes.
 * - {number} step: Step value for number inputs.
 * - {object} ref: Ref for accessing the input element directly.
 *
 * @returns {JSX.Element} The rendered CustomInput component containing the appropriate input type.
 */

import React from 'react';

const CustomInput = React.forwardRef(({ type, label, options = [], format, name, defaultOption = "All", required, value, style, min, onChange, step, pattern }, ref) => {
    // Specifically handle file inputs differently
    if (type === 'file') {
        return (
            <div className="form-group">
                {label && <label htmlFor={name} style={style} className='mb-1'>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>}
                <input
                    type="file"
                    ref={ref}
                    onChange={onChange}
                    name={name}
                    className="form-control"
                />
            </div>
        );
    }

    if (type === 'dropdown') {
        return (
            <div className="form-group">
                {label && <label htmlFor={name} style={style} className='mb-1'>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>}
                <div className="dropdown-wrapper" style={{ position: 'relative' }}>
                    <select 
                        value={value} 
                        onChange={onChange} 
                        name={name}   
                        className="form-control custom-select"
                        style={{ 
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            paddingRight: '30px',
                            backgroundImage: 'none'
                        }}
                    >
                        <option value="">{defaultOption}</option>
                        {options.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name || category.roleName}
                            </option>
                        ))}
                    </select>
                    {/* Dropdown Arrow Icon */}
                    <div 
                        className="dropdown-icon"
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            color: '#666'
                        }}
                    >
                        <svg 
                            width="12" 
                            height="12" 
                            viewBox="0 0 12 12" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M2 4L6 8L10 4" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-group">
            {label && <label htmlFor={name} style={style} className='mb-1'>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>}
            <input
                type={type}
                ref={ref}
                format={format}
                step={step}
                value={value}
                pattern={pattern}
                min={min}
                onChange={onChange}
                name={name}
                className="form-control"
            />
        </div>
    );
});

export default CustomInput;