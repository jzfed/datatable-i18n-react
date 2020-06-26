import React from 'react'
import { CLASS_PREFIX } from '../../common/js/constant';
import { Bars } from '../icons';
import'./loading.scss';

export const LoadingBar = (props) => {
    return (
        <div className={`${CLASS_PREFIX}loading-bar`}>
            <Bars size={40} />
        </div>
    )
}