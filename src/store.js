import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { reducer as tableReducer } from './components/datatable/reducer';
import { reducer as i18nReducer } from './i18n';

const middlewares = [];

const win = window;

const enhancers = compose(
    applyMiddleware(...middlewares),
    win.__REDUX_DEVTOOLS_EXTENSION__ && win.__REDUX_DEVTOOLS_EXTENSION__()
);

const reducers = combineReducers({
    $$table: tableReducer,
    locale: i18nReducer,
});

export const store = createStore(reducers, enhancers);