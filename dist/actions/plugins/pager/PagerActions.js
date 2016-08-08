'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setPage = setPage;
exports.setPageIndexAsync = setPageIndexAsync;
exports.setPageAsync = setPageAsync;

var _ActionTypes = require('../../../constants/ActionTypes');

var _LoaderActions = require('../../../actions/plugins/loader/LoaderActions');

var _EditorActions = require('../../../actions/plugins/editor/EditorActions');

var _Request = require('../../../components/plugins/ajax/Request');

var _Request2 = _interopRequireDefault(_Request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setPage(_ref) {
    var index = _ref.index;
    var type = _ref.type;
    var BUTTON_TYPES = _ref.BUTTON_TYPES;


    var pageIndex = type === BUTTON_TYPES.NEXT ? index + 1 : index - 1;

    return { type: _ActionTypes.PAGE_LOCAL, pageIndex: pageIndex };
}

function setPageIndexAsync(_ref2) {
    var pageIndex = _ref2.pageIndex;
    var pageSize = _ref2.pageSize;
    var dataSource = _ref2.dataSource;
    var filterFields = _ref2.filterFields;
    var sort = _ref2.sort;
    var stateKey = _ref2.stateKey;
    var afterAsyncFunc = _ref2.afterAsyncFunc;


    if (typeof dataSource === 'function') {

        return function (dispatch) {

            dispatch((0, _EditorActions.dismissEditor)({ stateKey: stateKey }));

            dispatch((0, _LoaderActions.setLoaderState)({ state: true, stateKey: stateKey }));

            dataSource({ pageIndex: pageIndex, pageSize: pageSize }, filterFields, sort).then(function (response) {

                if (response && response.data) {

                    dispatch({
                        type: _ActionTypes.SET_DATA,
                        data: response.data,
                        total: response.total,
                        currentRecords: response.items,
                        success: true,
                        stateKey: stateKey
                    });

                    if (afterAsyncFunc && typeof afterAsyncFunc === 'function') {
                        afterAsyncFunc();
                    }
                } else {

                    if (response && !response.data) {
                        console.warn(['A response was recieved but', 'no data entry was found'].join(' '));
                        console.warn(['Please see', 'https://github.com/bencripps/react-redux-grid', 'for documentation'].join(' '));
                    }

                    dispatch({
                        type: _ActionTypes.ERROR_OCCURRED,
                        error: 'Unable to Retrieve Grid Data',
                        errorOccurred: true,
                        stateKey: stateKey
                    });
                }

                dispatch((0, _LoaderActions.setLoaderState)({ state: false, stateKey: stateKey }));
            });
        };
    }
}

function setPageAsync(_ref3) {
    var index = _ref3.index;
    var pageSize = _ref3.pageSize;
    var type = _ref3.type;
    var BUTTON_TYPES = _ref3.BUTTON_TYPES;
    var dataSource = _ref3.dataSource;
    var stateKey = _ref3.stateKey;


    var pageIndex = type === BUTTON_TYPES.NEXT ? index + 1 : index - 1;

    return function (dispatch) {

        dispatch((0, _LoaderActions.setLoaderState)({ state: true, stateKey: stateKey }));

        return _Request2.default.api({
            route: dataSource,
            method: 'POST',
            data: {
                pageIndex: pageIndex,
                pageSize: pageSize
            }
        }).then(function (response) {

            if (response && response.data) {

                dispatch({
                    type: _ActionTypes.PAGE_REMOTE,
                    pageIndex: pageIndex,
                    stateKey: stateKey
                });

                dispatch({
                    type: _ActionTypes.SET_DATA,
                    data: response.data,
                    total: response.total,
                    currentRecords: response.data,
                    success: true,
                    stateKey: stateKey
                });

                dispatch((0, _LoaderActions.setLoaderState)({ state: false, stateKey: stateKey }));
            } else {
                dispatch({
                    type: _ActionTypes.ERROR_OCCURRED,
                    error: response,
                    errorOccurred: true,
                    stateKey: stateKey
                });
            }
        });
    };
}