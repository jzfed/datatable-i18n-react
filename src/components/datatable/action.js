import * as actionTypes from './actionType';
import { API } from "../../common/js/constant";

export const fetchDataStarted = () => ({ type: actionTypes.DATATABLE_FETCH_STARTED });
export const fetchDataSuccess = (result) => ({ type: actionTypes.DATATABLE_FETCH_SUCCESS, result });
export const fetchDataFailure = (error) => ({ type: actionTypes.DATATABLE_FETCH_ERROR, error });
export const fetchDataFinish = () => ({ type: actionTypes.DATATABLE_FETCH_FINISH });
export const fetchData = () => {
    return fetchWhtiAction(API.address.get);
}
export const fetchWhtiAction = (url, method='GET', callback) => {
    return (dispatch, getState) => {
        dispatch(fetchDataStarted());
        return fetch(url, {
            method: method
        }).then(
            response => response.json()
        ).then(
            data => {
                if(typeof callback === 'function'){
                    dispatch(callback(data));
                    dispatch(fetchDataFinish());
                }else{
                    dispatch(fetchDataSuccess(data));
                }
            }
        ).catch(
            err => dispatch(fetchDataFailure(err))
        );
    }
}

export const deleteUser = ({ids}) => {
    return fetchWhtiAction(API.address.delete + parseInt(ids), 'DELETE', () => {
        return del({ids});
    });
}

export const addUser = () => {
    return fetchWhtiAction(API.address.add, 'POST', () => {
        return add();
    });
}

export const updateUser = ({ index, key, value }) => {
    return fetchWhtiAction(API.address.update + index, 'PUT', () => {
        return update({ index, key, value });
    });    
}

export const add = () => { //{ name, location, office, officePhone, cellPhone }
    return {
        type: actionTypes.DATATABLE_ADD,
        // payload: {
        //     name,
        //     location,
        //     office,
        //     officePhone,
        //     cellPhone,
        // }
    }
}

export const update = ({ index, key, value }) => {
    return {
        type: actionTypes.DATATABLE_UPDATE,
        payload: {
            index,
            key,
            value,
        }
    }
}

export const del = ({ ids }) => {
    return {
        type: actionTypes.DATATABLE_DELETE,
        payload: {
            ids
        }
    }
}

export const sort = ({ sortKey, sortOrder, sortType }) => {
    return {
        type: actionTypes.DATATABLE_SORT,
        payload: {
            sortKey,
            sortOrder,
            sortType,
        }
    }
}

