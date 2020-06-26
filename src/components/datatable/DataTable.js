import React, { useRef, useEffect, useCallback } from 'react';
import { connect, useDispatch } from 'react-redux';
import { CLASS_PREFIX } from '../../common/js/constant';
import './datatable.scss';
import { Button } from '../button';
import { Input } from '../input';
import { TriangleArrow } from '../icons';
import tinygradient from 'tinygradient';
import {
	useSortHook,
	useSelectHook,
	useUpdateHook,
	useAddHook,
	usePageNavi,
} from './customHooks';
import { fetchData } from "./action";
import { LoadingBar } from '../../components/loading/LoadingBar';
import { changeLanguage, LOCALES, translate } from '../../i18n';

const mapStateToProps = (state) => {
	return {
		$$table: state.$$table.get('$$data'),
		locale: state.locale,
		isLoading: state.$$table.get('isLoading'),
	};
};

export const EditableDataTable = connect(mapStateToProps)((props) => {
	const { $$table, checkbox, striped, fixColumnWidth, intl, locale, isLoading } = props;

	const dataTableWrapperRef = useRef();
	const tbodyDOMRef = useRef();
	const thCheckboxRef = useRef();
	const maxBodyHeight = useRef('none');
	const indexNames = useRef([]);
	const dispatch = useDispatch();
	const tableData = $$table.toJS();
	const tableDateLength = tableData.length;
	const stableDispatch = useCallback(dispatch, []);

	if (tableData.length > 0) indexNames.current = Object.keys(tableData[0]);

	const [$$sortData, handleSort] = useSortHook(stableDispatch);
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

	const [newId, setNewId, handleAdd] = useAddHook();

	const handleAddButtonClick = () => {
		setNewId((newId) => ++newId);
		handleAdd();
	};

	const [
		scrollBarWidth,
		calculateScrollBarWidth,
		setScrollWidth,
	] = usePageNavi();

	const stableScrollBarWidth = useCallback(calculateScrollBarWidth, []);

	let sortItemBgColorArr = [];
	if (tableData.length > 1) {
		const gradient = tinygradient('#e2f1ff', '#6fbaff');
		sortItemBgColorArr = gradient
			.rgb(tableData.length)
			.map((tinyColor) => tinyColor.setAlpha(0.75).toRgbString());
		if ($$sortData.get('sortOrder') === 'desc')
			sortItemBgColorArr.reverse();
	}

	const thClass = (keyName) => {
		const classList = [];
		if (keyName === $$sortData.get('sortKey')) {
			classList.push('sort');
			classList.push($$sortData.get('sortOrder'));
		}
		if (isEditable || $$selectColumnIds.size > 0)
			classList.push('disabled');
		return classList.join(' ');
	};

	const trClass = (rowItem, rowIndex) => {
		const classList = [];
		if ($$selectColumnIds.has(rowItem.id)) classList.push('selected');
		return classList.join(' ');
	};

	const tdClass = (keyName, rowItem) => {
		const classList = [];
		if (keyName === $$sortData.get('sortKey')) classList.push('sort');
		if (
			isEditable &&
			$$updateItem.get('updateItemId') === rowItem.id &&
			keyName === $$updateItem.get('editColumnKey')
		)
			classList.push('editable');
		// if ($$editItem.get('editItemId') === rowItem.id && keyName === $$editItem.get('editColumnKey')) classList.push('selected');
		return classList.join(' ');
	};

	useEffect(() => {
		stableDispatch(fetchData());
		const tableWrapperDOM = dataTableWrapperRef.current;
		const tableWrapperTop = tableWrapperDOM.getBoundingClientRect().top;
		const tbodyDOM = tbodyDOMRef.current;
		stableScrollBarWidth(tbodyDOM);
		const tbodyTop = tbodyDOM.getBoundingClientRect().top;
		const tbodyTrHeight = tableWrapperDOM.querySelector('table tbody tr')
			.offsetHeight;
		// console.log('layout data:', {
		//     tableWrapperTop,
		//     tbodyTop,
		//     tbodyTrHeight,
		// });
		console.log('tbodyTrHeight', tbodyTrHeight);
		if (tbodyTrHeight) {
			maxBodyHeight.current =
				Math.round(
					(window.innerHeight - tableWrapperTop * 2 - tbodyTop) /
						tbodyTrHeight
				) * tbodyTrHeight;
		}
	}, []);

	useEffect(() => {
		const tbodyDOM = tbodyDOMRef.current;
		stableScrollBarWidth(tbodyDOM);
	}, [$$table, stableScrollBarWidth]);

	useEffect(() => {
		const tbodyDOM = tbodyDOMRef.current;

		tbodyDOM.scrollTo(0, tbodyDOM.scrollHeight);
	}, [newId]);

	useEffect(() => {
		thCheckboxRef.current.indeterminate =
			$$selectColumnIds.size > 0 &&
			$$selectColumnIds.size < tableDateLength;
	}, [$$selectColumnIds, tableDateLength]);

	return (
		<div
			className={`${CLASS_PREFIX}table-wrapper`}
			ref={dataTableWrapperRef}
		>
			<div className="table-toolbar">
				<div className="table-action">
					<Button
						type="primary"
						round={true}
						onClick={handleAddButtonClick}
						disabled={
							$$selectColumnIds.size > 0 ||
							$$updateItem.size > 0 ||
							$$editItem.size > 0
						}
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
					<Button
						type="danger"
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
						type={
							LOCALES.ENGLISH === locale ? 'primary' : 'default'
						}
						size="small"
						onClick={() => {
							dispatch(changeLanguage(LOCALES.ENGLISH));
						}}
					>
						English
					</Button>
					<Button
						type={
							LOCALES.CHINESE === locale ? 'primary' : 'default'
						}
						size="small"
						onClick={() => {
							dispatch(changeLanguage(LOCALES.CHINESE));
						}}
					>
						中 文
					</Button>
				</div>
			</div>
			<table className={striped ? 'striped' : ''}>
				<thead>
					<tr>
						{checkbox && (
							<th>
								<input
									type="checkbox"
									ref={thCheckboxRef}
									disabled={isEditable}
									checked={isSelecteAll}
									readOnly
									onChange={hanldeSelectAll}
								/>
							</th>
						)}
						{indexNames.current &&
							indexNames.current.map((indexKey, index) => (
								<th
									width={
										fixColumnWidth[index]
											? fixColumnWidth[index]
											: 'auto'
									}
									key={indexKey}
									className={thClass(indexKey)}
									onClick={handleSort.bind(this, {
										sortType:
											indexKey === 'id'
												? 'number'
												: 'string',
										sortKey: indexKey,
									})}
								>
									{translate(indexKey)}
									{indexKey === $$sortData.get('sortKey') ? (
										<TriangleArrow size={12} />
									) : (
										''
									)}
								</th>
							))}
						<th
							style={{
								paddingLeft: `${scrollBarWidth}px`,
							}}
						></th>
					</tr>
				</thead>
				<tbody
					style={{
						maxHeight: `${maxBodyHeight.current}px`,
						display: $$table.size === 0 ? 'table' : 'block',
					}}
					ref={tbodyDOMRef}
				>
					{tableData.length > 0 ? (
						<>
							{tableData.map((rowItem, rowIndex) => (
								<tr
									key={rowItem.id}
									className={trClass(rowItem, rowIndex)}
								>
									{checkbox && (
										<td>
											<input
												type="checkbox"
												disabled={isEditable}
												id={rowItem.id}
												onChange={handleSelect}
												checked={$$selectColumnIds.has(
													rowItem.id
												)}
											/>
										</td>
									)}
									{Object.entries(rowItem).map(
										(item, index) => (
											<td
												key={item[0]}
												width={
													fixColumnWidth[index]
														? fixColumnWidth[index]
														: 'auto'
												}
												className={tdClass(
													item[0],
													rowItem
												)}
												style={
													item[0] ===
														$$sortData.get(
															'sortKey'
														) &&
													sortItemBgColorArr.length >
														0
														? {
																backgroundColor:
																	sortItemBgColorArr[
																		rowIndex
																	],
														}
														: {}
												}
											>
												{item[0] === 'id' ? (
													item[1]
												) : (
													<Input
														val={item[1]}
														selected={
															$$editItem.get(
																'updateItemId'
															) === rowItem.id &&
															item[0] ===
																$$editItem.get(
																	'editColumnKey'
																)
														}
														isInput={
															$$updateItem.get(
																'updateItemId'
															) === rowItem.id &&
															$$updateItem.get(
																'editColumnKey'
															) === item[0]
														}
														onPlaceholderDoubleClick={handleInputDoubleClick.bind(
															this,
															{
																updateItemId:
																	rowItem.id,
																updateItemIndex: rowIndex,
																editColumnKey:
																	item[0],
																originalValue:
																	item[1],
															}
														)}
														// onPlaceholderMouseout={handleEditItemMouseout}
														onPlaceholderClick={handlePlaceholderClick.bind(
															this,
															{
																updateItemId:
																	rowItem.id,
																updateItemIndex: rowIndex,
																editColumnKey:
																	item[0],
																originalValue:
																	item[1],
															}
														)}
														onPlaceHolderBlur={
															handlePlaceHolderBlur
														}
														onValueChange={
															handleInputValueChange
														}
														onInputBlur={
															handleInputBlur
														}
														onInputFocus={
															handleInputFocus
														}
														onEnterPress={
															handleSaveUpdate
														}
													/>
												)}
											</td>
										)
									)}
								</tr>
							))}
						</>
					) : (
						<>
							<tr>
								<td colSpan="7" className="empty-data">
									{isLoading ? '' : translate('noData')}
								</td>
							</tr>
						</>
					)}
				</tbody>
			</table>
			<div className={`loading-mask ${isLoading ? 'loading' : ''}`}>
				<LoadingBar/>
			</div>
		</div>
	);
});
