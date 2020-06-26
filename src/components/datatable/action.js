import * as actionTypes from './actionType';


export const fetchDataStarted = () => ({ type: actionTypes.DATATABLE_FETCH_STARTED });
export const fetchDataSuccess = (result) => ({ type: actionTypes.DATATABLE_FETCH_SUCCESS, result });
export const fetchDataFailure = (error) => ({ type: actionTypes.DATATABLE_FETCH_ERROR, error });
export const fetchData = () => {
    return (dispatch, getState) => {
        dispatch(fetchDataStarted());
        return fetch('https://virtserver.swaggerhub.com/jzfed4/datatable-mock/1.0.1/address').then(
            response => response.json()
        ).then(
            data => dispatch(fetchDataSuccess(data))
        ).catch(
            err => dispatch(fetchDataFailure(err))
        );
    }

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

