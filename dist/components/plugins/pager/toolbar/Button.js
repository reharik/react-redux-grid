'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isButtonDisabled = exports.handleButtonClick = exports.Button = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _prefix = require('./../../../../util/prefix');

var _GridConstants = require('./../../../../constants/GridConstants');

var _PagerActions = require('./../../../../actions/plugins/pager/PagerActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Button = exports.Button = function Button(_ref) {
    var BUTTON_TYPES = _ref.BUTTON_TYPES;
    var type = _ref.type;
    var pageIndex = _ref.pageIndex;
    var pageSize = _ref.pageSize;
    var plugins = _ref.plugins;
    var currentRecords = _ref.currentRecords;
    var total = _ref.total;
    var dataSource = _ref.dataSource;
    var backButtonText = _ref.backButtonText;
    var nextButtonText = _ref.nextButtonText;
    var stateKey = _ref.stateKey;
    var store = _ref.store;


    var buttonProps = {
        onClick: handleButtonClick.bind(undefined, type, pageIndex, pageSize, dataSource, BUTTON_TYPES, plugins, stateKey, store),
        children: type === BUTTON_TYPES.NEXT ? nextButtonText : backButtonText,
        disabled: isButtonDisabled(type, pageIndex, pageSize, currentRecords, total, BUTTON_TYPES),
        className: (0, _prefix.prefix)(_GridConstants.CLASS_NAMES.BUTTONS.PAGER, type.toLowerCase())
    };

    return _react2.default.createElement('button', buttonProps);
};

var handleButtonClick = exports.handleButtonClick = function handleButtonClick(type, pageIndex, pageSize, dataSource, BUTTON_TYPES, plugins, stateKey, store) {

    var PAGER = plugins.PAGER;

    if (PAGER.pagingType === 'local') {
        store.dispatch((0, _PagerActions.setPage)({ index: pageIndex, type: type, BUTTON_TYPES: BUTTON_TYPES, stateKey: stateKey }));
    } else if (PAGER.pagingType === 'remote' && dataSource) {
        store.dispatch((0, _PagerActions.setPageAsync)({ index: pageIndex, pageSize: pageSize, type: type, BUTTON_TYPES: BUTTON_TYPES, dataSource: dataSource, stateKey: stateKey }));
    } else {
        console.warn('Please configure paging plugin pagingType to local if no pagingSource is provided');
    }
};

var isButtonDisabled = exports.isButtonDisabled = function isButtonDisabled(type, pageIndex, pageSize, currentRecords, total, BUTTON_TYPES) {

    if (type === BUTTON_TYPES.BACK) {
        return pageIndex === 0;
    } else if (type === BUTTON_TYPES.NEXT) {
        return currentRecords < pageSize || pageIndex * pageSize + currentRecords === total;
    }
};

Button.propTypes = {
    BUTTON_TYPES: _react.PropTypes.object,
    backButtonText: _react.PropTypes.string,
    currentRecords: _react.PropTypes.number,
    dataSource: _react.PropTypes.any,
    nextButtonText: _react.PropTypes.string,
    pageIndex: _react.PropTypes.number,
    pageSize: _react.PropTypes.number,
    plugins: _react.PropTypes.object,
    store: _react.PropTypes.object,
    total: _react.PropTypes.number,
    type: _react.PropTypes.string
};

Button.defaultProps = {
    BUTTON_TYPES: {
        NEXT: 'NEXT',
        BACK: 'BACK'
    },
    nextButtonText: 'Next',
    backButtonText: 'Back'
};