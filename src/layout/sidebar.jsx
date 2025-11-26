import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Cookies from "universal-cookie";

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
    </SidebarNav>
  );
};

export default Sidebar;