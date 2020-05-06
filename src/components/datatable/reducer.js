import { data } from '../../data';
import * as actionTypes from './actionType';
import { fromJS, Map } from 'immutable';
import { dataIndex } from '../../dataIndex';

const $$data = fromJS(data);

let itemId = 5;

export const reducer = (state = $$data, action) => {
    switch (action.type) {
        case actionTypes.DATATABLE_UPDATE:
            const {
                index,
                key,
                value,
            } = action.payload;
            return state.setIn([index, key], value);

        case actionTypes.DATATABLE_DELETE:
            const {
                ids
            } = action.payload;
            return state.filter(item => {
                const result = !ids.includes(item.get('id'));
                return result;
            });

        case actionTypes.DATATABLE_SORT:
            const {
                sortKey,
                sortOrder,
            } = action.payload;

            const sortResult = state.sort((a, b) => {
                // return sortOrder === 'asc' ? a.get(sortKey) - b.get(sortKey) : b.get(sortKey) - a.get(sortKey); //Number
                return sortOrder === 'asc' ? a.get(sortKey).toString().localeCompare(b.get(sortKey)) : b.get(sortKey).toString().localeCompare(a.get(sortKey)); //String
            });
            // console.log(sortResult.toJS());
            return sortResult;

        case actionTypes.DATATABLE_ADD:
            const newItem = {};
            Object.keys(dataIndex).forEach(key => {
                newItem[key] = ' ';
            });
            newItem['id'] = itemId++;
            return state.push(fromJS(newItem));

        default:
            return state;
    }
}