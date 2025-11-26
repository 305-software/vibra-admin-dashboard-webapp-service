/**
 * ProgressBarComponent
 *
 * This component renders a Bootstrap progress bar that visually represents a progress value.
 *
 * @component
 * @example
 * return (
 *   <ProgressBarComponent data={60} variant="success" />
 * )
 *
 * @props
 * - data {number}: The current progress value (between 0 and 100) to be displayed on the progress bar.
 * - variant {string}: The color variant of the progress bar (e.g., "success", "danger", "warning").
 *
 * @returns {JSX.Element} The rendered ProgressBarComponent containing the Bootstrap progress bar.
 *
 * @logic
 * - Renders a Bootstrap `ProgressBar` component with the current progress value set by the `data` prop.
 * - The `variant` prop determines the color scheme of the progress bar.
 */



import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

function ProgressBarComponent({ data, variant }) {
  const percentage=Math.round((data) / 100 * 100)
  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <ProgressBar now={percentage} variant={variant} />
    </div>
  );
}

export default ProgressBarComponent;
