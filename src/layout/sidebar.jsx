import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { UserContext } from "../components/context/userContext";
import { IoSettingsOutline } from "react-icons/io5";

import * as constant from "../utlis/constant";

import getSidebarData from "./sidebarData";
import SubMenu from "./subMenu";

const SidebarNav = styled.nav`
  background: #fffefe;
  width: 270px;
  height: 100vh;
  z-index: 1;
  flex-direction: column;
  box-shadow: 0px 4px 4px 0px #00000040;
  position: fixed;
    color: ${({ isActive }) => (isActive ? "#ffffff" : "#333333")};
  left: 0;
  padding: 24px;
  border-radius: 0 0px 0px 0;
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(231, 28, 28, 0.7);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(231, 28, 28, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(231, 28, 28, 0);
    }
  }

  .pulse-indicator {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #e71c1c;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const Sidebar = () => {
  const cookies = new Cookies();
  const roles = cookies.get(constant.ROLES);
  const location = useLocation();
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const { isAdmin, user } = useContext(UserContext);
  
  // Check if user is verified
  const isVerified = !user?.data?.user?.emailVerified || user?.data?.user?.phoneVerificationStatus === 'pending' ? false : true;

  const hasPermission = (featureName) => {
    const rolePermissions = roles[0]?.rolePermissions || [];
    const featurePermissions = rolePermissions.find(
      (role) => role.featureName === featureName
    );

    return (
      featurePermissions &&
      featurePermissions.permissions.some(
        (perm) => perm.permissionName === constant.VIEW_ROLE
      )
    );
  };

  const isPathActive = (itemPath) => {
    return location.pathname.startsWith(itemPath);
  };

  const isEventsPathActive = isPathActive('/eventList');
  const isEventsActive = isEventsPathActive || isEventsDropdownOpen;

  const handleEventsClick = (item) => {
    if (item.featureName === constant.EVENT) {
      setIsEventsDropdownOpen(!isEventsDropdownOpen);
    }
  };

  React.useEffect(() => {
    if (!isEventsPathActive && isEventsDropdownOpen) {
      setIsEventsDropdownOpen(false);
    }
  }, [isEventsPathActive, isEventsDropdownOpen]);

  const sidebarData = getSidebarData(isEventsActive);

  return (
    <SidebarNav>
      {sidebarData.filter((item) => hasPermission(item.featureName)).map(
        (item, index) => {
          const isActive = isPathActive(item.path);
          return (
            <SubMenu
              item={item}
              key={index}
              isActive={isActive}
              onItemClick={() => handleEventsClick(item)}
            />
          );
        }
      )}
      {!isAdmin() && (
        <div style={{ position: 'relative' }}>
          <SubMenu
            item={{
              title: 'Profile',
              path: '/settings',
              icon: <IoSettingsOutline size={22} className="icon-color" />,
              featureName: constant.SETTINGS
            }}
            isActive={isPathActive('/settings')}
          />
          {!isVerified && (
            <div 
              className="pulse-indicator" 
              style={{ 
                position: 'absolute', 
                top: '8px', 
                right: '8px',
                zIndex: 10
              }} 
              title="Please verify email and phone"
            />
          )}
        </div>
      )}
    </SidebarNav>
  );
};

export default Sidebar;