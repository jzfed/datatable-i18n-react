import { data } from '../../data';
import * as actionTypes from './actionType';
import { fromJS } from 'immutable';
import { dataIndex } from '../../dataIndex';
import { sortSelector } from './selector';

const $$data = fromJS(data);

let itemId = $$data.size;

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
            // const {
            //     sortKey,
            //     sortOrder,
            //     sortType,
            // } = action.payload;

            // const sortResult = state.sort((a, b) => {
            //     switch (sortType) {
            //         case 'number':
            //             return sortOrder === 'asc' ? a.get(sortKey) - b.get(sortKey) : b.get(sortKey) - a.get(sortKey); //Number
            //         case 'string':
            //             return sortOrder === 'asc' ? a.get(sortKey).toString().localeCompare(b.get(sortKey)) : b.get(sortKey).toString().localeCompare(a.get(sortKey)); //String
            //         default:
            //             return sortOrder === 'asc' ? a.get(sortKey).toString().localeCompare(b.get(sortKey)) : b.get(sortKey).toString().localeCompare(a.get(sortKey)); //String
            //     }
            // });
            // // console.log(sortResult.toJS());
            // return sortResult;
            return sortSelector(state, action);

        case actionTypes.DATATABLE_ADD:
            const newItem = {};
            Object.entries(dataIndex).forEach(([key, val]) => {
                newItem[key] = val.toLowerCase();
            });
            newItem['id'] = ++itemId;
            return state.push(fromJS(newItem));

        default:
            return state;
    }
}