'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Description = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Description = exports.Description = function Description(_ref) {
    var toolbarRenderer = _ref.toolbarRenderer;
    var pageIndex = _ref.pageIndex;
    var pageSize = _ref.pageSize;
    var total = _ref.total;
    var currentRecords = _ref.currentRecords;
    var recordType = _ref.recordType;


    return _react2.default.createElement(
        'span',
        null,
        toolbarRenderer(pageIndex, pageSize, total, currentRecords, recordType)
    );
};

Description.propTypes = {
    toolbarRenderer: _react.PropTypes.func
};

Description.defaultProps = {
    toolbarRenderer: function toolbarRenderer(pageIndex, pageSize, total, currentRecords, recordType) {
        if (!currentRecords) {
            return 'No ' + recordType + ' Available';
        }

        var firstIndex = pageIndex * pageSize + 1;

        return firstIndex + '\n            through ' + (pageIndex * pageSize + currentRecords) + '\n            of ' + total + ' ' + recordType + ' Displayed';
    }
};