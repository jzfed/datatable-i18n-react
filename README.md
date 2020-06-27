# I18N Data Table Project(React version)

#### Requirement

---

- Cell phone column can be edited when double clicked
- Clicking the column labe would sort the column alphabatically
- When the selector of the first column and the first row is checked, all rows are selected
- Clicking the Delete button will delete the selected rows
- Update will cause the Ajax invocation to update the modified rows. For now just pop up a alert panel showing the rows you are to update
- Add will add an empty row to fill in the data except the ID, which will be filled after updating
- Think of how to localize this

#### Todo List

---

- [x] Find the some UI example.
- [x] Design infrastructure.
- [x] Develop base components.
- [x] Develop the simple version.
- [x] Implement the i18n support.
- [x] Optimize the logic of data update.
- [x] Code refactoring.
- [x] Add intermediate checkbox state.
- [x] Optimize the logic of sort data.
- [x] Code splitting to improve the first print time performance.
- [x] Remove source map in production mode.
- [x] Add a loading state to button component.
- [x] Add a loading state to datatable component.
- [x] Adaptive scrollbar for table content.
- [x] Load data from JSON API server.
- [ ] Refactor the selector code.
- [ ] Add a dialog component for adding data logic.
- [ ] Optimize the logic of adding new data.

#### Technology stack

---

- React
- Redux
- react-redux
- redux-thunk
- immutable
- react-intl
- OpenAPI 3.0

#### Interaction Logic

---

![AddressBookUpdateInteraction](https://raw.githubusercontent.com/jzfed/datatable-i18n/master/docs/AddressBookUpdateInteraction.png)

#### Preview

---

- [Prview it online.](https://datatable-i18n-2.now.sh/)

#### Reference

---

- [formatjs](https://github.com/formatjs/formatjs)
- [react-intl API](https://formatjs.io/docs/react-intl/components)
