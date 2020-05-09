import React from 'react'

import { EditableDataTable } from '../components/datatable';
import { dataIndex } from '../dataIndex';

import { injectIntl } from 'react-intl';

export const AddressBook = injectIntl((props) => {

    return (
        <>
            <EditableDataTable indexNames={dataIndex} checkbox fixColumnWidth={['5%', '20%', '18%', '15%', '20%', '20%']}  {...props} />
        </>
    )
});