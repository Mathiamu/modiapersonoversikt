import { resetKontrollSpørsmål } from '../../redux/kontrollSporsmal/actions';
import { hentPerson } from '../../redux/restReducers/personinformasjon';
import { useEffect, useMemo } from 'react';
import { AppState } from '../../redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { AsyncAction } from '../../redux/ThunkTypes';
import { useFetchFeatureTogglesOnNewFnr } from './FetchFeatureToggles';

function useDispatchOnNewFnr(action: Action | AsyncAction, fnr: string) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(action);
    }, [action, fnr, dispatch]);
}

function LyttPåNyttFnrIReduxOgHentAllPersoninfo() {
    const fnr = useSelector((state: AppState) => state.gjeldendeBruker.fødselsnummer);
    const restResources = useSelector((state: AppState) => state.restResources);

    const memoHentPersopn = useMemo(() => hentPerson(fnr), [fnr]);
    useDispatchOnNewFnr(memoHentPersopn, fnr);
    useDispatchOnNewFnr(resetKontrollSpørsmål, fnr);
    useDispatchOnNewFnr(restResources.kontaktinformasjon.actions.fetch, fnr);
    useDispatchOnNewFnr(restResources.vergemal.actions.fetch, fnr);
    useDispatchOnNewFnr(restResources.egenAnsatt.actions.fetch, fnr);
    useDispatchOnNewFnr(restResources.brukersNavKontor.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.utbetalinger.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.pleiepenger.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.sykepenger.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.foreldrepenger.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.sendMelding.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.tråderOgMeldinger.actions.reset, fnr);
    useDispatchOnNewFnr(restResources.brukersVarsler.actions.reset, fnr);
    useFetchFeatureTogglesOnNewFnr();

    return null;
}

export default LyttPåNyttFnrIReduxOgHentAllPersoninfo;
