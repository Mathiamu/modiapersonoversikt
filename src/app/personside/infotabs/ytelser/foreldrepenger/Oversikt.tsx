import * as React from 'react';
import { useState } from 'react';
import { Foreldrepengerettighet } from '../../../../../models/ytelse/foreldrepenger';
import { sorterArbeidsforholdEtterRefusjonTom, utledFraDatoForRettighet, utledMaksDato } from './foreldrePengerUtils';
import { datoVerbose } from '../../utbetalinger/utils/utbetalingerUtils';
import DescriptionList from '../felles-styling/DescriptionList';
import YtelserInfoGruppe from '../felles-styling/YtelserInfoGruppe';
import { OversiktStyling } from '../felles-styling/CommonStylingYtelser';
import ArbeidsForhold from './Arbeidsforhold';
import styled from 'styled-components';
import theme from '../../../../../styles/personOversiktTheme';
import DetaljerCollapse from '../../../../../components/DetaljerCollapse';

interface Props {
    foreldrePenger: Foreldrepengerettighet;
}

const ArbeidsForholdListeStyle = styled.ol`
    list-style: none;
    > *:not(:first-child) {
        border-top: ${theme.border.skilleSvak};
    }
    > *:not(:last-child) {
        margin-bottom: 2rem;
    }
`;

const Luft = styled.div`
    margin-top: 2rem;
`;

function AlleArbeidsforhold(props: { foreldrePenger: Foreldrepengerettighet }) {
    const [gjeldendeArbeidsforhold, ...tidligereArbeidsforhold] = sorterArbeidsforholdEtterRefusjonTom(
        props.foreldrePenger
    );

    const [visAlleArbeidsforhold, setVisalleArbeidsforhold] = useState(false);

    const tidligereArbeidsforholdCollapse = (
        <DetaljerCollapse
            open={visAlleArbeidsforhold}
            toggle={() => setVisalleArbeidsforhold(!visAlleArbeidsforhold)}
            tittel="alle arbeidsforhold"
        >
            <ArbeidsForholdListeStyle aria-label="Andre arbeidsforhold">
                {tidligereArbeidsforhold.map((arbForhold, index) => (
                    <li key={index}>
                        <ArbeidsForhold arbeidsforhold={arbForhold} />
                    </li>
                ))}
            </ArbeidsForholdListeStyle>
        </DetaljerCollapse>
    );

    return (
        <>
            <ArbeidsForhold arbeidsforhold={gjeldendeArbeidsforhold} />
            {tidligereArbeidsforhold.length > 0 && tidligereArbeidsforholdCollapse}
        </>
    );
}

function Oversikt({ foreldrePenger }: Props) {
    const foreldrePengeRetten = {
        Foreldrepengetype: foreldrePenger.foreldrepengetype,
        Dekningsgrad: foreldrePenger.dekningsgrad + '%',
        'Rettighet fra dato': datoVerbose(utledFraDatoForRettighet(foreldrePenger)).sammensatt,
        Restdager: foreldrePenger.restDager,
        Maksdato: utledMaksDato(foreldrePenger),
        Arbeidskategori: foreldrePenger.arbeidskategori,
    };

    const barnet = {
        Termindato: foreldrePenger.rettighetFom && datoVerbose(foreldrePenger.rettighetFom).sammensatt,
        Fødselsdato: foreldrePenger.barnetsFødselsdato && datoVerbose(foreldrePenger.barnetsFødselsdato).sammensatt,
        'Annen forelder': foreldrePenger.andreForeldersFnr,
        [(foreldrePenger.termin && 'Termindato') ||
        (foreldrePenger.omsorgsovertakelse && 'Omsorgsovertagelse') ||
        'N/A']: foreldrePenger.termin || foreldrePenger.omsorgsovertakelse,
        'Foreldre av samme kjønn': foreldrePenger.foreldreAvSammeKjønn,
        'Antall barn': foreldrePenger.antallBarn,
    };

    return (
        <OversiktStyling>
            <div>
                <YtelserInfoGruppe tittel="Om foreldrepengeretten">
                    <DescriptionList entries={foreldrePengeRetten} />
                </YtelserInfoGruppe>
                <Luft />
                <YtelserInfoGruppe tittel="Om barnet">
                    <DescriptionList entries={barnet} />
                </YtelserInfoGruppe>
            </div>
            <YtelserInfoGruppe tittel="Arbeidssituasjon">
                <AlleArbeidsforhold foreldrePenger={foreldrePenger} />
            </YtelserInfoGruppe>
        </OversiktStyling>
    );
}

export default Oversikt;
