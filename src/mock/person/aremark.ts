import { Diskresjonskoder } from '../../constants';
import { Kjønn, Person } from '../../models/person';

export const aremark: Person = {
    fødselsnummer: '10108000398',
    kjønn: Kjønn.Mann,
    geografiskTilknytning: '0118',
    alder: 42,
    navn: {
        sammensatt: 'AREMARK TESTFAMILIEN',
        fornavn: 'AREMARK',
        mellomnavn: '',
        etternavn: 'TESTFAMILIEN',
    },
    diskresjonskode: Diskresjonskoder.FORTROLIG_ADRESSE,
    statsborgerskap: 'NORSK',
    personstatus: {
        dødsdato: undefined,
        bostatus: undefined
    },
    sivilstand: {
        value: 'GIFT',
        beskrivelse: 'Gift'
    },
    familierelasjoner: []
};