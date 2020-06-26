import React from 'react'
import './button.scss';
import { CLASS_PREFIX } from '../../common/js/constant';

export const Button = React.memo((props) => {
    const {
        type,
        size,
        highlight,
        round,
        loading,
        ...restProps
    } = props;

    const classList = [];
    classList.push(`${CLASS_PREFIX}button`);
    type ? classList.push(type) : classList.push('default');
    size ? classList.push(size) : classList.push('normal');
    highlight && classList.push('highlight');
    round && classList.push('round-border');
    loading && classList.push('loading');
    const mergeClass = classList.join(' ');
    return (
        <button className={mergeClass} {...restProps}>
            {props.children}
        </button>
    );
});
