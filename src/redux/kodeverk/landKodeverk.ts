import { createActionsAndReducer } from '../restReducer';
import { fetchKodeverk } from '../../api/kodeverk';

const { reducer, action, actionNames } = createActionsAndReducer('kodeverk-land');

export function hentLand() {
    return action(() => fetchKodeverk('Landkoder'));
}

export const landActionNames = actionNames;
export default reducer;
