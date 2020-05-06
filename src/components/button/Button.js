import React from 'react'
import './button.scss';

export const Button = (props) => {
    const {
        type,
        ...restProps
    } = props;
    const prefixClass = `button`;
    const colorClass = type ? ` ${type}` : ` default`;
    const mergeClass = `${prefixClass}${colorClass}`;
    return (
        <button className={mergeClass} {...restProps}>
            {props.children}
        </button>
    );
}
