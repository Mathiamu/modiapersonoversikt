import { fyllRandomListe, vektetSjanse } from '../utils/mock-utils';
import {
    Adressat,
    AdvokatSomAdressat,
    Doedsbo,
    KontaktpersonMedId,
    KontaktpersonUtenId,
    OrganisasjonSomAdressat,
    Personnavn
} from '../../models/person/doedsbo';

export function getMockDoedsbo(faker: Faker.FakerStatic): Doedsbo[] | undefined {
    if (vektetSjanse(faker, 0.5)) {
        return undefined;
    }

    return fyllRandomListe<Doedsbo>(() => mockDoedsbo(faker), 2, false);
}

function mockDoedsbo(faker: Faker.FakerStatic): Doedsbo {
    return {
        adressat: mockAdressat(faker),
        adresselinje1: faker.address.streetAddress(),
        adresselinje2: faker.address.city(),
        postnummer: faker.address.zipCode('####'),
        poststed: faker.address.city().toUpperCase(),
        landkode: vektetSjanse(faker, 0.5) ? faker.address.countryCode() : undefined,
        master: 'Folkeregisteret',
        registrert: '2018-10-26T12:47:18.752Z'
    };
}

function mockAdressat(faker: Faker.FakerStatic): Adressat {
    if (vektetSjanse(faker, 0.2)) {
        return {
            advokatSomAdressat: mockAdvokatSomAdressat(faker)
        };
    } else if (vektetSjanse(faker, 0.2)) {
        return {
            organisasjonSomAdressat: mockOrganisasjonSomAdressat(faker)
        };
    } else if (vektetSjanse(faker, 0.2)) {
        return {
            kontaktpersonUtenIdNummerSomAdressat: mockKontaktpersonUtenId(faker)
        };
    } else {
        return {
            kontaktpersonMedIdNummerSomAdressat: mockKontaktpersonMedId(faker)
        };
    }
}

function mockAdvokatSomAdressat(faker: Faker.FakerStatic): AdvokatSomAdressat {
    return {
        kontaktperson: mockPersonnavn(faker),
        organisasjonsnavn: faker.company.companyName()
    };
}

function mockOrganisasjonSomAdressat(faker: Faker.FakerStatic): OrganisasjonSomAdressat {
    return {
        organisasjonsnavn: faker.company.companyName(),
        organisasjonsnummer: faker.random.number()
    };
}

function mockKontaktpersonUtenId(faker: Faker.FakerStatic): KontaktpersonUtenId {
    return {
        foedselsdato: '1980-01-01',
        navn: mockPersonnavn(faker)
    };
}

function mockKontaktpersonMedId(faker: Faker.FakerStatic): KontaktpersonMedId {
    const navn = vektetSjanse(faker, 0.5) ? mockPersonnavn(faker) : undefined;
    return {
        idNummer: faker.random.number(),
        navn: navn
    };
}

function mockPersonnavn(faker: Faker.FakerStatic): Personnavn {
    return {
        fornavn: faker.name.firstName(),
        etternavn: faker.name.lastName()
    };
}
