/**
 * Main Component
 * 
 * A layout component that wraps the main application content, providing a responsive 
 * sidebar and header. It manages the visibility of the sidebar and handles user interactions 
 * for toggling the sidebar and closing it when clicking outside.
 * 
 * @component
 * @example
 * return (
 *   <Main>
 *     <YourContentComponent />
 *   </Main>
 * );
 * 
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The content to be displayed within the main layout.
 * 
 * @returns {JSX.Element} The rendered Main component.
 * 
 * @state
 * - `isOpen`: Boolean indicating whether the sidebar is currently open or closed.
 * 
 * @hooks
 * - Uses `useEffect` to close the sidebar when the location changes and to manage 
 *   event listeners for clicks outside the sidebar.
 * - Uses `useLocation` from React Router to detect route changes.
 * 
 * @functions
 * - `toggleSidebar`: Toggles the visibility of the sidebar on smaller screens.
 * - `handleClickOutside`: Closes the sidebar if a click occurs outside of it.
 * 
 * @render
 * - Renders the `Header` component at the top.
 * - Displays the `Sidenav` component within a styled sidebar.
 * - Renders the main content area where children components are displayed.
 */


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import Header from "./header";
import Sidenav from "./sidebar";

const LayoutWrapper = styled.div`
  position: relative;
  min-height: 100vh;
`;

const HeaderContainer = styled.header`
  background: #fff;
  padding: 16px 16px 16px 24px;
  position: fixed;
  width: 100%;
  height: 84px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LayoutContainer = styled.div`
  display: flex;
  padding-top: 84px;
  min-height: calc(100vh - 84px);
  position: relative;
`;

const SidebarContainer = styled.div`
  width: 270px;
  background: #f4f4f4;
  position: fixed;
  height: calc(100vh - 84px);
  z-index: 999;
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease;
  overflow-y: scroll;
  overflow-x: hidden;
  box-shadow: 0px 4px 4px 0px #00000040;

  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  
  @media (min-width: 1300px) {
    transform: translateX(0);
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  background-color: rgba(255, 252, 246, 1);
  min-height: calc(100vh - 84px);
  padding: 15px;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? "273px" : "0")};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 1299px) {
    margin-left: 0;
    width: 100%;
  }
`;

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  
  @media (min-width: 1300px) {
    display: none;
  }
`;

function Main({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = window.innerWidth < 1300;

  const toggleSidebar = () => {
    if (window.innerWidth < 1300) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleClickOutside = (event) => {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-button');

    if (
      isOpen &&
      sidebar &&
      !sidebar.contains(event.target) &&
      toggleButton &&
      !toggleButton.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <LayoutWrapper>
      <HeaderContainer>
        <Header toggleSidebar={toggleSidebar} isOpen={isOpen} />
      </HeaderContainer>
      
      <LayoutContainer>
        <SidebarContainer id="sidebar" isOpen={isOpen}>
          <Sidenav />
        </SidebarContainer>
        
        <Overlay isOpen={isOpen && isMobile} onClick={toggleSidebar} />
        
        <ContentContainer isSidebarOpen={isOpen || window.innerWidth >= 1300}>
          {children}
        </ContentContainer>
      </LayoutContainer>
    </LayoutWrapper>
  );
}

export default Main;