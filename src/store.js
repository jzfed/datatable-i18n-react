import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { reducer as tableReducer } from './components/datatable/reducer';
import { reducer as i18nReducer } from './i18n';
import thunk from 'redux-thunk';

const middlewares = [thunk];

const win = window;

const enhancers = compose(
    applyMiddleware(...middlewares),
    win.__REDUX_DEVTOOLS_EXTENSION__ ? win.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

const reducers = combineReducers({
    $$table: tableReducer,
    locale: i18nReducer,
});

export const store = createStore(reducers, enhancers);