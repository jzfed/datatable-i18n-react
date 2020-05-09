import React from 'react';
import './App.scss';
import { DataTable } from './components/datatable';
import { store } from './store';
import { Provider } from 'react-redux';
import { dataIndex } from './dataIndex';

import { I18nProvider, LOCALES } from './i18n';

function App() {
    return (
        <Provider store={store}>
            <I18nProvider locale={LOCALES.ENGLISH}>
                <div className="app">
                    <DataTable indexNames={dataIndex} checkbox fixColumnWidth={['5%', '20%', '18%', '15%', '20%', '20%']} />
                </div>
            </I18nProvider>
        </Provider>
    );
}

export default App;
