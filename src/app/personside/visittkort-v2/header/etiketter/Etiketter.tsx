import * as React from 'react';
import styled from 'styled-components/macro';
import { Person } from '../../PersondataDomain';
import DiskresjonskodeEtikett from './DiskresjonskodeEtikett';
import ErrorBoundary from '../../../../../components/ErrorBoundary';
import EgenAnsattEtikett from './EgenAnsattEtikett';
import SikkerhetstiltakEtikett from './SikkerhetstiltakEtikett';
import ReservertIKRREtikett from './ReservertIKRREtikett';
import VergemalsEtikett from './VergemalsEtikett';
import TilrettelagtKommunikasjonsEtiketter from './TilrettelagtKommunikasjonsEtiketter';
import DoedsboEtikett from './DoedsboEtikett';
import FullmaktEtikett from './FullmaktEtikett';

interface Props {
    person: Person;
}

const StyledEtikketter = styled.section`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    > * {
        margin: 6px 0 0 6px;
        white-space: nowrap;
    }
`;

function Etiketter({ person }: Props) {
    return (
        <ErrorBoundary boundaryName="Etiketter">
            <StyledEtikketter role="region" aria-label="etiketter">
                <DiskresjonskodeEtikett adressebeskyttelse={person.adressebeskyttelse[0].kode} />
                <EgenAnsattEtikett erEgenansatt={person.erEgenAnsatt} />
                <SikkerhetstiltakEtikett sikkerhetstiltak={person.sikkerhetstiltak} />
                <ReservertIKRREtikett kontaktOgReservasjon={person.kontaktOgReservasjon} />
                <VergemalsEtikett vergemal={person.vergemal} />
                <TilrettelagtKommunikasjonsEtiketter tilrettelagtKommunikasjon={person.tilrettelagtKommunikasjon} />
                <DoedsboEtikett dodsbo={person.dodsbo} />
                <FullmaktEtikett fullmakt={person.fullmakt} />
            </StyledEtikketter>
        </ErrorBoundary>
    );
}

export default Etiketter;
