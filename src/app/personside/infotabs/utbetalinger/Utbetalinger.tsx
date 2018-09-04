import * as React from 'react';
import { Utbetaling } from '../../../../models/utbetalinger';
import styled from 'styled-components';
import theme from '../../../../styles/personOversiktTheme';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import { FilterState } from './Filter';
import TotaltUtbetalt from './TotaltUtbetalt';
import { Bold, Uppercase } from '../../../../components/common-styled-components';
import { ArrayGroup, groupArray, GroupedArray } from '../../../../utils/groupArray';
import {
    getGjeldendeDatoForUtbetaling, getTypeFromYtelse,
    månedOgÅrForUtbetaling,
    reduceUtbetlingerTilYtelser,
    utbetalingDatoComparator
} from './utbetalingerUtils';
import UtbetalingKomponent from './Utbetaling';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

export interface UtbetalingerProps {
    utbetalinger: Utbetaling[];
    filter: FilterState;
}

const MånedGruppeStyle = styled.li`
  > *:first-child {
    background-color: ${theme.color.bakgrunn};
    padding: .2rem 1.2rem;
  }
  ol > * {
    border-top: solid 2px ${theme.color.bakgrunn};
  }
`;

const UtbetalingerStyle = styled.div`
  border-top: 1rem solid ${theme.color.bakgrunn};
  > *:first-child {
    padding: .5rem 1.2rem;
  }
`;

const Wrapper = styled.div`
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  table {
    width: 100%;
    text-align: right;
    border-spacing: 0;
    * {
      padding: 0;
      margin: 0;
    }
    tr {
      > * {
        padding: 0.1rem;
        text-align: right;
      }
      > *:first-child {
        text-align: left;
      }
      > *:not(:first-child) {
        width: 6rem;
      }
    }
  }
`;

function Månedsgruppe({gruppe}: { gruppe: ArrayGroup<Utbetaling> }) {
    const utbetalingsKomponenter = gruppe.array.map(utbetaling => (
        <UtbetalingKomponent
            utbetaling={utbetaling}
            key={getGjeldendeDatoForUtbetaling(utbetaling) + utbetaling.nettobeløp}
        />
    ));
    return (
        <MånedGruppeStyle>
            <Undertekst tag={'h3'}><Bold><Uppercase>{gruppe.category}</Uppercase></Bold></Undertekst>
            <ol>
                {utbetalingsKomponenter}
            </ol>
        </MånedGruppeStyle>
    );
}

function getFiltrerteUtbetalinger(utbetalinger: Utbetaling[], filter: FilterState) {
    return utbetalinger
        .filter(utbetaling => filtrerPaUtbetaltTilValg(utbetaling, filter))
        .filter(utbetaling => filtrerPaYtelseValg(utbetaling, filter));
}

function filtrerPaUtbetaltTilValg(utbetaling: Utbetaling, filter: FilterState) {
    return filter.utbetaltTil.includes(utbetaling.utbetaltTil);
}

function filtrerPaYtelseValg(utbetaling: Utbetaling, filter: FilterState) {
    const ytelsesTyperIUtbetaling =
        reduceUtbetlingerTilYtelser([utbetaling])
            .map(getTypeFromYtelse);
    return filter.ytelser.some(
        valgtYtelse => ytelsesTyperIUtbetaling.includes(valgtYtelse)
    );
}

function Utbetalinger(props: UtbetalingerProps) {
    const filtrerteUtbetalinger = getFiltrerteUtbetalinger(props.utbetalinger, props.filter);
    if (filtrerteUtbetalinger.length === 0) {
        return (
            <AlertStripeInfo>
                Det finnes ingen utbetalinger for valgte kombinasjon av periode og filtrering.
            </AlertStripeInfo>
        );
    }

    const utbetalingerGruppert: GroupedArray<Utbetaling> = groupArray(
        filtrerteUtbetalinger.sort(utbetalingDatoComparator),
        månedOgÅrForUtbetaling
    );
    const månedsGrupper = utbetalingerGruppert.map((gruppe: ArrayGroup<Utbetaling>) =>
        <Månedsgruppe gruppe={gruppe} key={gruppe.category}/>
    );

    return (
        <Wrapper>
            <TotaltUtbetalt utbetalinger={filtrerteUtbetalinger} filter={props.filter}/>
            <UtbetalingerStyle>
                <Undertittel>Utbetalinger</Undertittel>
                <ol>
                    {månedsGrupper}
                </ol>
            </UtbetalingerStyle>
        </Wrapper>
    );
}

export default Utbetalinger;
