import React, { useState, useEffect, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import './datatable.scss';
import { Button } from '../button';
import { Input } from '../input';
import { TriangleArrow } from '../icons';
import { add, update, del, sort } from './action';
import { injectIntl } from 'react-intl';
import { changeLanguage, LOCALES, translate } from '../../i18n';
import { Set, List } from 'immutable';

const mapStateToProps = (state) => {
    return {
        $$table: state.$$table
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
    } = props;

    // console.dir($$table);
    const tableData = $$table.toJS();
    const [selecteAll, setSelectAll] = useState(false);
    const [$$selectColumnIds, setSelect] = useState(new Set());
    const [sortKey, setSortKey] = useState(defaultSortKey);
    const [sortOrder, setSortOrder] = useState(defaultSortOrder);
    // const [$$updateItem, setUpdateItem] = useState(new List());
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
    }

    const handleSort = (e) => {
        const th = e.currentTarget;
        setSortKey(th.id);
        sortOrder ? sortOrder === 'asc' ? setSortOrder('desc') : setSortOrder('asc') : setSortOrder('asc');
        console.log('sortKey', sortKey);
        console.log('sortOrder', sortOrder);
    }

    const handleUpdate = (index, key, id) => {
        return (value) => {
            let doUpdate = window.confirm(intl.formatMessage({ id: 'updateConfirm' }, { id: id, key: key, value: value }));
            if (doUpdate) {
                dispatch(update({
                    index,
                    key,
                    id,
                    value,
                }));
                return true;
            } else {
                return false;
            }
        }
    };

    const handleDelete = (e) => {
        dispatch(del({ ids: $$selectColumnIds.toJS() }));
        setSelectAll(false);
        setSelect($$selectColumnIds.clear());
        console.log($$selectColumnIds.toJS())
    }

    // const handleSelectUpdateItem = (index, key) => {
    //     return () => {
    //         setUpdateItem($$updateItem.clear().concat([index, key]));
    //         console.log($$updateItem);
    //     }
    // }

    useEffect(() => {
        if (sortKey && sortOrder) {
            stableDispatch(sort({ sortKey, sortOrder }));
        }
    }, [sortKey, sortOrder, stableDispatch, $$selectColumnIds]);

    const TableBody = () => {
        if (tableData.length > 0) {
            return (
                <tbody>
                    {
                        tableData.map((rowItem, rowIndex) =>
                            <tr key={rowItem.id} className={$$selectColumnIds.has(rowItem.id) ? 'selected' : ''}>
                                {
                                    checkbox && <td><input type="checkbox" id={rowItem.id} onChange={handleSelect} checked={$$selectColumnIds.has(rowItem.id)} /></td>
                                }
                                {
                                    Object.entries(rowItem).map(item =>
                                        <td key={item[0]} >
                                            {
                                                item[0] === 'id' ? item[1] :
                                                    <Input
                                                        val={item[1]}
                                                        onSave={handleUpdate(rowIndex, item[0], rowItem.id)}
                                                    />
                                            }
                                        </td>
                                    )
                                }
                            </tr>
                        )
                    }
                </tbody>
            )
        } else {
            return (
                <tbody>
                    <tr>
                        <td colSpan="7" className="empty-data">
                            {translate('noData')}
                        </td>
                    </tr>
                </tbody>
            )
        }
    }

    return (
        <div className="table-wrapper">
            <table>
                <thead>
                    <tr>
                        {
                            checkbox && <th width="2%"><input type="checkbox" checked={selecteAll} readOnly onChange={hanldeSelectAll} /></th>
                        }
                        {
                            indexNames && Object.entries(indexNames).map((item, index) =>
                                <th
                                    width={fixColumnWidth[index] ? fixColumnWidth[index] : 'auto'}
                                    key={item[0]}
                                    className={item[0] === sortKey ? `sort ${sortOrder}` : ''}
                                    id={item[0]}
                                    onClick={handleSort}>
                                    {translate(item[0])}
                                    {item[0] === sortKey ? <TriangleArrow size={12} /> : ''}
                                </th>
                            )
                        }
                    </tr>
                </thead>
                <TableBody />
            </table>
            <div className="table-footer">
                <Button type="danger"
                    disabled={$$selectColumnIds.size === 0}
                    onClick={handleDelete}>
                    {translate('delete')}
                </Button>
                <Button type="primary" onClick={() => { dispatch(add()); }} disabled={$$selectColumnIds.size > 0}>{translate('add')}</Button>
                <Button disabled>{translate('update')}</Button>
                <Button onClick={() => { dispatch(changeLanguage(LOCALES.ENGLISH)); }}>English</Button>
                <Button onClick={() => { dispatch(changeLanguage(LOCALES.CHINESE)); }}>中文</Button>
            </div>
        </div>
    );
}));