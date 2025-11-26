/**
 * SubMenu Component
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const SidebarLink = styled(Link)`
  display: flex;
  color: black;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  height: 48px;
  text-decoration: none;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: ${({ isActive }) =>
    isActive ? "rgba(246, 176, 39, 0.8)" : "transparent"};
  
  &:hover {
    background: rgba(246, 176, 39, 0.5);
    color: #000;
  }

  &.active {
    background: rgba(246, 176, 39, 0.8);
    font-weight: bold;
    color: #000000;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 12px;
  position: relative;
  font-family: outfit;
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? "550" : "400")};
  color: ${({ isActive }) =>
    isActive ? "rgba(18,18,18,1)" : "rgba(117, 117, 117, 1)"};
  white-space: nowrap;  
  overflow: hidden;
  text-overflow: ellipsis;

  &.active {
    background: rgba(246, 176, 39, 0.8);
    font-weight: bold;
    color: #000000;
  }
`;

const IconWrapper = styled.div`
  color: ${({ isActive }) =>
    isActive ? "rgba(246, 176, 39, 1)" : "rgba(117, 117, 117, 1)"};
`;

const RightIconWrapper = styled.div`
  color: ${({ isActive }) =>
    isActive ? "rgba(246, 176, 39, 1)" : "rgba(117, 117, 117, 1)"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubMenu = ({ item, closeSidebar, onItemClick }) => {
  const [subnav, setSubnav] = useState(false);
  const location = useLocation();

  const isActive = () => {
    if (location.pathname === item.path) return true;
    if (item.path && location.pathname.startsWith(item.path)) return true;
    if (item.subNav) {
      return item.subNav.some(subItem => 
        location.pathname === subItem.path || 
        location.pathname.startsWith(subItem.path)
      );
    }
    return false;
  };

  const showSubnav = () => {
    setSubnav(!subnav);
    if (closeSidebar && !subnav) {
      closeSidebar();
    }
  };

  const handleClick = () => {
    if (item.subNav) {
      showSubnav();
    }
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <>
      <SidebarLink
        to={item.path}
        onClick={handleClick}
        isActive={isActive()}
        className={isActive() ? "active" : ""}
      >
        <div className="d-flex justify-content-center align-items-center">
          <IconWrapper isActive={isActive()}>{item.icon}</IconWrapper>
          <SidebarLabel isActive={isActive()}>{item.title}</SidebarLabel>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : item.rightIcon ? (
                <RightIconWrapper isActive={isActive()}>
                  {item.rightIcon}
                </RightIconWrapper>
              ) : null}
        </div>
      </SidebarLink>

      {subnav &&
        item.subNav?.map((subItem, index) => (
          <SidebarLink
            to={subItem.path}
            key={index}
            isActive={location.pathname === subItem.path}
            onClick={(e) => {
              e.stopPropagation();
              if (closeSidebar) closeSidebar();
            }}
            className={location.pathname === subItem.path ? "active" : ""}
          >
            {subItem.icon}
            <SidebarLabel isActive={location.pathname === subItem.path}>
              {subItem.title}
            </SidebarLabel>
          </SidebarLink>
        ))}
    </>
  );
};

export default SubMenu;