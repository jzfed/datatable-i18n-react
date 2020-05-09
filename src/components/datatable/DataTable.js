import React from 'react';
import { connect, useDispatch } from 'react-redux';
import './datatable.scss';
import { Button } from '../button';
import { Input } from '../input';
import { TriangleArrow } from '../icons';
import { useSortHook, useSelectHook, useUpdateHook, useAddHook } from './customHooks';
import { changeLanguage, LOCALES, translate } from '../../i18n';

const mapStateToProps = (state) => {
    return {
        $$table: state.$$table,
        locale: state.locale,
    }
}

export const EditableDataTable = connect(mapStateToProps)((props) => {
    const {
        $$table,
        checkbox,
        indexNames,
        fixColumnWidth,
        intl,
        locale,
    } = props;

    const dispatch = useDispatch();
    // console.dir($$table);
    const tableData = $$table.toJS();
    const [$$sortData, handleSort] = useSortHook();
    const [
        isSelecteAll,
        $$selectColumnIds,
        handleSelect,
        hanldeSelectAll,
        handleDelete
    ] = useSelectHook(tableData);
    const [
        $$updateItem,
        isEditable,
        handleInputDoubleClick,
        handleInputValueChange,
        handleInputBlur,
        handleInputFocus,
        handleSaveUpdate,
    ] = useUpdateHook(intl);
    const [handleAdd] = useAddHook();



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
                            checkbox && <th width="2%"><input type="checkbox" disabled={isEditable} checked={isSelecteAll} readOnly onChange={hanldeSelectAll} /></th>
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
                    onClick={handleAdd}
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
});