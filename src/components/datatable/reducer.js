// import { data } from '../../data';
import * as actionTypes from './actionType';
import { fromJS, Map } from 'immutable';
import { dataIndex } from '../../data/dataIndex';
import { sortSelector } from './selector';

// const $$data = fromJS(data);

// let itemId = 0;

export const reducer = (state = fromJS({$$data: [], isLoading: false}), action) => {

    switch (action.type) {
        
        case actionTypes.DATATABLE_FETCH_STARTED: 
            return state.setIn(['isLoading'], true);

        case actionTypes.DATATABLE_FETCH_ERROR: 
        return state.setIn(['isLoading'], false);

        case actionTypes.DATATABLE_FETCH_SUCCESS:
            return state.setIn(['isLoading'], false).updateIn(['$$data'], list => list.concat(action.result));

        case actionTypes.DATATABLE_UPDATE:
            const {
                index,
                key,
                value,
            } = action.payload;
            return state.setIn(['$$data', index, key], value);

        case actionTypes.DATATABLE_DELETE:
            const {
                ids
            } = action.payload;
            return state.updateIn(['$$data'], list => list.filter(item => {
                const result = !ids.includes(item['id']);
                return result;
            })); 

        case actionTypes.DATATABLE_SORT:
            // const {
            //     sortKey,
            //     sortOrder,
            //     sortType,
            // } = action.payload;

            // const sortResult = $$data.sort((a, b) => {
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
            newItem['id'] = state.get('$$data').maxBy(item => item.id)['id'] + 1;
            return state.updateIn(['$$data'], list =>  list.concat([newItem]));;

        default:
            return state;
    }
}