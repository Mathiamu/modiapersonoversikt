import * as React from 'react';
import JournalpostListeElement from './JournalpostListeElement';
import TestProvider from '../../../../../../test/Testprovider';
import {
    getStaticMockSaksoversikt,
    getStaticMockSaksoversiktV2
} from '../../../../../../mock/saksoversikt/saksoversikt-mock';
import { getTestStore } from '../../../../../../test/testStore';
import { Journalpost, Feilmelding } from '../../../../../../models/saksoversikt/journalpost';
import { mount } from 'enzyme';
import DokumentIkkeTilgangIkon from '../../../../../../svg/DokumentIkkeTilgangIkon';
import DokumentIkon from '../../../../../../svg/DokumentIkon';
import { aggregertSakstema } from '../../utils/saksoversiktUtils';
import { aggregertSakstemaV2 } from '../../utils/saksoversiktUtilsV2';

describe('JournalpostListeElement', () => {
    const staticSaksoversikt = getStaticMockSaksoversikt();
    const valgtSakstema = aggregertSakstema(staticSaksoversikt.resultat);

    it('Viser ikke-tilgang-ikon om journalpost har sikkerhetsbegrensning', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: {
                inneholderFeil: true,
                feilmelding: Feilmelding.Sikkerhetsbegrensning
            }
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkkeTilgangIkon)).toHaveLength(1);
    });

    it('Viser ikke-tilgang-ikon hvis ikke tilgang til sakstema', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({});

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    valgtSakstema={valgtSakstema}
                    journalpost={journalposter}
                    harTilgangTilSakstema={false}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkkeTilgangIkon)).toHaveLength(1);
    });

    it('Viser tilgang-ikon hvis tilgang til sakstema og ikke sikkerhetsbegrensning, selv om ikke tilgang til alle dokumenter', () => {
        const hoveddokument = staticSaksoversikt.resultat[0].dokumentMetadata[0].hoveddokument;
        const vedlegg = staticSaksoversikt.resultat[0].dokumentMetadata[0].vedlegg[0];
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: { inneholderFeil: false, feilmelding: null },
            hoveddokument: {
                ...hoveddokument,
                kanVises: false
            },
            vedlegg: [
                {
                    ...vedlegg,
                    kanVises: false
                }
            ]
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkon)).toHaveLength(1);
    });

    it('Viser ikke-tilgang-ikon selv i "Alle" sakstemalisten', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: { inneholderFeil: false, feilmelding: null }
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkon)).toHaveLength(1);
    });

    function lagStoreMedJustertDokumentMetadata(partialDok: Partial<Journalpost>) {
        const testStore = getTestStore();

        const dokumentResultat: Journalpost = {
            ...staticSaksoversikt.resultat[0].dokumentMetadata[0],
            ...partialDok
        };

        return { testStore, journalposter: dokumentResultat };
    }
});

describe('JournalpostListeElementV2', () => {
    const staticSaksoversikt = getStaticMockSaksoversiktV2();
    const valgtSakstema = aggregertSakstemaV2(staticSaksoversikt.resultat);

    it('Viser ikke-tilgang-ikon om journalpost har sikkerhetsbegrensning', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: {
                inneholderFeil: true,
                feilmelding: Feilmelding.Sikkerhetsbegrensning
            }
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkkeTilgangIkon)).toHaveLength(1);
    });

    it('Viser ikke-tilgang-ikon hvis ikke tilgang til sakstema', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({});

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    valgtSakstema={valgtSakstema}
                    journalpost={journalposter}
                    harTilgangTilSakstema={false}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkkeTilgangIkon)).toHaveLength(1);
    });

    it('Viser tilgang-ikon hvis tilgang til sakstema og ikke sikkerhetsbegrensning, selv om ikke tilgang til alle dokumenter', () => {
        const hoveddokument = staticSaksoversikt.resultat[0].dokumentMetadata[0].hoveddokument;
        const vedlegg = staticSaksoversikt.resultat[0].dokumentMetadata[0].vedlegg[0];
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: { inneholderFeil: false, feilmelding: null },
            hoveddokument: {
                ...hoveddokument,
                kanVises: false
            },
            vedlegg: [
                {
                    ...vedlegg,
                    kanVises: false
                }
            ]
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkon)).toHaveLength(1);
    });

    it('Viser ikke-tilgang-ikon selv i "Alle" sakstemalisten', () => {
        const { testStore, journalposter } = lagStoreMedJustertDokumentMetadata({
            feil: { inneholderFeil: false, feilmelding: null }
        });

        const wrapper = mount(
            <TestProvider customStore={testStore}>
                <JournalpostListeElement
                    journalpost={journalposter}
                    harTilgangTilSakstema={true}
                    valgtSakstema={valgtSakstema}
                />
            </TestProvider>
        );
        expect(wrapper.find(DokumentIkon)).toHaveLength(1);
    });

    function lagStoreMedJustertDokumentMetadata(partialDok: Partial<Journalpost>) {
        const testStore = getTestStore();

        const dokumentResultat: Journalpost = {
            ...staticSaksoversikt.resultat[0].dokumentMetadata[0],
            ...partialDok
        };

        return { testStore, journalposter: dokumentResultat };
    }
});
