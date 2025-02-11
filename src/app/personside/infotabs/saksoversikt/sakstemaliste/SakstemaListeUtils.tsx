import * as React from 'react';
import {
    Behandlingsstatus,
    SakstemaBehandlingskjede,
    SakstemaSoknadsstatus
} from '../../../../../models/saksoversikt/sakstema';
import { Normaltekst } from 'nav-frontend-typografi';
import SakIkkeTilgangIkon from '../../../../../svg/SakIkkeTilgangIkon';
import styled from 'styled-components/macro';
import theme from '../../../../../styles/personOversiktTheme';

export const SVGStyling = styled.span`
    svg {
        height: ${theme.margin.px30};
        width: ${theme.margin.px30};
        opacity: 0.5;
    }
`;

export function visAntallSakerSomHarBehandlingsstatus(
    sakstema: SakstemaBehandlingskjede,
    sjekkMotStatus: Behandlingsstatus,
    status: string
) {
    const antallUnderbehandling = sakstema.behandlingskjeder.filter(
        (behandlingskjede) => behandlingskjede.status === sjekkMotStatus
    ).length;

    if (antallUnderbehandling === 0) {
        return null;
    }

    const soknad = antallUnderbehandling === 1 ? 'søknad' : 'søknader';
    return (
        <Normaltekst className="metadata">
            {antallUnderbehandling} {soknad} er {status}.
        </Normaltekst>
    );
}

export function visAntallSakerSomHarbehandlingsstatusV2(
    sakstema: SakstemaSoknadsstatus,
    sjekkMotStatus: Behandlingsstatus,
    status: string
) {
    let antallUnderbehandling = 0;

    if (sjekkMotStatus === Behandlingsstatus.Avbrutt) {
        antallUnderbehandling = sakstema.soknadsstatus.avbrutt;
    } else if (sjekkMotStatus === Behandlingsstatus.FerdigBehandlet) {
        antallUnderbehandling = sakstema.soknadsstatus.ferdigBehandlet;
    } else if (sjekkMotStatus === Behandlingsstatus.UnderBehandling) {
        antallUnderbehandling = sakstema.soknadsstatus.underBehandling;
    }

    if (antallUnderbehandling === 0) {
        return null;
    }

    const soknad = antallUnderbehandling === 1 ? 'søknad' : 'søknader';
    return (
        <Normaltekst className="metadata">
            {antallUnderbehandling} {soknad} er {status}.
        </Normaltekst>
    );
}

export function saksikon(harTilgang: boolean) {
    if (harTilgang) {
        return null;
    } else {
        return <SakIkkeTilgangIkon />;
    }
}

export function filtrerSakstemaerUtenData(sakstemaer: SakstemaBehandlingskjede[]): SakstemaBehandlingskjede[] {
    return sakstemaer.filter(
        (sakstema) => sakstema.behandlingskjeder.length > 0 || sakstema.dokumentMetadata.length > 0
    );
}

export function filtrerSakstemaerUtenDataV2(sakstemaer: SakstemaSoknadsstatus[]): SakstemaSoknadsstatus[] {
    return sakstemaer.filter(
        (sakstema) =>
            sakstema.soknadsstatus.avbrutt > 0 ||
            sakstema.soknadsstatus.ferdigBehandlet > 0 ||
            sakstema.soknadsstatus.underBehandling > 0 ||
            sakstema.dokumentMetadata.length > 0
    );
}
