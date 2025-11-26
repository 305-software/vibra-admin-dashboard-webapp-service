/**
 * Toggle Component
 *
 * This component renders a toggle switch that allows users to toggle between two states (checked/unchecked).
 * It accepts a label for the toggle and notifies the parent component of state changes.
 *
 * @component
 * @example
 * return (
 *   <Toggle label="Enable Feature" isChecked={true} onToggle={handleToggle} />
 * )
 *
 * @imports
 * - React: The React library for building user interfaces.
 *
 * @props
 * - {string} label: The label to display next to the toggle switch.
 * - {boolean} isChecked: The current state of the toggle (default is false).
 * - {function} onToggle: Callback function to handle toggle state changes.
 *
 * @methods
 * - handleToggle: Toggles the state and calls the onToggle callback with the new state.
 *
 * @returns {JSX.Element} The rendered Toggle component containing the label and toggle switch.
 */




import React from 'react';
const Toggle = ({ label, isChecked = false, onToggle }) => {
  const handleToggle = () => {
    if (onToggle) onToggle(!isChecked); // Pass the new state to the parent
  };

  return (
    <div className="toggle-container" onClick={handleToggle}>
      {label && <span className="toggle-label">{label}</span>}
      <div className={`toggle-switch ${isChecked ? 'on' : 'off'}`}>
        <div className="toggle-thumb"></div>
      </div>
    </div>
  );
};

export default Toggle;
