import React, { useState, useEffect, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import './datatable.scss';
import { Button } from '../button';
import { Input } from '../input';
import { TriangleArrow } from '../icons';
import { add, update, del, sort } from './action';
import { injectIntl } from 'react-intl';
import { changeLanguage, LOCALES, translate } from '../../i18n';
import { Set, Map } from 'immutable';

const mapStateToProps = (state) => {
    return {
        $$table: state.$$table,
        locale: state.locale,
    }
}

export const DataTable = connect(mapStateToProps)(injectIntl((props) => {
    const {
        $$table,
        checkbox,
        indexNames,
        fixColumnWidth,
        defaultSortKey,
        defaultSortOrder,
        intl,
        locale,
    } = props;

    // console.dir($$table);
    const tableData = $$table.toJS();
    const [selecteAll, setSelectAll] = useState(false);
    const [$$selectColumnIds, setSelect] = useState(Set());
    const [$$sortData, setSort] = useState(Map());
    const [$$updateItem, setUpdateItem] = useState(Map());

    const dispatch = useDispatch();
    const stableDispatch = useCallback(dispatch, []);

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

    const handleInputDoubleClick = (editItemInfo) => {
        if ($$updateItem.size > 0) {
            setUpdateItem($$updateItem.merge(Map(editItemInfo)));
            return;
        }
        setUpdateItem($$updateItem.merge(Map(editItemInfo)));
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
        const index = $$updateItem.get('editItemIndex');
        const key = $$updateItem.get('editColumnKey');
        const id = $$updateItem.get('editItemId');
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

    const handleDelete = (e) => {
        dispatch(del({ ids: $$selectColumnIds.toJS() }));
        setSelectAll(false);
        setSelect($$selectColumnIds.clear());
        console.log($$selectColumnIds.toJS())
    }

    useEffect(() => {
        console.log('Component did mount.');
        return () => {
            console.log('Component will ummount.');
        }
    }, []);

    useEffect(() => {
        console.log('$$sortData changed.');
        if ($$sortData.get('sortKey') && $$sortData.get('sortOrder') && $$sortData.get('sortType')) {
            stableDispatch(sort($$sortData.toObject()));
        }
        console.log('sortKey', $$sortData.get('sortKey'));
        console.log('sortOrder', $$sortData.get('sortOrder'));
        console.log('sortType', $$sortData.get('sortType'));

    }, [$$sortData, stableDispatch]);

    //Interaction status
    const isEditable = $$updateItem.size > 0 && $$updateItem.get('value') && $$updateItem.get('originalValue') !== $$updateItem.get('value');

    const thClass = (keyName) => {
        const classList = [];
        if (keyName === $$sortData.get('sortKey')) {
            classList.push('sort');
            classList.push($$sortData.get('sortOrder'));
        }
        if (isEditable) classList.push('disabled');
        return classList.join(' ');
    }

    const trClass = (rowItem, rowIndex) => {
        const classList = [];
        if ($$selectColumnIds.has(rowItem.id)) classList.push('selected');
        if (isEditable && $$updateItem.get('editItemId') === rowItem.id) classList.push('editable');
        // if (isEditable && $$updateItem.get('editItemId') === rowItem.id && $$updateItem.get('warning')) classList.push('warning');
        return classList.join(' ');
        // return $$selectColumnIds.has(rowItem.id) ? 'selected' : '' +  ? ' editable' : '' +  ? ' warning' : '';
    };

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        {
                            checkbox && <th width="2%"><input type="checkbox" disabled={isEditable} checked={selecteAll} readOnly onChange={hanldeSelectAll} /></th>
                        }
                        {
                            indexNames && Object.entries(indexNames).map((item, index) =>
                                <th
                                    width={fixColumnWidth[index] ? fixColumnWidth[index] : 'auto'}
                                    key={item[0]}
                                    className={thClass(item[0])}
                                    onClick={handleSort.bind(this, {
                                        sortType: (item[0] === 'id' ? 'number' : 'string'),
                                        sortKey: item[0],
                                    })}
                                >
                                    {translate(item[0])}
                                    {item[0] === $$sortData.get('sortKey') ? <TriangleArrow size={12} /> : ''}
                                </th>
                            )
                        }
                    </tr>
                </thead>
                {
                    tableData.length > 0
                        ?
                        <tbody>
                            {
                                tableData.map((rowItem, rowIndex) =>
                                    <tr key={rowItem.id}
                                        className={trClass(rowItem, rowIndex)}
                                    >
                                        {
                                            checkbox && <td><input type="checkbox" disabled={isEditable} id={rowItem.id} onChange={handleSelect} checked={$$selectColumnIds.has(rowItem.id)} /></td>
                                        }
                                        {
                                            Object.entries(rowItem).map(item =>
                                                <td
                                                    key={item[0]}
                                                    className={item[0] === $$sortData.get('sortKey') ? `sort` : ''}
                                                >
                                                    {
                                                        item[0] === 'id' ? item[1] :
                                                            <Input
                                                                val={item[1]}
                                                                isInput={$$updateItem.get('editItemId') === rowItem.id && $$updateItem.get('editColumnKey') === item[0]}
                                                                onPlaceholderDoubleClick={
                                                                    handleInputDoubleClick.bind(this,
                                                                        {
                                                                            editItemId: rowItem.id,
                                                                            editItemIndex: rowIndex,
                                                                            editColumnKey: item[0],
                                                                            originalValue: item[1],
                                                                        },
                                                                    )
                                                                }
                                                                onValueChange={handleInputValueChange}
                                                                onInputBlur={handleInputBlur}
                                                                onInputFocus={handleInputFocus}
                                                                onEnterPress={handleSaveUpdate}
                                                            />
                                                    }
                                                </td>
                                            )
                                        }
                                    </tr>
                                )
                            }
                        </tbody>
                        :
                        <tbody>
                            <tr>
                                <td colSpan="7" className="empty-data">
                                    {translate('noData')}
                                </td>
                            </tr>
                        </tbody>
                }

            </table>
            <div className="table-footer">
                <Button type="danger"
                    disabled={$$selectColumnIds.size === 0 || isEditable}
                    onClick={handleDelete}
                >
                    {translate('delete')}
                </Button>
                <Button
                    type="primary"
                    onClick={() => { dispatch(add()); }}
                    disabled={$$selectColumnIds.size > 0 || isEditable}
                >
                    {translate('add')}
                </Button>
                <Button
                    disabled={!isEditable}
                    type="primary"
                    onClick={handleSaveUpdate}
                >
                    {translate('update')}
                </Button>
                <Button
                    type={LOCALES.ENGLISH === locale ? 'primary' : 'default'}
                    onClick={() => { dispatch(changeLanguage(LOCALES.ENGLISH)); }}
                >
                    English
                </Button>
                <Button
                    type={LOCALES.CHINESE === locale ? 'primary' : 'default'}
                    onClick={() => { dispatch(changeLanguage(LOCALES.CHINESE)); }}
                >
                    中文
                </Button>
            </div>
        </div>
    );
}));