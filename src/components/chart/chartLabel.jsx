/**
 * ChartLabel Component
 * 
 * This component displays a label with a title and value, styled with the provided class names.
 * It is typically used to annotate charts with descriptive labels.
 * 
 * @component
 * @param {string} title - The title to display in the label.
 * @param {Array<string>} className - An array of class names for styling the label.
 * @param {string|number} value - The value to display in the label.
 * @example
 * return (
 *   <ChartLabel
 *     title="Completed"
 *     className={["label-completed", "chart-label"]}
 *     value={75}
 *   />
 * )
 */



import React from 'react';

function ChartLabel({ title, className, value }) {
    return (
        <div className={`${className[1]}`}>
            <div className={`${className[2]}`}>
                <span className={`${className[0]}`}></span>
                <h6 className='lableTitle'>{title}</h6>
            </div>
            <span className='chartValue'>{value}</span>
        </div>
    );
}

export default ChartLabel;