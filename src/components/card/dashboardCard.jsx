/**
 * DashboardCard Component
 * 
 * This component displays a card with a title, value, and an icon. It is used to show key metrics or information on a dashboard.
 * 
 * @component
 * @param {string} title - The title to display on the card.
 * @param {string|number} value - The value to display on the card.
 * @param {string} icon - The URL of the icon to display on the card.
 * @param {string} className - Additional class names for styling the card.
 * @param {object} style - Inline styles to apply to the card.
 * @param {function} onClick - Function to call when the card is clicked.
 * @example
 * return (
 *   <DashboardCard
 *     title="Total Sales"
 *     value={1500}
 *     icon="/path/to/icon.png"
 *     className="custom-class"
 *     style={{ backgroundColor: 'lightblue' }}
 *     onClick={() => console.log('Card clicked')}
 *   />
 * )
 */

import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';
import Skeleton from 'react-loading-skeleton';

const DashboardCard = ({ title, value, icon,className, style, onClick ,loading }) => {
  if (loading) {
    return (
      <div className={`rounded-lg border bg-card text-card-foreground shadow p-4 ${className}`}>
        <div className="space-y-3">
          <Skeleton height={24} width="40%" />
          <Skeleton height={16} count={3} />
          <div className="flex gap-4 mt-4">
            <Skeleton height={40} width={40} circle />
            <div className="flex-1">
              <Skeleton height={16} width="60%" />
              <Skeleton height={12} width="40%" className="mt-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="badge-container d-flex align-items-center"
      style={style}
      onClick={onClick}
    >
      <div className={`${className}`} >
        <img src={icon}  className="icon-image"  alt="icon" />
      </div>
      <div className="text-container">
        <h4 className="title mb-2">{title}</h4>
        <h1 className="count mb-0">{value|| 0} </h1>
      </div>
    </div>
  );
};

export default DashboardCard;
