import * as faker from 'faker/locale/nb_NO';
import * as moment from 'moment';

import navfaker from 'nav-faker/dist/index';
import {
    Arbeidsforhold,
    Periode,
    Pleiepengeperiode,
    Pleiepengerettighet,
    PleiepengerResponse,
    Vedtak
} from '../../models/ytelse/pleiepenger';
import { backendDatoformat, fyllRandomListe } from '../utils/mock-utils';

export function getMockPleiepenger(fødselsnummer: string): PleiepengerResponse {
    faker.seed(Number(fødselsnummer));
    navfaker.seed(fødselsnummer + 'pleiepenger');

    if (navfaker.random.vektetSjanse(0.3)) {
        return {
            pleiepenger: []
        };
    }

    return {
        pleiepenger: fyllRandomListe<Pleiepengerettighet>(() => getMockPleiepengerettighet(fødselsnummer), 3)
    };
}

export function getMockPleiepengerettighet(fødselsnummer: string): Pleiepengerettighet {
    faker.seed(Number(fødselsnummer));
    navfaker.seed(fødselsnummer + 'pleiepenger');

    const pleiepengeDager = 1300;
    const forbrukteDager = navfaker.random.integer(pleiepengeDager);
    const restDager = pleiepengeDager - forbrukteDager;
    return {
        barnet: navfaker.personIdentifikator.fødselsnummer(),
        omsorgsperson: fødselsnummer,
        andreOmsorgsperson: navfaker.personIdentifikator.fødselsnummer(),
        restDagerFomIMorgen: restDager,
        forbrukteDagerTomIDag: forbrukteDager,
        pleiepengedager: pleiepengeDager,
        restDagerAnvist: restDager,
        perioder: fyllRandomListe<Pleiepengeperiode>(() => getPleiepengeperiode(), 10)
    };
}

function getPleiepengeperiode(): Pleiepengeperiode {
    return {
        fom: moment(faker.date.past(2)).format(backendDatoformat),
        antallPleiepengedager: navfaker.random.integer(100),
        arbeidsforhold: fyllRandomListe<Arbeidsforhold>(() => getArbeidsforhold(), 10),
        vedtak: fyllRandomListe<Vedtak>(() => getVedtak(), 10)
    };
}

function getArbeidsforhold(): Arbeidsforhold {
    return {
        arbeidsgiverNavn: faker.company.companyName(),
        arbeidsgiverKontonr: Number(faker.finance.account(9)).toString(),
        inntektsperiode: moment(faker.date.recent()).format(backendDatoformat),
        inntektForPerioden: Number(faker.commerce.price()),
        refusjonTom: moment(faker.date.recent()).format(backendDatoformat),
        refusjonstype: 'REFUSJONTYPE',
        arbeidsgiverOrgnr: '1234567890',
        arbeidskategori: 'ARBKAT'
    };
}

function getVedtak(): Vedtak {
    return {
        periode: getPeriode(),
        kompensasjonsgrad: navfaker.random.vektetSjanse(.5) ? 100 : navfaker.random.integer(100),
        utbetalingsgrad: navfaker.random.vektetSjanse(.5) ? 100 : navfaker.random.integer(100),
        anvistUtbetaling: 'ANVIST',
        bruttobeløp: Number(faker.commerce.price()),
        dagsats: navfaker.random.integer(70),
        pleiepengegrad: navfaker.random.integer(60)
    };
}

function getPeriode(): Periode {
    const fom = moment(faker.date.past(2));
    const tom = moment(fom).add(faker.random.number(40), 'days');
    return {
        fom: fom.format(backendDatoformat),
        tom: tom.format(backendDatoformat)
    };
}