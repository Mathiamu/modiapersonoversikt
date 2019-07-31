import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { paths } from '../routes/routing';
import { erDød, Person } from '../../models/person/person';
import { VeilederRoller } from '../../models/veilederRoller';
import { theme } from '../../styles/personOversiktTheme';
import BrukerprofilForm from './BrukerprofilForm';
import { AppState } from '../../redux/reducers';
import { useSelector } from 'react-redux';
import { FormatertKontonummer } from '../../utils/FormatertKontonummer';
import { Normaltekst, Systemtittel, Undertekst } from 'nav-frontend-typografi';
import { loggEvent } from '../../utils/frontendLogger';
import HandleBrukerprofilHotkeys from './HandleBrukerprofilHotkeys';
import { erNyePersonoversikten } from '../../utils/erNyPersonoversikt';
import { TilbakePil } from '../../components/common-styled-components';
import { BigCenteredLazySpinner } from '../../components/BigCenteredLazySpinner';
import RestResourceConsumer from '../../rest/consumer/RestResourceConsumer';
import { useOnMount } from '../../utils/customHooks';
import { isLoadedPerson } from '../../redux/restReducers/personinformasjon';
import Innholdslaster from '../../components/Innholdslaster';

const BrukerprofilWrapper = styled.article`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    ${theme.animation.fadeIn};
`;

const HeaderStyle = styled.section`
    display: flex;
    flex-shrink: 0;
    padding: ${theme.margin.px20};
    background-color: white;
    box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
    z-index: 100;
`;

const HeaderContent = styled.section`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ContentWrapper = styled.section`
    overflow-y: auto;
    flex-grow: 1;
    padding: 3rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    > * {
        max-width: 720px;
        width: 90%;
        ${theme.hvittPanel};
        margin: 1em 0;
        padding: 2em;
    }
`;

const LinkWrapper = styled.div`
    margin-bottom: 1em;
`;

const Fokus = styled.div`
    &:focus {
        ${theme.focus}
    }
`;

function hentNavn({ navn }: Person) {
    return navn.fornavn + (navn.mellomnavn ? ' ' + navn.mellomnavn + ' ' : ' ') + navn.etternavn;
}

function getAlder(person: Person) {
    return erDød(person.personstatus) ? 'Død' : person.alder;
}

function Navn({ person }: { person: Person }) {
    return (
        <Normaltekst>
            {hentNavn(person)} ({getAlder(person)})
        </Normaltekst>
    );
}

function Konto({ person }: { person: Person }) {
    return (
        <Undertekst>
            Kontonummer: <FormatertKontonummer kontonummer={(person.bankkonto && person.bankkonto.kontonummer) || ''} />
        </Undertekst>
    );
}

function TilbakeLenke({ fnr }: { fnr: string }) {
    return (
        <LinkWrapper>
            <Link className={'lenke'} to={`${paths.personUri}/${fnr}`}>
                <TilbakePil>Tilbake</TilbakePil>
            </Link>
        </LinkWrapper>
    );
}

class Header extends React.PureComponent<{ person: Person }> {
    private ref = React.createRef<HTMLDivElement>();

    componentDidMount() {
        if (this.ref.current) {
            this.ref.current.focus();
        }
    }

    render() {
        const person = this.props.person;
        return (
            <HeaderStyle>
                <TilbakeLenke fnr={person.fødselsnummer} />
                <HeaderContent>
                    <Fokus ref={this.ref} tabIndex={-1}>
                        <Systemtittel tag="h1">Administrer brukerprofil</Systemtittel>
                    </Fokus>
                    <div>
                        <Navn person={person} />
                        <Konto person={person} />
                    </div>
                </HeaderContent>
            </HeaderStyle>
        );
    }
}

function BrukerprofilSide() {
    const personResource = useSelector((state: AppState) => state.restResources.personinformasjon);

    useOnMount(() => loggEvent('Sidevisning', 'Brukerprofil'));

    if (!isLoadedPerson(personResource)) {
        return <Innholdslaster avhengigheter={[personResource]} returnOnPending={BigCenteredLazySpinner} />;
    }

    return (
        <BrukerprofilWrapper>
            {erNyePersonoversikten() && <HandleBrukerprofilHotkeys />}
            <RestResourceConsumer<VeilederRoller>
                getResource={restResources => restResources.veilederRoller}
                returnOnPending={BigCenteredLazySpinner}
            >
                {veilederRoller => (
                    <>
                        {erNyePersonoversikten() && <Header person={personResource.data} />}
                        <ContentWrapper>
                            <BrukerprofilForm person={personResource.data} veilderRoller={veilederRoller} />
                        </ContentWrapper>
                    </>
                )}
            </RestResourceConsumer>
        </BrukerprofilWrapper>
    );
}

export default BrukerprofilSide;
