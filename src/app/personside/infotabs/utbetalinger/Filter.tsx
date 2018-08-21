import * as React from 'react';
import styled from 'styled-components';
import { Checkbox, Radio } from 'nav-frontend-skjema';
import { Element } from 'nav-frontend-typografi';
import EtikettMini from '../../../../components/EtikettMini';
import NavDatovelger from 'nav-datovelger';
import { Feilmelding } from '../../../../utils/Feilmelding';
import * as moment from 'moment';

export interface FilterState {
    periode: PeriodeOptions;
    utbetaltTil: UtbetaltTilValg;
    ytelse: Ytelse;
}

interface UtbetaltTilValg {
    bruker: boolean;
    annenMottaker: boolean;
}

interface PeriodeOptions {
    radioValg: PeriodeValg;
    egendefinertPeriode: FraTilDato;
}

export interface FraTilDato {
    fra: Date;
    til: Date;
}

interface Ytelse {
    alleYtelser: boolean;
}

interface Props {
    onChange: (change: Partial<FilterState>) => void;
    filterState: FilterState;
}

export enum PeriodeValg {
    SISTE_30_DAGER = 'Siste 30 dager',
    INNEVÆRENDE_ÅR = 'Inneværende år',
    I_FJOR = 'I fjor',
    EGENDEFINERT = 'Egendefinert'
}

const FiltreringsPanel = styled.nav`
  > *:first-child {
    margin-top: 2em;
  }
`;

const InputPanel = styled.form`
  margin-top: 1em;
  margin-bottom: 1em;
  > *:not(:last-child) {
    margin-bottom: 1em;
  }
`;

const Opacity = styled.span`
  opacity: .5;
`;

function onRadioChange(props: Props, key: PeriodeValg) {
    props.onChange({
        periode: {
            ...props.filterState.periode,
            radioValg: key
        }
    });
}

function onDatoChange(props: Props, dato: Partial<FraTilDato>) {
    const newPeriode: FraTilDato = {
        fra: dato.fra && moment(dato.fra).isValid()
            ? dato.fra
            : new Date(props.filterState.periode.egendefinertPeriode.fra),
        til: dato.til && moment(dato.til).isValid()
            ? dato.til
            : new Date(props.filterState.periode.egendefinertPeriode.til)
    };
    props.onChange({
        periode: {
            ...props.filterState.periode,
            egendefinertPeriode: newPeriode
        }
    });
}

function onUtbetaltTilChange(props: Props, change: Partial<UtbetaltTilValg>) {
    props.onChange({
        utbetaltTil: {
            ...props.filterState.utbetaltTil,
            ...change
        }
    });
}

function onYtelseChange(props: Props, change: Partial<Ytelse>) {
    props.onChange({
        ytelse: {
            ...props.filterState.ytelse,
            ...change
        }
    });
}

function egendefinertDatoInputs(props: Props) {

    const fra = props.filterState.periode.egendefinertPeriode.fra;
    const til = props.filterState.periode.egendefinertPeriode.til;
    const periodeFeilmelding = fra && til && fra > til ?
        <Feilmelding feil={{feilmelding: 'Fra-dato kan ikke være senere enn til-dato'}}/> : null;

    return (
        <>
            <label htmlFor="utbetalinger-datovelger-fra">Fra:</label>
            <NavDatovelger
                dato={props.filterState.periode.egendefinertPeriode.fra}
                id={'utbetalinger-datovelger-fra'}
                onChange={dato => onDatoChange(props, {fra: dato})}
            />
            <label htmlFor="utbetalinger-datovelger-til">Til:</label>
            <NavDatovelger
                dato={props.filterState.periode.egendefinertPeriode.til}
                id={'utbetalinger-datovelger-til'}
                onChange={dato => onDatoChange(props, {til: dato})}
            />
            {periodeFeilmelding}
        </>
    );
}

function Filtrering(props: Props) {

    const radios = Object.keys(PeriodeValg).map(key => {
        const label = PeriodeValg[key];
        const checked = props.filterState.periode.radioValg === label;
        return (
            <Radio
                label={label}
                key={label}
                checked={checked}
                onChange={() => onRadioChange(props, PeriodeValg[key])}
                name="FiltreringsvalgGruppe"
            />);
    });

    return (
        <FiltreringsPanel>
            <Element>Filtrering</Element>

            <InputPanel>
                <EtikettMini><Opacity>Velg periode</Opacity></EtikettMini>
                {radios}
                {props.filterState.periode.radioValg === PeriodeValg.EGENDEFINERT && egendefinertDatoInputs(props)}
            </InputPanel>

            <InputPanel>
                <EtikettMini><Opacity>Utbetaling til</Opacity></EtikettMini>
                <Checkbox
                    label="Bruker"
                    checked={props.filterState.utbetaltTil.bruker}
                    onChange={() => onUtbetaltTilChange(props, {bruker: !props.filterState.utbetaltTil.bruker})}
                />
                <Checkbox
                    label="Annen mottaker"
                    checked={props.filterState.utbetaltTil.annenMottaker}
                    onChange={() => onUtbetaltTilChange(
                        props,
                        {annenMottaker: !props.filterState.utbetaltTil.annenMottaker}
                    )}
                />
            </InputPanel>

            <InputPanel>
                <EtikettMini><Opacity>Velg ytelse</Opacity></EtikettMini>
                <Checkbox
                    label="Alle"
                    checked={props.filterState.ytelse.alleYtelser}
                    onChange={() => onYtelseChange(props, {alleYtelser: !props.filterState.ytelse.alleYtelser})}
                />
            </InputPanel>

        </FiltreringsPanel>
    );
}

export default Filtrering;
