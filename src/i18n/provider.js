import React, { Fragment } from 'react'
import { IntlProvider } from 'react-intl';
import { LOCALES } from './locales';
import messages from './messages';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        locale: state.locale
    }
}

export const I18nProvider = connect(mapStateToProps)(({ children, locale }) => (
    <IntlProvider
        textComponent={Fragment}
        locale={locale}
        messages={messages[locale]}
    >
        {children}
    </IntlProvider>
));

export default I18nProvider;