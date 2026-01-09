/**
 * Button Component
 * 
 * This component renders a button with optional permission checks and a loading state.
 * It uses cookies to check user permissions and conditionally enables or disables the button.
 * 
 * @component
 * @param {string} name - The text to display on the button.
 * @param {function} onClick - The function to call when the button is clicked.
 * @param {string} type - The type of the button (e.g., "button", "submit").
 * @param {object} style - The custom styles to apply to the button.
 * @param {string} variant - The variant of the button (e.g., "primary", "secondary").
 * @param {string} featureName - The name of the feature for permission checking.
 * @param {string} permissionName - The name of the permission to check.
 * @param {boolean} loading - Whether the button is in a loading state.
 * @example
 * return (
 *   <Button
 *     name="Submit"
 *     onClick={handleSubmit}
 *     type="submit"
 *     style={{ backgroundColor: 'blue' }}
 *     variant="primary"
 *     featureName="Event"
 *     permissionName="Create"
 *     loading={isLoading}
 *   />
 * )
 */


import React from "react";
import { Spinner } from "react-bootstrap"; // Import Spinner
import Cookies from "universal-cookie";

import * as constant from "../../utlis/constant";


// Permission check function
const hasPermission = (featureName, permissionName) => {
  const cookies = new Cookies();
  const roles = cookies.get(constant.ROLES);

  // Check if roles exist
  if (!roles || roles.length === 0) {
    return false; // No roles found
  }

  const rolePermissions = roles[0]?.rolePermissions;

  // Find the feature's permissions
  const featurePermissions = rolePermissions?.find(
    (role) => role.featureName === featureName
  );


  // Check if the user has the specified permission
  return (
    featurePermissions &&
    featurePermissions.permissions.some(
      (perm) => perm.permissionName === permissionName
    )
  );
};

// Common Button Component
function Button({
  name,
  onClick,
  type,
  style,
  variant,
  featureName,
  permissionName,
  loading, // New loading prop
  children,  // New children prop for custom content
  className  // New className prop
}) {
  // Check permission
  const isAllowed =
    featureName && permissionName
      ? hasPermission(featureName, permissionName)
      : true;

  // Combine classes: always include event-speaker-button, plus any custom className
  const buttonClassName = className 
    ? `event-speaker-button ${className}` 
    : "event-speaker-button";

  // Render button with disabled state based on permission
  return (
    <button
      type={type}
      className={buttonClassName}
      style={style}
      variant={variant}
      onClick={isAllowed && !loading ? onClick : undefined} // Only call onClick if allowed and not loading
      disabled={type === "button" && (!isAllowed || loading)} // Disable if type is button and not allowed or loading
      aria-disabled={type === "button" && (!isAllowed || loading)} // For accessibility
    >
      {loading ? (
        <div>
            <span className="me-2">{name}</span>
          <Spinner
            animation="border"
            size="sm"
            className="me-2" // Add margin to the right
          />
        </div>

      ) : children ? (
        children
      ) : (
        name
      )}
    </button>
  );
}

export default Button;
