I18N Data Table Project
====

- Requirement
  - Cell phone column can be edited when double clicked
  - Clicking the column labe would sort the column alphabatically
  - When the selector of the first column and the first row is checked, all rows are selected
  - Clicking the Delete button will delete the selected rows
  - Update will cause the Ajax invocation to update the modified rows.  For now just pop up a alert panel showing the rows you are to update
  - Add will add an empty row to fill in the data except the ID, which will be filled after updating
  - Think of how to localize this

- Todo List
  - [x] Find the some UI example.
  - [x] Design infrastructure.
  - [x] Develop base components.
  - [x] Develop the simple version.
  - [x] Implement the i18n support.

- Technology stack
  - React
  - Redux
  - react-redux
  - immutable
  - react-intl

- Preview
  - [Prview it online.](https://datatable-i18n-2.now.sh/)

- Reference
  - [formatjs](https://github.com/formatjs/formatjs)
  - [react-intl API](https://formatjs.io/docs/react-intl/components)
