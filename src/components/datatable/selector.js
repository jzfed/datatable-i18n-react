import { createSelector } from 'reselect';

const getSortKey = (state, action) => action.payload.sortKey;
const getSortOrder = (state, action) => action.payload.sortOrder;
const getSortType = (state, action) => action.payload.sortType;
const getTableData = (state, action) => state;

export const sortSelector = createSelector(
    [getSortKey, getSortOrder, getSortType, getTableData],
    (sortKey, sortOrder, sortType, state) => {
        return state.updateIn(['$$data'], list => list.sort((a, b) => {
            switch (sortType) {
                case 'number':
                    return sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]; //Number
                case 'string':
                    return sortOrder === 'asc' ? a[sortKey].toString().localeCompare(b[sortKey]) : b[sortKey].toString().localeCompare(a[sortKey]); //String
                default:
                    return sortOrder === 'asc' ? a[sortKey].toString().localeCompare(b[sortKey]) : b[sortKey].toString().localeCompare(a[sortKey]); //String
            }
        }));
    }
);