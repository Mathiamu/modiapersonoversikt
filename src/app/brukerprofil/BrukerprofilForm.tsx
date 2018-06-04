import * as React from 'react';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import styled from 'styled-components';

import EndreNavnForm from './EndreNavnForm';
import { Person } from '../../models/person/person';
import { VeilederRoller } from '../../models/veilederRoller';
import Kontaktinformasjon from './kontaktinformasjon/KontaktinformasjonContainer';
import TilrettelagtKommunikasjonContainer from
        './kontaktinformasjon/TilrettelagtKommunikasjonContainer';

export const FormKnapperWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
    person: Person;
    veilderRoller?: VeilederRoller;
}

function BrukerprofilForm({ person, veilderRoller }: Props) {
    return (
        <>
            <EndreNavnForm person={person} veilederRoller={veilderRoller}/>
            <form>
                <Undertittel>Adresse</Undertittel>
            </form>
            <form>
                <Undertittel>Kontonummer</Undertittel>
            </form>
            <Kontaktinformasjon person={person} fødselsnummer={person.fødselsnummer}/>
            <TilrettelagtKommunikasjonContainer person={person} veilederRoller={veilderRoller}/>
        </>
    );
}

export default BrukerprofilForm;
