/**
 * Tab Component
 * 
 * This component provides a simple tabbed navigation system where users can switch between different tab panes.
 * 
 * @component
 * @param {Object} props - React props.
 * @param {React.ReactNode} props.children - The tab panes to be rendered.
 * @returns {JSX.Element} The rendered Tab component.
 * 
 * @example
 * <Tab>
 *   <TabPane label="Tab 1">Content for Tab 1</TabPane>
 *   <TabPane label="Tab 2">Content for Tab 2</TabPane>
 * </Tab>
 * 
 * @state
 * - activeIndex {number} - Stores the index of the currently active tab.
 */


import React, { useState } from 'react';

const Tab = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {React.Children.map(children, (child, index) => (
          <button
            className={`tab-button ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {React.Children.map(children, (child, index) =>
          index === activeIndex ? child : null
        )}
      </div>
    </div>
  );
};

const TabPane = ({ children }) => {
  return <div>{children}</div>;
};

export { Tab, TabPane };