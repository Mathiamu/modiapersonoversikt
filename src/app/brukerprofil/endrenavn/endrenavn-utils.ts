import { erDnummer } from '../../../utils/fnr-utils';
import { BostatusTyper, Person } from '../../../models/person/person';

export function brukersNavnKanEndres(person: Person): boolean {
    if (erDnummer(person.fødselsnummer)) {
        return true;
    } else if (person.personstatus === BostatusTyper.Utvandret) {
        return true;
    }

    return false;
}

export function validerNavn(input: string) {
    if (input.trim().length === 0) {
        throw new Error('Navn kan ikke være tomt');
    }
}
