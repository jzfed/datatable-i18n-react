import React from 'react'
import './icons.scss';

export const TriangleArrow = React.memo((props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" width={props.size} height={props.size} viewBox={`0 0 16 16`} className="icon">
            <polygon points="8,4 16,12 0,12" />
        </svg>
    )
})