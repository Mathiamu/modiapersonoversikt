import * as React from 'react';
import { VisittkortGruppe } from '../VisittkortStyles';
import Foreldre from './Foreldre';
import { Person } from '../../PersondataDomain';
import Sivilstand from './Sivilstand';
import ListeAvBarn from './ListeAvBarn';

interface Props {
    person: Person;
}

function Familie({ person }: Props) {
    const skalViseForeldre = person.alder ? person.alder <= 21 : null;

    return (
        <VisittkortGruppe tittel={'Familie'}>
            <Sivilstand person={person} />
            <ListeAvBarn relasjoner={person.forelderBarnRelasjon} />
            {skalViseForeldre && <Foreldre forelderBarnRelasjon={person.forelderBarnRelasjon} />}
        </VisittkortGruppe>
    );
}

export default Familie;
