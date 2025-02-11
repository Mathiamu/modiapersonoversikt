import * as React from 'react';
import { applyDefaults, DefaultConfig, RendererOrConfig, useRest } from '../useRest';
import { CenteredLazySpinner } from '../../components/LazySpinner';
import AlertStripe from 'nav-frontend-alertstriper';
import { apiBaseUri } from '../../api/config';
import { SakstemaResponse, SakstemaSoknadsstatusResponse } from '../../models/saksoversikt/sakstema';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import { useValgtenhet } from '../../context/valgtenhet-state';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { FetchError, get } from '../../api/api';

const defaults: DefaultConfig = {
    ifPending: <CenteredLazySpinner />,
    ifError: <AlertStripe type="advarsel">Kunne ikke laste inn tema</AlertStripe>
};
function queryKey(fnr: string, enhet: string | undefined): [string, string, string | undefined] {
    return ['sakstema', fnr, enhet];
}

function queryKeyV2(fnr: string, enhet: string | undefined): [string, string, string | undefined] {
    return ['sakstemaV2', fnr, enhet];
}

function url(fnr: string, enhet: string | undefined) {
    const header = enhet ? `?enhet=${enhet}` : '';
    return `${apiBaseUri}/saker/${fnr}/sakstema${header}`;
}

function urlV2(fnr: string, enhet?: string) {
    const header = enhet ? `?enhet=${enhet}` : '';
    return `${apiBaseUri}/saker/${fnr}/v2/sakstema${header}`;
}

function useFnrEnhet(): [string, string | undefined] {
    const fnr = useSelector((state: AppState) => state.gjeldendeBruker.fødselsnummer);
    const enhet = useValgtenhet().enhetId;
    return [fnr, enhet];
}

const resource = {
    useFetch(): UseQueryResult<SakstemaResponse, FetchError> {
        const [fnr, enhet] = useFnrEnhet();
        return useQuery(queryKey(fnr, enhet), () => get(url(fnr, enhet)));
    },
    useRenderer(renderer: RendererOrConfig<SakstemaResponse>) {
        const response = this.useFetch();
        return useRest(response, applyDefaults(defaults, renderer));
    }
};

export const sakstemaResourceV2 = {
    useFetch(): UseQueryResult<SakstemaSoknadsstatusResponse, FetchError> {
        const [fnr, enhet] = useFnrEnhet();
        return useQuery(queryKeyV2(fnr, enhet), () => get(urlV2(fnr, enhet)));
    },
    useRenderer(renderer: RendererOrConfig<SakstemaSoknadsstatusResponse>) {
        const response = this.useFetch();
        return useRest(response, applyDefaults(defaults, renderer));
    }
};

export default resource;
