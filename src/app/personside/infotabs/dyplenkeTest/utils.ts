import { ReactWrapper } from 'enzyme';

export function getAktivTab(infoTabs: ReactWrapper) {
    return infoTabs.find('button[role="tab"][aria-selected=true]').text();
}

export const utbetalingerTest = {
    oversikt: 'test-utbetalinger-oversikt',
    utbetaling: 'test-utbetaling-utbetalinglamell'
};

export const ytelserTest = {
    oversikt: 'test-ytelse-oversikt',
    tittel: 'test-ytelser-tittel',
    ytelse: 'test-ytelse-ytelselamell'
};
