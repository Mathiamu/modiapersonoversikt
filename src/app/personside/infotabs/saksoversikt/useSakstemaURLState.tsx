import { useMemo } from 'react';
import { useHistory } from 'react-router';
import { SakstemaBehandlingskjede, SakstemaSoknadsstatus } from '../../../../models/saksoversikt/sakstema';
import { datoSynkende } from '../../../../utils/date-utils';
import { hentDatoForSisteHendelse, sakstemakodeAlle, sakstemakodeIngen } from './utils/saksoversiktUtils';
import { useQueryParams } from '../../../../utils/url-utils';
import { Dokument, Journalpost } from '../../../../models/saksoversikt/journalpost';
import sakstemaLoader, { sakstemaResourceV2 } from '../../../../rest/resources/sakstemaResource';
import { filtrerSakstemaerUtenData, filtrerSakstemaerUtenDataV2 } from './sakstemaliste/SakstemaListeUtils';
import { hentDatoForSisteHendelseV2 } from './utils/saksoversiktUtilsV2';

interface SakstemaURLState {
    valgteSakstemaer: SakstemaBehandlingskjede[];
    valgtDokument: Dokument | undefined;
    valgtJournalpost: Journalpost | undefined;
    setIngenValgte(): void;
    setAlleValgte(): void;
    toggleValgtSakstema(sakstema: SakstemaBehandlingskjede): void;
}

interface SakstemaURLStateV2 {
    valgteSakstemaer: SakstemaSoknadsstatus[];
    valgtDokument: Dokument | undefined;
    valgtJournalpost: Journalpost | undefined;
    setIngenValgte(): void;
    setAlleValgte(): void;
    toggleValgtSakstema(sakstema: SakstemaSoknadsstatus): void;
}

interface QueryParamsForSak {
    sakstema?: string;
    dokument?: string;
}

interface SakstemaResource {
    alleSakstema: SakstemaBehandlingskjede[];
    isLoading: boolean;
}

interface SakstemaResourceV2 {
    alleSakstema: SakstemaSoknadsstatus[];
    isLoading: boolean;
}

export function useSakstemaURLState(alleSakstemaer: SakstemaBehandlingskjede[]): SakstemaURLState {
    const filtrertAlleSakstemaer = filtrerSakstemaerUtenData(alleSakstemaer);
    const history = useHistory();
    const queryParams = useQueryParams<QueryParamsForSak>(); //SYK-BAR-AAP
    return useMemo(() => {
        const sakstemaerFraUrl: string[] = queryParams.sakstema?.split('-') ?? [sakstemakodeAlle];
        const valgteSakstemaer: SakstemaBehandlingskjede[] = sakstemaerFraUrl.includes(sakstemakodeAlle)
            ? filtrertAlleSakstemaer
            : filtrertAlleSakstemaer.filter((sakstema) => sakstemaerFraUrl.includes(sakstema.temakode));

        const journalposter = filtrertAlleSakstemaer.flatMap((sakstema) => sakstema.dokumentMetadata);
        const dokumenter = journalposter.flatMap((journalpost) => [journalpost.hoveddokument, ...journalpost.vedlegg]);
        const dokumentReferanseFraUrl = queryParams.dokument ?? '';
        const valgtDokument = dokumenter.find((dokument) => dokument.dokumentreferanse === dokumentReferanseFraUrl);
        const valgtJournalpost = journalposter.find((journalpost) =>
            inneholderValgtDokument(journalpost, dokumentReferanseFraUrl)
        );

        const setIngenValgte = () => {
            history.push({
                search: `?sakstema=${sakstemakodeIngen}`
            });
        };

        const setAlleValgte = () => {
            history.push({
                search: `?sakstema=${sakstemakodeAlle}`
            });
        };

        const toggleValgtSakstema = (sakstema: SakstemaBehandlingskjede) => {
            const nyTemaliste = valgteSakstemaer.includes(sakstema)
                ? valgteSakstemaer.filter((tema) => tema !== sakstema)
                : [...valgteSakstemaer, sakstema];

            if (nyTemaliste.isEmpty()) {
                setIngenValgte();
            } else if (nyTemaliste.length === filtrertAlleSakstemaer.length) {
                setAlleValgte();
            } else {
                const nyURL = nyTemaliste
                    .sort(datoSynkende((sakstema) => hentDatoForSisteHendelse(sakstema)))
                    .map((sakstema) => sakstema.temakode)
                    .join('-');
                history.push({
                    search: `?sakstema=${nyURL}`
                });
            }
        };

        return {
            valgteSakstemaer,
            valgtDokument,
            valgtJournalpost,
            setAlleValgte,
            setIngenValgte,
            toggleValgtSakstema
        };
    }, [history, queryParams, filtrertAlleSakstemaer]);
}

export function useSakstemaURLStateV2(alleSakstemaer: SakstemaSoknadsstatus[]): SakstemaURLStateV2 {
    const filtrertAlleSakstemaer = filtrerSakstemaerUtenDataV2(alleSakstemaer);
    const history = useHistory();
    const queryParams = useQueryParams<QueryParamsForSak>(); //SYK-BAR-AAP
    return useMemo(() => {
        const sakstemaerFraUrl: string[] = queryParams.sakstema?.split('-') ?? [sakstemakodeAlle];
        const valgteSakstemaer: SakstemaSoknadsstatus[] = sakstemaerFraUrl.includes(sakstemakodeAlle)
            ? filtrertAlleSakstemaer
            : filtrertAlleSakstemaer.filter((sakstema) => sakstemaerFraUrl.includes(sakstema.temakode));

        const journalposter = filtrertAlleSakstemaer.flatMap((sakstema) => sakstema.dokumentMetadata);
        const dokumenter = journalposter.flatMap((journalpost) => [journalpost.hoveddokument, ...journalpost.vedlegg]);
        const dokumentReferanseFraUrl = queryParams.dokument ?? '';
        const valgtDokument = dokumenter.find((dokument) => dokument.dokumentreferanse === dokumentReferanseFraUrl);
        const valgtJournalpost = journalposter.find((journalpost) =>
            inneholderValgtDokument(journalpost, dokumentReferanseFraUrl)
        );

        const setIngenValgte = () => {
            history.push({
                search: `?sakstema=${sakstemakodeIngen}`
            });
        };

        const setAlleValgte = () => {
            history.push({
                search: `?sakstema=${sakstemakodeAlle}`
            });
        };

        const toggleValgtSakstema = (sakstema: SakstemaSoknadsstatus) => {
            const nyTemaliste = valgteSakstemaer.includes(sakstema)
                ? valgteSakstemaer.filter((tema) => tema !== sakstema)
                : [...valgteSakstemaer, sakstema];

            if (nyTemaliste.isEmpty()) {
                setIngenValgte();
            } else if (nyTemaliste.length === filtrertAlleSakstemaer.length) {
                setAlleValgte();
            } else {
                const nyURL = nyTemaliste
                    .sort(datoSynkende((sakstema) => hentDatoForSisteHendelseV2(sakstema) ?? Date()))
                    .map((sakstema) => sakstema.temakode)
                    .join('-');
                history.push({
                    search: `?sakstema=${nyURL}`
                });
            }
        };

        return {
            valgteSakstemaer,
            valgtDokument,
            valgtJournalpost,
            setAlleValgte,
            setIngenValgte,
            toggleValgtSakstema
        };
    }, [history, queryParams, filtrertAlleSakstemaer]);
}

export function useHentAlleSakstemaFraResource(): SakstemaResource {
    const resource = sakstemaLoader.useFetch();

    return useMemo(() => {
        if (resource.data) {
            return {
                alleSakstema: resource.data.resultat.sort(datoSynkende((it) => hentDatoForSisteHendelse(it))),
                isLoading: false
            };
        }
        return { alleSakstema: [], isLoading: true };
    }, [resource]);
}

export function useHentAlleSakstemaFraResourceV2(): SakstemaResourceV2 {
    const resource = sakstemaResourceV2.useFetch();

    return useMemo(() => {
        if (resource.data) {
            return {
                alleSakstema: resource.data.resultat.sort(
                    datoSynkende((it) => hentDatoForSisteHendelseV2(it) ?? Date())
                ),
                isLoading: false
            };
        }
        return { alleSakstema: [], isLoading: true };
    }, [resource]);
}

function inneholderValgtDokument(journalpost: Journalpost, dokumentId?: string): boolean {
    return (
        !!dokumentId &&
        [
            journalpost.hoveddokument.dokumentreferanse,
            ...journalpost.vedlegg.flatMap((dokument) => dokument.dokumentreferanse)
        ].includes(dokumentId)
    );
}
