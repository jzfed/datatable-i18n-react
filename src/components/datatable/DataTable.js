import React, { useRef, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { CLASS_PREFIX } from '../../common/js/constant';
import './datatable.scss';
import { Button } from '../button';
import { Input } from '../input';
import { TriangleArrow } from '../icons';
import tinygradient from 'tinygradient';
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

    const thCheckboxRef = useRef();
    const dispatch = useDispatch();
    const tableData = $$table.toJS();
    const [$$sortData, handleSort] = useSortHook();
    const [
        isSelecteAll,
        $$selectColumnIds,
        handleSelect,
        hanldeSelectAll,
        handleDelete,
    ] = useSelectHook(tableData, intl);

    // const [
    //     $$editItem,
    //     handleEditItemMouseout,
    //     handlePlaceholderClick,
    // ] = useEditItemHook();

    const [
        $$editItem,
        $$updateItem,
        isEditable,
        handleEditClick,
        handlePlaceholderClick,
        handleInputDoubleClick,
        handleInputValueChange,
        handleInputBlur,
        handleInputFocus,
        handleSaveUpdate,
        handlePlaceHolderBlur,
    ] = useUpdateHook(intl);
    const [handleAdd] = useAddHook();

    let sortItemBgColorArr = [];
    if (tableData.length > 1) {
        const gradient = tinygradient('#e2f1ff', '#6fbaff');
        sortItemBgColorArr = gradient.rgb(tableData.length).map(tinyColor => tinyColor.toHexString());
        if ($$sortData.get('sortOrder') === 'desc') sortItemBgColorArr.reverse();
    }

    const thClass = (keyName) => {
        const classList = [];
        if (keyName === $$sortData.get('sortKey')) {
            classList.push('sort');
            classList.push($$sortData.get('sortOrder'));
        }
        if (isEditable || $$selectColumnIds.size > 0) classList.push('disabled');
        return classList.join(' ');
    }

    const trClass = (rowItem, rowIndex) => {
        const classList = [];
        if ($$selectColumnIds.has(rowItem.id)) classList.push('selected');
        return classList.join(' ');
    };

    const tdClass = (keyName, rowItem) => {
        const classList = [];
        if (keyName === $$sortData.get('sortKey')) classList.push('sort');
        if (isEditable && $$updateItem.get('updateItemId') === rowItem.id && keyName === $$updateItem.get('editColumnKey')) classList.push('editable');
        // if ($$editItem.get('editItemId') === rowItem.id && keyName === $$editItem.get('editColumnKey')) classList.push('selected');
        return classList.join(' ');
    };

    useEffect(() => {
        thCheckboxRef.current.indeterminate = $$selectColumnIds.size > 0 && $$selectColumnIds.size < tableData.length;
    }, [$$selectColumnIds, tableData])

    return (
        <div className={`${CLASS_PREFIX}table-wrapper`}>
            <div className="table-toolbar">
                <div className="table-action">
                    <Button
                        type="primary"
                        round={true}
                        onClick={handleAdd}
                        disabled={$$selectColumnIds.size > 0 || $$updateItem.size > 0 || $$editItem.size > 0}
                    >
                        {translate('add')}
                    </Button>
                    <Button
                        disabled={$$editItem.size === 0 || isEditable}
                        round={true}
                        type="primary"
                        highlight={$$editItem.size > 0}
                        onMouseDown={handleEditClick}
                    >
                        {translate('edit')}
                    </Button>
                    <Button
                        disabled={!isEditable}
                        round={true}
                        type="primary"
                        highlight={isEditable}
                        onMouseDown={handleSaveUpdate}
                    >
                        {translate('update')}
                    </Button>
                    <Button type="danger"
                        round={true}
                        disabled={$$selectColumnIds.size === 0 || isEditable}
                        highlight={$$selectColumnIds.size > 0}
                        onClick={handleDelete}
                    >
                        {translate('delete')}
                    </Button>
                </div>

                <div className="language-switcher">
                    <Button
                        type={LOCALES.ENGLISH === locale ? 'primary' : 'default'}
                        size="small"
                        onClick={() => { dispatch(changeLanguage(LOCALES.ENGLISH)); }}
                    >
                        English
                </Button>
                    <Button
                        type={LOCALES.CHINESE === locale ? 'primary' : 'default'}
                        size="small"
                        onClick={() => { dispatch(changeLanguage(LOCALES.CHINESE)); }}
                    >
                        中 文
                </Button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        {
                            checkbox && <th width="2%"><input type="checkbox" ref={thCheckboxRef} disabled={isEditable} checked={isSelecteAll} readOnly onChange={hanldeSelectAll} /></th>
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
                                                    className={tdClass(item[0], rowItem)}
                                                    style={item[0] === $$sortData.get('sortKey') && sortItemBgColorArr.length > 0 ? { backgroundColor: sortItemBgColorArr[rowIndex] } : {}}
                                                >
                                                    {
                                                        item[0] === 'id' ? item[1] :
                                                            <Input
                                                                val={item[1]}
                                                                selected={$$editItem.get('updateItemId') === rowItem.id && item[0] === $$editItem.get('editColumnKey')}
                                                                isInput={$$updateItem.get('updateItemId') === rowItem.id && $$updateItem.get('editColumnKey') === item[0]}
                                                                onPlaceholderDoubleClick={
                                                                    handleInputDoubleClick.bind(this,
                                                                        {
                                                                            updateItemId: rowItem.id,
                                                                            updateItemIndex: rowIndex,
                                                                            editColumnKey: item[0],
                                                                            originalValue: item[1],
                                                                        },
                                                                    )
                                                                }
                                                                // onPlaceholderMouseout={handleEditItemMouseout}
                                                                onPlaceholderClick={
                                                                    handlePlaceholderClick.bind(this,
                                                                        {
                                                                            updateItemId: rowItem.id,
                                                                            updateItemIndex: rowIndex,
                                                                            editColumnKey: item[0],
                                                                            originalValue: item[1],
                                                                        },
                                                                    )
                                                                }
                                                                onPlaceHolderBlur={handlePlaceHolderBlur}
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

        </div>
    );
});