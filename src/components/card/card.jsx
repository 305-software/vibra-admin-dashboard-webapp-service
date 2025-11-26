
/**
 * Card Component
 * 
 * This component serves as a container for other components or content, providing a styled card layout.
 * It wraps its children elements within a card structure.
 * 
 * @component
 * @param {React.ReactNode} children - The content to be displayed inside the card.
 * @example
 * return (
 *   <Card>
 *     <p>This is some content inside the card.</p>
 *   </Card>
 * )
 */


import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';
import Skeleton from 'react-loading-skeleton';

const Card = ({ children, loading = false, className = '' }) => {
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
    <div className="card">

    <div className="card-body">
      {children}
    </div>
  </div>
  );
};

export default Card;