import { createSelector } from 'reselect';

const getSortKey = (state, action) => action.payload.sortKey;
const getSortOrder = (state, action) => action.payload.sortOrder;
const getSortType = (state, action) => action.payload.sortType;
const getTableData = (state, action) => state;

export const sortSelector = createSelector(
    [getSortKey, getSortOrder, getSortType, getTableData],
    (sortKey, sortOrder, sortType, state) => {
        return state.sort((a, b) => {
            switch (sortType) {
                case 'number':
                    return sortOrder === 'asc' ? a.get(sortKey) - b.get(sortKey) : b.get(sortKey) - a.get(sortKey); //Number
                case 'string':
                    return sortOrder === 'asc' ? a.get(sortKey).toString().localeCompare(b.get(sortKey)) : b.get(sortKey).toString().localeCompare(a.get(sortKey)); //String
                default:
                    return sortOrder === 'asc' ? a.get(sortKey).toString().localeCompare(b.get(sortKey)) : b.get(sortKey).toString().localeCompare(a.get(sortKey)); //String
            }
        });
    }
);