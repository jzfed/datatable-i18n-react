import React from 'react';
import './App.scss';

import { store } from './store';
import { Provider } from 'react-redux';

import { AddressBook } from './pages/AddressBook';

import { I18nProvider, LOCALES } from './i18n';

function App() {
    return (
        <Provider store={store}>
            <I18nProvider locale={LOCALES.ENGLISH}>
                <div className="app">
                    <AddressBook />
                </div>
            </I18nProvider>
        </Provider>
    );
}

export default App;
