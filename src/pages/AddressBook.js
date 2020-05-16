import React from 'react'
import { EditableDataTable } from '../components/datatable';
import { injectIntl } from 'react-intl';

export const AddressBook = injectIntl((props) => {

    return (
        <>
            <EditableDataTable checkbox striped fixColumnWidth={['5%', '20%', '18%', '15%', '20%', '20%']}  {...props} />
        </>
    )
});