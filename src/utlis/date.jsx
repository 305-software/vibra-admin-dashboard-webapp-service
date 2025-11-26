import React from 'react';

const FormattedDate = ({ date }) => {
  if (!date) return null;

  const formattedDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
