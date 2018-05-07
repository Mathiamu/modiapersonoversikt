import * as React from 'react';

import { Person } from '../../../../../models/person';
import { InfoGruppe } from '../styledComponents';
import Adresse from './adresse/Adresse';
import EpostContainer from './epost/EpostContainer';
import MobiltelefonContainer from './telefon/MobiltelefonContainer';
import Bankkonto from './bankkonto/Bankkonto';

interface Props {
    person: Person;
}

export default function Kontaktinformasjon({person}: Props) {
    return (
        <InfoGruppe tittel={'Kontaktinformasjon'}>
            <Adresse  person={person}/>
            <EpostContainer/>
            <MobiltelefonContainer/>
            <Bankkonto person={person}/>
        </InfoGruppe>
    );
}