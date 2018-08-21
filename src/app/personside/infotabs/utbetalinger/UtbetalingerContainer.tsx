import * as React from 'react';
import Utbetalinger from './Utbetalinger';
import { AppState } from '../../../../redux/reducers';
import { connect, Dispatch } from 'react-redux';
import { RestReducer } from '../../../../redux/restReducers/restReducer';
import { UtbetalingerResponse } from '../../../../models/utbetalinger';
import Innholdslaster from '../../../../components/Innholdslaster';
import { STATUS } from '../../../../redux/restReducers/utils';
import { Action } from 'redux';
import { hentUtbetalinger, reloadUtbetalinger } from '../../../../redux/restReducers/utbetalinger';
import { FilterState, default as Filtrering, PeriodeValg } from './Filter';
import moment = require('moment');
import { getFraDateFromFilter, getTilDateFromFilter } from './utbetalingerUtils';
import { restoreScroll } from '../../../../utils/restoreScroll';
import theme from '../../../../styles/personOversiktTheme';
import styled from 'styled-components';
import TittelOgIkon from '../../visittkort/body/IkonOgTittel';
import { Undertittel } from 'nav-frontend-typografi';
import Coins from '../../../../svg/Coins';

interface State {
    filter: FilterState;
}

const initialState: State = {
    filter: {
        periode: {
            radioValg: PeriodeValg.SISTE_30_DAGER,
            egendefinertPeriode: {
                fra: moment().subtract(1, 'year').toDate(),
                til: new Date()
            }
        },
        utbetaltTil: {
            bruker: true,
            annenMottaker: true
        },
        ytelse: {
            alleYtelser: true
        }
    }
};

interface StateProps {
    utbetalingerReducer: RestReducer<UtbetalingerResponse>;
}

interface DispatchProps {
    hentUtbetalinger: (fødselsnummer: string, fra: Date, til: Date) => void;
    reloadUtbetalinger: (fødselsnummer: string, fra: Date, til: Date) => void;
}

interface OwnProps {
    fødselsnummer: string;
}

type Props = StateProps & DispatchProps & OwnProps;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  @media(max-width: 1100px) {
    display: block;
  }
`;

const Venstre = styled.div`
  > *:first-child {
    margin-left: 50px;
  }  
  flex-basis: 16em;
  flex-shrink: 1;
  background-color: white;
  border-radius: ${theme.borderRadius.layout};
  padding: 1.2rem;
`;

const Hoyre = styled.div`
  flex-grow: 1;
  border-radius: ${theme.borderRadius.layout};
  background-color: white;
  @media not all and (max-width: 1100px) {
      margin-left: ${theme.margin.layout};
  }
`;

const Opacity = styled.span`
  opacity: .5;
`;

class UtbetalingerContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
        this.onFilterChange = this.onFilterChange.bind(this);
    }

    onFilterChange(change: Partial<FilterState>) {
        this.setState(
            {
                filter: {
                    ...this.state.filter,
                    ...change
                }
            },
            () => this.reloadUtbetalinger()
        );
    }

    reloadUtbetalinger() {
        const fra = getFraDateFromFilter(this.state.filter);
        const til = getTilDateFromFilter(this.state.filter);
        this.props.reloadUtbetalinger(this.props.fødselsnummer, fra, til);
    }

    componentDidMount() {
        if (this.props.utbetalingerReducer.status === STATUS.NOT_STARTED) {
            this.props.hentUtbetalinger(
                this.props.fødselsnummer,
                getFraDateFromFilter(this.state.filter),
                getTilDateFromFilter(this.state.filter)
            );
        }
    }

    render() {
        return (
            <Wrapper>
                <Venstre onClick={restoreScroll}>
                    <TittelOgIkon tittel={<Undertittel>Utbetalinger</Undertittel>} ikon={<Opacity><Coins/></Opacity>}/>
                    <Filtrering filterState={this.state.filter} onChange={this.onFilterChange}/>
                </Venstre>
                <Hoyre>
                    <Innholdslaster avhengigheter={[this.props.utbetalingerReducer]}>
                        <Utbetalinger
                            utbetalinger={this.props.utbetalingerReducer.data.utbetalinger}
                            onFilterChange={this.onFilterChange}
                            filter={this.state.filter}
                        />
                    </Innholdslaster>
                </Hoyre>
            </Wrapper>
        );
    }
}

function mapStateToProps(state: AppState): StateProps {
    return ({
        utbetalingerReducer: state.restEndepunkter.utbetalingerReducer
    });
}

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        hentUtbetalinger: (fødselsnummer: string, fra: Date, til: Date) =>
            dispatch(hentUtbetalinger(fødselsnummer, fra, til)),
        reloadUtbetalinger: (fødselsnummer: string, fra: Date, til: Date) =>
            dispatch(reloadUtbetalinger(fødselsnummer, fra, til))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UtbetalingerContainer);
