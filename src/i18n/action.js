import * as ActionTypes from './actionType';
export const changeLanguage = (locale) => {
    return {
        type: ActionTypes.I18N_CHANGE,
        locale,
    }
}