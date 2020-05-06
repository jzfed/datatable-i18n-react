import * as ActionTypes from './actionType';
import { LOCALES } from './locales';

export const reducer = (state = LOCALES.ENGLISH, action) => {
    switch (action.type) {
        case ActionTypes.I18N_CHANGE:
            return action.locale;
        default:
            return state;
    }
}