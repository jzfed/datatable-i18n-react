import React from 'react';
import { FormattedMessage } from 'react-intl';

export const translate = (id, value = {}) => <FormattedMessage id={id} values={{ ...value }} />;

export default translate;