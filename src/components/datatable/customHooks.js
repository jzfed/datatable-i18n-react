import { useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';
import { add, update, del, sort } from './action';
import { Set, Map } from 'immutable';


//Sort hook
export const useSortHook = () => {
    const dispatch = useDispatch();
    const [$$sortData, setSort] = useState(Map());
    const stableDispatch = useCallback(dispatch, []);

    const handleSort = ({ sortType, sortKey }, e) => {
        // const th = e.currentTarget;
        const sortObj = {
            sortType,
            sortKey,
        };
        $$sortData.get('sortOrder')
            ? $$sortData.get('sortOrder') === 'asc'
                ? sortObj.sortOrder = 'desc'
                : sortObj.sortOrder = 'asc'
            : sortObj.sortOrder = 'asc'
        // console.log(sortObj);
        setSort($$sortData.concat(Map(sortObj)));
        // console.log($$sortData.toJS());
    }


    useEffect(() => {
        console.log('$$sortData changed.');
        if ($$sortData.get('sortKey') && $$sortData.get('sortOrder') && $$sortData.get('sortType')) {
            stableDispatch(sort($$sortData.toObject()));
        }
        console.log('sortKey', $$sortData.get('sortKey'));
        console.log('sortOrder', $$sortData.get('sortOrder'));
        console.log('sortType', $$sortData.get('sortType'));

    }, [$$sortData, stableDispatch]);

    return [
        $$sortData,
        handleSort,
    ]
}

//Select hook
export const useSelectHook = (tableData, intl) => {
    const dispatch = useDispatch();
    const [isSelecteAll, setSelectAll] = useState(false);
    const [$$selectColumnIds, setSelect] = useState(Set());

    const handleSelect = (e) => {
        const checkbox = e.currentTarget;
        // console.dir(checkbox);
        const id = parseInt(checkbox.id);
        if ($$selectColumnIds.has(id)) {
            setSelect($$selectColumnIds.delete(id));
        } else {
            setSelect($$selectColumnIds.add(id));
        }

    }

    const hanldeSelectAll = (e) => {
        const checkbox = e.currentTarget;
        const isChecked = checkbox.checked;
        if (isChecked) {
            setSelect($$selectColumnIds.concat(tableData.map(item => item.id)));
            setSelectAll(true);
        } else {
            setSelect($$selectColumnIds.clear());
            setSelectAll(false);
        }
        console.log($$selectColumnIds.toJS());
    }

    const handleDelete = () => {
        const deleteItems = $$selectColumnIds.toJS()
        let doDelete = window.confirm(intl.formatMessage({ id: 'deleteConfirm' }, { itemsId: deleteItems.join(',') }));
        if (doDelete) {
            dispatch(del({ ids: deleteItems }));
            setSelectAll(false);
            setSelect($$selectColumnIds.clear());
            console.log($$selectColumnIds.toJS())
        }

    }

    return [
        isSelecteAll,
        $$selectColumnIds,
        handleSelect,
        hanldeSelectAll,
        handleDelete,
    ];
}

//Edit hook 
export const editItem = () => {

}


//Update hook 
export const useUpdateHook = (intl) => {
    const dispatch = useDispatch();
    const [$$updateItem, setUpdateItem] = useState(Map());

    //Interaction status
    const isEditable = $$updateItem.size > 0 && $$updateItem.get('value') !== undefined && $$updateItem.get('originalValue') !== $$updateItem.get('value');

    const handleInputDoubleClick = (updateItemInfo) => {
        // if ($$updateItem.size > 0) {
        //     setUpdateItem($$updateItem.merge(Map(updateItemInfo)));
        //     return;
        // }
        setUpdateItem($$updateItem.merge(Map(updateItemInfo)));
    }

    const handleInputValueChange = (value) => {
        setUpdateItem($$updateItem.merge(Map({ value })));
        // console.log(value);
    }

    const handleInputBlur = (inputDom) => {
        if (isEditable) {
            // let ignoreConfirm = window.confirm(intl.formatMessage({ id: 'ignoreUpdate' }));
            // if (ignoreConfirm) {
            //     setUpdateItem($$updateItem.clear());
            // } else {
            //     // inputDom.focus();
            // }
            inputDom.focus();
            handleSaveUpdate();
            return;
        };
        setUpdateItem($$updateItem.clear());
    }

    const handleInputFocus = () => {
        // setUpdateItem($$updateItem.merge(Map({
        //     'warning': true
        // })));
    }

    const handleSaveUpdate = () => {
        if (!isEditable) {
            return;
        }
        const index = $$updateItem.get('updateItemIndex');
        const key = $$updateItem.get('editColumnKey');
        const id = $$updateItem.get('updateItemId');
        const value = $$updateItem.get('value');;
        let doUpdate = window.confirm(intl.formatMessage({ id: 'updateConfirm' }, { id, key, value }));
        if (doUpdate) {
            dispatch(update({
                index,
                key,
                id,
                value,
            }));
        } else {

        }
        setUpdateItem($$updateItem.clear());

    }

    return [
        $$updateItem,
        isEditable,
        handleInputDoubleClick,
        handleInputValueChange,
        handleInputBlur,
        handleInputFocus,
        handleSaveUpdate,
    ];
}


export const useAddHook = () => {
    const dispatch = useDispatch();
    const handleAdd = () => {
        dispatch(add());
    }
    return [handleAdd];
}