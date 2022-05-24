import { DittNavEvent, Kanal, Varsel } from '../../models/varsel';

export const statiskVarselMock: Varsel[] = [
    {
        varselType: 'IkkeLevMeldekortNO',
        mottattTidspunkt: '2019-03-28',
        erRevarsling: false,
        meldingListe: [
            {
                kanal: Kanal.SMS,
                innhold: 'Meldingsinnhold',
                mottakerInformasjon: 'mottakerinfo',
                utsendingsTidspunkt: '2019-01-24',
                feilbeskrivelse: 'Feil',
                epostemne: 'Epostemne',
                url: 'http://test.com',
                erRevarsel: false
            },
            {
                kanal: Kanal.EPOST,
                innhold: 'Meldingsinnhold',
                mottakerInformasjon: 'mottakerinfo',
                utsendingsTidspunkt: '2019-03-01',
                feilbeskrivelse: 'Feil',
                epostemne: 'Epostemne',
                url: 'http://test.com',
                erRevarsel: false
            }
        ]
    },
    {
        varselType: 'IkkeLevMeldekortNO',
        mottattTidspunkt: '2019-01-10',
        erRevarsling: true,
        meldingListe: [
            {
                kanal: Kanal.EPOST,
                innhold: 'Meldingsinnhold',
                mottakerInformasjon: 'mottakerinfo',
                utsendingsTidspunkt: '2019-02-02',
                feilbeskrivelse: 'Feil',
                epostemne: 'Epostemne',
                url: 'http://test.com',
                erRevarsel: true
            }
        ]
    }
];

export const statiskDittnavEventVarselMock: DittNavEvent[] = [
    {
        fodselsnummer: '',
        grupperingsId: '',
        eventId: '',
        forstBehandlet: '2018-03-01',
        produsent: '',
        sikkerhetsnivaa: 4,
        sistOppdatert: '2018-04-01',
        tekst: 'Tekst her',
        link: '',
        aktiv: true
    }
];
