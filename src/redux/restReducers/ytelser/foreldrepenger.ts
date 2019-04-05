import { createActionsAndReducer } from '../../../restResources/generator/restResource';
import { apiBaseUri } from '../../../api/config';
import { AppState } from '../../reducers';
import { ForeldrepengerResponse } from '../../../models/ytelse/foreldrepenger';

export function getForeldrepengerFetchUri(state: AppState) {
    const fnr = state.gjeldendeBruker.fødselsnummer;
    return `${apiBaseUri}/ytelse/foreldrepenger/${fnr}`;
}

const { reducer } = createActionsAndReducer<ForeldrepengerResponse>('foreldrepenger', getForeldrepengerFetchUri);

export default reducer;
