import * as actionTypes from './actionType';

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

export const sort = ({ sortKey, sortOrder }) => {
    return {
        type: actionTypes.DATATABLE_SORT,
        payload: {
            sortKey,
            sortOrder,
        }
    }
}

