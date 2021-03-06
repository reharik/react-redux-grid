import React, { Component } from 'react';
import { prefix } from '../../../util/prefix';
import { emptyFn } from '../../../util/emptyFn';
import { CLASS_NAMES } from '../../../constants/GridConstants';
import { hideMenu } from '../../../actions/plugins/actioncolumn/MenuActions';

class MenuItem extends Component {

    render() {
        const {
            data,
            disabled,
            metaData,
            menuItemsTypes,
            stateKey
        } = this.props;

        const menuItemProps = {
            className: prefix(
                CLASS_NAMES.GRID_ACTIONS.MENU.ITEM,
                data.disabled ? CLASS_NAMES.GRID_ACTIONS.DISABLED : ''
            ),
            disabled: data.disabled,
            onClick: (e) => {
                return this.handleMenuItemClick(
                    data, disabled, metaData, stateKey, e
                );
            }
        };

        const checkboxComponent =
            data.menuItemType === menuItemsTypes.checkbox
            ? this.getCheckbox(data) : null;

        return (
            <li { ...menuItemProps } >
                { checkboxComponent }
                { data.text }
            </li>
        );
    }

    static propTypes = {
        data: React.PropTypes.object,
        disabled: React.PropTypes.bool,
        menuItemsTypes: React.PropTypes.object,
        metaData: React.PropTypes.object,
        stateKey: React.PropTypes.string,
        store: React.PropTypes.object
    };

    static defaultProps = {
        menuItemsTypes: {
            checkbox: 'checkbox'
        },
        metaData: {}
    };

    handleMenuItemClick(data, disabled, metaData, stateKey, reactEvent) {
        if (reactEvent && reactEvent.stopPropagation) {
            reactEvent.stopPropagation();
        }

        if (disabled) {
            return false;
        }

        const dismiss = data.dismissOnClick !== undefined
            ? data.dismissOnClick : true;

        const { store } = this.props;

        if (dismiss) {
            store.dispatch(hideMenu({ stateKey }));
        }

        if (data.EVENT_HANDLER) {
            return data.EVENT_HANDLER({ data, metaData, reactEvent });
        }
    }

    getCheckbox(data) {

        const readOnly = data.hideable !== undefined
            ? !data.hideable : false;

        const checkboxProps = {
            type: this.props.menuItemsTypes.checkbox,
            checked: data.checked,
            disabled: readOnly,
            onChange: data.onCheckboxChange || emptyFn
        };

        return (
            <input { ...checkboxProps } />
        );
    }
}

const ConnectedMenuItem = MenuItem;

export { MenuItem, ConnectedMenuItem };