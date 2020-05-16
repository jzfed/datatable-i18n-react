import React, { useEffect } from 'react';
import './App.scss';

import { store } from './store';
import { Provider } from 'react-redux';

import { AddressBook } from './pages/AddressBook';

import { I18nProvider, LOCALES } from './i18n';

function App() {
    useEffect(() => {
        document.querySelector('.jui-dual-ring-loading').style.display = 'none';
    }, []);
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
