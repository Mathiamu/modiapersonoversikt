import * as React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import VisittkortElement from '../../VisittkortElement';
import { Person } from '../../../../../../models/person/person';
import { formaterDato } from '../../../../../../utils/string-utils';
import { endretAvTekst } from '../../../../../../utils/endretAvUtil';
import EtikettGraa from '../../../../../../components/EtikettGraa';
import CoinsIkon from '../../../../../../svg/Coins';
import { FormatertKontonummer } from '../../../../../../utils/FormatertKontonummer';

interface BankkontoProps {
    person: Person;
}

function Bankkonto({ person }: BankkontoProps) {
    let beskrivelse = 'Kontonummer';
    if (person.bankkonto && person.bankkonto.landkode && person.bankkonto.landkode.kodeRef !== 'NOR') {
        beskrivelse += ' utland';
    }

    return (
        <VisittkortElement beskrivelse={beskrivelse} ikon={<CoinsIkon />}>
            {kontoinfo(person)}
        </VisittkortElement>
    );
}

function kontoinfo(person: Person) {
    if (person.bankkonto) {
        const formatertDato = formaterDato(person.bankkonto.sistEndret);
        const endretAv = endretAvTekst(person.bankkonto.sistEndretAv);
        return (
            <>
                <Normaltekst>
                    <FormatertKontonummer kontonummer={person.bankkonto.kontonummer} />
                </Normaltekst>
                <EtikettGraa>
                    Endret {formatertDato} {endretAv}
                </EtikettGraa>
            </>
        );
    }

    return <Normaltekst>Ikke registrert</Normaltekst>;
}

export default Bankkonto;
