
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


import React from 'react'

function HeaderCard({children}) {
    return (
        <div>
            <div className="Headercard">

                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default HeaderCard
