import { fromJS } from 'immutable';
import { SET_DATA,
    ADD_NEW_ROW,
    CLEAR_FILTER_LOCAL,
    DISMISS_EDITOR,
    FILTER_DATA,
    REMOVE_ROW,
    SAVE_ROW,
    SORT_DATA,
    UPDATE_ROW
} from '../../constants/ActionTypes';

import { generateLastUpdate } from './../../util/lastUpdate';

const initialState = fromJS({ lastUpdate: generateLastUpdate() });

export default function dataSource(state = initialState, action) {
    switch (action.type) {

    case SET_DATA:
        return state.setIn([action.stateKey], fromJS({
            data: action.data,
            proxy: action.data,
            total: action.total || action.data.length,
            currentRecords: action.currentRecords || action.data,
            lastUpdate: generateLastUpdate()
        }));

    case DISMISS_EDITOR:
        const previousData = state.getIn([action.stateKey, 'data']);
        const previousProxy = state.getIn([action.stateKey, 'proxy']);
        let previousTotal = state.getIn([action.stateKey, 'total']);

        // upon dismiss, if a new row was in edit
        // but isn't save, update the total to reflect that
        if (previousData
            && previousProxy
            && previousData.size > previousProxy.size) {
            previousTotal = previousProxy.size;
        }

        if (state.get(action.stateKey)) {
            return state.mergeIn([action.stateKey], fromJS({
                data: previousProxy,
                proxy: previousProxy,
                currentRecords: previousProxy,
                total: previousTotal,
                isEditing: false,
                lastUpdate: generateLastUpdate()
            }));
        }

        return state;

    case REMOVE_ROW:
        const remainingRows = state
            .getIn([action.stateKey, 'data'])
            .remove(action.rowIndex || 0, 1);

        return state.mergeIn([action.stateKey], fromJS({
            data: remainingRows,
            proxy: remainingRows,
            currentRecords: remainingRows,
            lastUpdate: generateLastUpdate()
        }));

    case UPDATE_ROW:

        const existingData = state.getIn([action.stateKey, 'data']);
        const prevRow = existingData
            ? existingData.get(action.rowIndex)
            : null;

        if (!prevRow) {
            return state;
        }

        const updatedRow = prevRow.merge(action.values);
        const updatedData = state.getIn([action.stateKey, 'data'])
            .set(action.rowIndex, updatedRow);

        return state.mergeIn([action.stateKey], {
            data: updatedData,
            proxy: updatedData,
            currentRecords: updatedData,
            lastUpdate: generateLastUpdate()
        });

    case ADD_NEW_ROW:

        const existingState = state.get(action.stateKey);
        const isEditing = existingState && existingState.get('isEditing');
        const data = existingState && existingState.get('data');

        if (existingState && isEditing) {
            return state;
        }

        const newRow = data
            && data.size > 0
            && data.get(0)
            ? data.get(0).map((k, v) => v = '')
            : fromJS({});

        const newData = data.unshift(newRow);

        return state.mergeIn([action.stateKey], fromJS({
            data: newData,
            proxy: data,
            isEditing: true,
            lastUpdate: generateLastUpdate(),
            total: newData.size
        }));

    case SAVE_ROW:
        const gridData = state
            .getIn([action.stateKey, 'data'])
            .set(action.rowIndex, fromJS(action.values));

        return state.mergeIn([action.stateKey], fromJS({
            data: gridData,
            proxy: gridData,
            currentRecords: gridData,
            lastUpdate: generateLastUpdate()
        }));

    case SORT_DATA:
        return state.mergeIn([action.stateKey], {
            data: action.data,
            lastUpdate: generateLastUpdate()
        });

    case CLEAR_FILTER_LOCAL:

        const proxy = state.getIn([action.stateKey, 'proxy']);
        const prevData = state.getIn([action.stateKey, 'data']);
        const recs = proxy || prevData;

        return state.mergeIn([action.stateKey], {
            data: recs,
            proxy: recs,
            currentRecords: recs,
            lastUpdate: generateLastUpdate()
        });

    case FILTER_DATA:
        return state.mergeIn([action.stateKey], {
            data: action.data,
            lastUpdate: generateLastUpdate()
        });

    default:

        return state;
    }
}
