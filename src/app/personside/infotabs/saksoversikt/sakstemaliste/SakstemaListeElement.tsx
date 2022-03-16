import * as React from 'react';
import { Behandlingsstatus, Sakstema } from '../../../../../models/saksoversikt/sakstema';
import styled from 'styled-components/macro';
import { pxToRem, theme } from '../../../../../styles/personOversiktTheme';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import SakIkkeTilgangIkon from '../../../../../svg/SakIkkeTilgangIkon';
import { hentFormattertDatoForSisteHendelse } from '../utils/saksoversiktUtils';
import VisMerKnapp from '../../../../../components/VisMerKnapp';
import { sakstemakodeAlle } from './SakstemaListe';
import { sakerTest } from '../../dyplenkeTest/utils-dyplenker-test';
import { useInfotabsDyplenker } from '../../dyplenker';
import { Checkbox } from 'nav-frontend-skjema';
import { useSakstemaer } from '../SakstemaContext';

interface Props {
    sakstema: Sakstema;
    erValgt: boolean;
}

const SVGStyling = styled.span`
    svg {
        height: ${theme.margin.px30};
        width: ${theme.margin.px30};
        opacity: 0.5;
    }
`;

const UUcustomOrder = styled.div`
    display: flex;
    flex-direction: column;
    .order-first {
        order: 0;
    }
    .order-second {
        order: 1;
    }
`;

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const CheckBoxListe = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${pxToRem(15)};

    .checkbox {
        label {
            font-weight: bold;
        }
    }

    .metadata {
        margin-left: ${pxToRem(32)};
    }
`;

function visAntallSakerSomHarBehandlingsstatus(sakstema: Sakstema, sjekkMotStatus: Behandlingsstatus, status: string) {
    const antallUnderbehandling = sakstema.behandlingskjeder.filter(
        (behandlingskjede) => behandlingskjede.status === sjekkMotStatus
    ).length;

    // Skal ikke vises på det aggregerte sakstemaet
    if (antallUnderbehandling === 0 || sakstema.temakode === sakstemakodeAlle) {
        return null;
    }

    const soknad = antallUnderbehandling === 1 ? 'søknad' : 'søknader';
    return (
        <Normaltekst className="metadata">
            {antallUnderbehandling} {soknad} er {status}.
        </Normaltekst>
    );
}

function saksikon(harTilgang: boolean) {
    if (harTilgang) {
        return null;
    } else {
        return <SakIkkeTilgangIkon />;
    }
}

interface CheckBoxProps {
    sakstema: Sakstema;
    erValgt: boolean;
}

export const SakstemaListeElementCheckbox = React.memo(function SakstemaListeElementCheckbox(props: CheckBoxProps) {
    const { filtrerPaTema } = useSakstemaer();

    const sakerUnderBehandling = visAntallSakerSomHarBehandlingsstatus(
        props.sakstema,
        Behandlingsstatus.UnderBehandling,
        'under behandling'
    );

    const sakerFerdigBehandlet = visAntallSakerSomHarBehandlingsstatus(
        props.sakstema,
        Behandlingsstatus.FerdigBehandlet,
        'ferdig behandlet'
    );

    return (
        <li className={sakerTest.sakstema}>
            <CheckBoxListe>
                <div>
                    <Normaltekst className="metadata">{hentFormattertDatoForSisteHendelse(props.sakstema)}</Normaltekst>
                    <Checkbox
                        key={props.sakstema.temakode}
                        label={props.sakstema.temanavn}
                        className={'checkbox ' + sakerTest.oversikt}
                        checked={props.erValgt}
                        onChange={() => filtrerPaTema([props.sakstema])}
                    />
                    {sakerUnderBehandling}
                    {sakerFerdigBehandlet}
                </div>
                <SVGStyling>{saksikon(props.sakstema.harTilgang)}</SVGStyling>
            </CheckBoxListe>
        </li>
    );
});

export const SakstemaListeElementKnapp = React.memo(function SakstemaListeElementKnapp(props: Props) {
    const dyplenker = useInfotabsDyplenker();

    const sakerUnderBehandling = visAntallSakerSomHarBehandlingsstatus(
        props.sakstema,
        Behandlingsstatus.UnderBehandling,
        'under behandling'
    );
    const sakerFerdigBehandlet = visAntallSakerSomHarBehandlingsstatus(
        props.sakstema,
        Behandlingsstatus.FerdigBehandlet,
        'ferdig behandlet'
    );

    return (
        <li className={sakerTest.sakstema}>
            <VisMerKnapp
                valgt={props.erValgt}
                linkTo={dyplenker.saker.link(props.sakstema)}
                ariaDescription={'Vis ' + props.sakstema.temanavn}
            >
                <Flex>
                    <div>
                        <UUcustomOrder>
                            <Element className={'order-second ' + sakerTest.oversikt}>
                                {props.sakstema.temanavn}
                            </Element>
                            <Normaltekst className="order-first">
                                {hentFormattertDatoForSisteHendelse(props.sakstema)}
                            </Normaltekst>
                        </UUcustomOrder>
                        {sakerUnderBehandling}
                        {sakerFerdigBehandlet}
                    </div>
                    <SVGStyling>{saksikon(props.sakstema.harTilgang)}</SVGStyling>
                </Flex>
            </VisMerKnapp>
        </li>
    );
});
