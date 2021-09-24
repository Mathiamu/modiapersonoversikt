import MockDate from 'mockdate';
import { Utbetaling, Ytelse } from '../../../../../models/utbetalinger';
import { getMockUtbetaling, getMockYtelse } from '../../../../../mock/utbetalinger/utbetalinger-mock';
import {
    filtrerBortUtbetalingerSomIkkeErUtbetalt,
    getBruttoSumYtelser,
    getFraDateFromFilter,
    getGjeldendeDatoForUtbetaling,
    getNettoSumYtelser,
    getPeriodeFromYtelser,
    getTilDateFromFilter,
    getTrekkSumYtelser,
    getTypeFromYtelse,
    maanedOgAarForUtbetaling,
    periodeStringFromYtelse,
    reduceUtbetlingerTilYtelser,
    summertBeløpStringFraUtbetalinger,
    utbetalingDatoComparator
} from './utbetalinger-utils';
import dayjs from 'dayjs';
import { statiskMockUtbetaling, statiskMockYtelse } from '../../../../../mock/utbetalinger/statiskMockUtbetaling';
import { Periode } from '../../../../../models/tid';
import { PeriodeValg, UtbetalingFilterState } from '../../../../../redux/utbetalinger/types';
import { ISO_DATE_STRING_FORMAT } from 'nav-datovelger/lib/utils/dateFormatUtils';

Date.now = () => new Date().getTime(); // for å motvirke Date.now() mock i setupTests.ts

const randomUtbetaling = getMockUtbetaling();

const randomUtbetalingUtenDato: Utbetaling = {
    ...randomUtbetaling,
    forfallsdato: null,
    utbetalingsdato: null
};
const randomYtelse = getMockYtelse();

beforeEach(() => {
    MockDate.reset();
});

test('lager riktig måned og år string for utbetaling', () => {
    const utbetaling: Utbetaling = {
        ...randomUtbetaling,
        utbetalingsdato: '1986-12-28'
    };

    const result = maanedOgAarForUtbetaling(utbetaling);

    expect(result).toEqual('Desember 1986');
});

test('returnerer tellende dato for utbetaling', () => {
    const utbetalingMedPosteringsdato: Utbetaling = {
        ...randomUtbetalingUtenDato,
        posteringsdato: '1900-01-01'
    };

    const utbetalingMedForfallsDato: Utbetaling = {
        ...utbetalingMedPosteringsdato,
        forfallsdato: '1950-01-01'
    };

    const utbetalingMedUtbetalingsDato: Utbetaling = {
        ...utbetalingMedForfallsDato,
        utbetalingsdato: '2000-01-01'
    };

    expect(getGjeldendeDatoForUtbetaling(utbetalingMedPosteringsdato)).toEqual('1900-01-01');
    expect(getGjeldendeDatoForUtbetaling(utbetalingMedForfallsDato)).toEqual('1950-01-01');
    expect(getGjeldendeDatoForUtbetaling(utbetalingMedUtbetalingsDato)).toEqual('2000-01-01');
});

test('lager riktig periodestreng for ytelse', () => {
    const ytelse: Ytelse = {
        ...randomYtelse,
        periode: {
            start: '2010-01-01',
            slutt: '2015-01-01'
        }
    };

    const periodestreng = periodeStringFromYtelse(ytelse);

    expect(periodestreng).toEqual('01.01.2010 - 01.01.2015');
});

test('sorterer utbetalinger etter dato', () => {
    const utbetalingerFør: Utbetaling[] = [
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1900-12-28'
        },
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1930-12-28',
            utbetalingsdato: '1986-12-28'
        },
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1800-12-28',
            forfallsdato: '1950-12-28'
        }
    ];

    const utbetalingerEtter: Utbetaling[] = [
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1930-12-28',
            utbetalingsdato: '1986-12-28'
        },
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1800-12-28',
            forfallsdato: '1950-12-28'
        },
        {
            ...randomUtbetalingUtenDato,
            posteringsdato: '1900-12-28'
        }
    ];

    const sorterteUtbetalinger = utbetalingerFør.sort(utbetalingDatoComparator);

    expect(utbetalingerEtter).toEqual(sorterteUtbetalinger);
});

test('summerer netto utbetaling riktig', () => {
    const ytelser: Ytelse[] = [
        {
            ...randomYtelse,
            nettobeløp: 100
        },
        {
            ...randomYtelse,
            nettobeløp: 200
        }
    ];

    const sumForYtelser = getNettoSumYtelser(ytelser);

    expect(sumForYtelser).toEqual(300);
});

test('summerer brutto utbetaling riktig', () => {
    const ytelser: Ytelse[] = [
        {
            ...randomYtelse,
            ytelseskomponentersum: 100
        },
        {
            ...randomYtelse,
            ytelseskomponentersum: 500
        }
    ];

    const sumForYtelser = getBruttoSumYtelser(ytelser);

    expect(sumForYtelser).toEqual(600);
});

test('summerer trekk riktig', () => {
    const ytelser: Ytelse[] = [
        {
            ...randomYtelse,
            skattsum: -100,
            trekksum: 0
        },
        {
            ...randomYtelse,
            skattsum: -200,
            trekksum: -100
        }
    ];

    const trekkForYtelser = getTrekkSumYtelser(ytelser);

    expect(trekkForYtelser).toEqual(-400);
});

test('summerer beløp på tvers av utbetalinger', () => {
    const randomTellendeUtbetaling = {
        ...randomUtbetaling,
        status: 'Utbetalt',
        utbetalingsdato: '2010-01-01'
    };

    const utbetalinger: Utbetaling[] = [
        {
            ...randomTellendeUtbetaling,
            ytelser: [
                {
                    ...randomYtelse,
                    nettobeløp: 200
                },
                {
                    ...randomYtelse,
                    nettobeløp: 200
                }
            ]
        },
        {
            ...randomTellendeUtbetaling,
            ytelser: [
                {
                    ...randomYtelse,
                    nettobeløp: 200
                }
            ]
        },
        {
            ...randomUtbetaling,
            status: 'Returnert til NAV',
            ytelser: [
                {
                    ...randomYtelse,
                    nettobeløp: 10000
                }
            ]
        }
    ];

    const summert = summertBeløpStringFraUtbetalinger(utbetalinger, getNettoSumYtelser);

    expect(summert.replace(/\s/g, '').replace(',', '.')).toEqual('600.00');
});

const mockFilter: UtbetalingFilterState = {
    periode: {
        radioValg: PeriodeValg.SISTE_30_DAGER,
        egendefinertPeriode: {
            fra: dayjs().format(ISO_DATE_STRING_FORMAT),
            til: dayjs().format(ISO_DATE_STRING_FORMAT)
        }
    },
    ytelser: [],
    utbetaltTil: []
};

test('henter riktig fra og til-date fra filter ved valg av "siste 30 dager"', () => {
    const filter: UtbetalingFilterState = {
        ...mockFilter,
        periode: {
            ...mockFilter.periode,
            radioValg: PeriodeValg.SISTE_30_DAGER
        }
    };

    const fraDate: Date = getFraDateFromFilter(filter);
    const tilDate: Date = getTilDateFromFilter(filter);

    expect(dayjs(fraDate).toString()).toEqual(
        dayjs()
            .subtract(30, 'day')
            .startOf('day')
            .toString()
    );
    expect(dayjs(tilDate).toString()).toEqual(
        dayjs()
            .add(100, 'day')
            .endOf('day')
            .toString()
    );
});

test('henter riktig fra og til-date fra filter ved valg av "inneværende år', () => {
    const filter: UtbetalingFilterState = {
        ...mockFilter,
        periode: {
            ...mockFilter.periode,
            radioValg: PeriodeValg.INNEVERENDE_AR
        }
    };

    const fraDate: Date = getFraDateFromFilter(filter);
    const tilDate: Date = getTilDateFromFilter(filter);

    expect(dayjs(fraDate).toString()).toEqual(
        dayjs()
            .startOf('year')
            .toString()
    );
    expect(dayjs(tilDate).toString()).toEqual(
        dayjs()
            .add(100, 'day')
            .endOf('day')
            .toString()
    );
});

test('henter riktig fra og til-date fra filter ved valg av "i fjor', () => {
    const filter: UtbetalingFilterState = {
        ...mockFilter,
        periode: {
            ...mockFilter.periode,
            radioValg: PeriodeValg.I_FJOR
        }
    };

    const fraDate: Date = getFraDateFromFilter(filter);
    const tilDate: Date = getTilDateFromFilter(filter);

    expect(dayjs(fraDate).toString()).toEqual(
        dayjs()
            .subtract(1, 'year')
            .startOf('year')
            .toString()
    );
    expect(dayjs(tilDate).toString()).toEqual(
        dayjs()
            .subtract(1, 'year')
            .endOf('year')
            .toString()
    );
});

test('henter riktig fra og til-date fra filter ved valg av "egendefinert periode', () => {
    const dato = dayjs(0);
    const filter: UtbetalingFilterState = {
        ...mockFilter,
        periode: {
            egendefinertPeriode: {
                fra: dato.format(ISO_DATE_STRING_FORMAT),
                til: dato.format(ISO_DATE_STRING_FORMAT)
            },
            radioValg: PeriodeValg.EGENDEFINERT
        }
    };

    const fraDate: Date = getFraDateFromFilter(filter);
    const tilDate: Date = getTilDateFromFilter(filter);
    expect(dayjs(fraDate).isSame(dato, 'day')).toBeTruthy();
    expect(dayjs(tilDate).isSame(dato, 'day')).toBeTruthy();
});

test('filtrerer bort utbetalinger som ikke er utbetalt', () => {
    const mockUtbetalingReturnertForSaksbehandling: Utbetaling = {
        ...statiskMockUtbetaling,
        status: 'Returnert til NAV for saksbehandling'
    };

    const utbetalinger = [statiskMockUtbetaling, mockUtbetalingReturnertForSaksbehandling];

    const result: Utbetaling[] = utbetalinger.filter(filtrerBortUtbetalingerSomIkkeErUtbetalt);

    expect(result.length).toEqual(1);
});

test('finner riktig periode fra ytelser', () => {
    const ytelser: Ytelse[] = [
        {
            ...statiskMockYtelse,
            periode: {
                start: '2000-01-01',
                slutt: '2010-01-01'
            }
        },
        {
            ...statiskMockYtelse,
            periode: {
                start: '2005-12-12',
                slutt: '2015-12-12'
            }
        }
    ];

    const expextedResult: Periode = {
        fra: '2000-01-01',
        til: '2015-12-12'
    };
    const result = getPeriodeFromYtelser(ytelser);

    expect(result).toEqual(expextedResult);
});

test('returnerer liste med ytelser fra liste med utbetalinger', () => {
    const utbetalinger: Utbetaling[] = [
        {
            ...statiskMockUtbetaling,
            ytelser: [statiskMockYtelse]
        },
        {
            ...statiskMockUtbetaling,
            ytelser: [statiskMockYtelse, statiskMockYtelse]
        }
    ];

    const result = reduceUtbetlingerTilYtelser(utbetalinger);

    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(statiskMockYtelse);
});

test('finner riktig type for ytelse', () => {
    const ytelse: Ytelse = {
        ...statiskMockYtelse,
        type: 'Lørdagsgodt'
    };

    const ytelse2: Ytelse = {
        ...statiskMockYtelse,
        type: null
    };

    const result = getTypeFromYtelse(ytelse);
    const result2 = getTypeFromYtelse(ytelse2);

    expect(result).toEqual('Lørdagsgodt');
    expect(result2).toEqual('Mangler beskrivelse');
});
