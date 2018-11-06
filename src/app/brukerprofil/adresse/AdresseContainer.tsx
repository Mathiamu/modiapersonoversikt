import * as React from 'react';
import { connect } from 'react-redux';

import { Person } from '../../../models/person/person';
import { AppState } from '../../../redux/reducers';
import { KodeverkResponse } from '../../../models/kodeverk';
import Innholdslaster from '../../../components/Innholdslaster';
import { hentPostnummere } from '../../../redux/restReducers/kodeverk/postnummerReducer';
import { STATUS } from '../../../redux/restReducers/utils';
import AdresseForm from './AdresseForm';
import {
    endreMatrikkeladresse,
    endreNorskGateadresse,
    endrePostboksadrese,
    endreUtlandsadresse,
    reset,
    slettMidlertidigeAdresser
} from '../../../redux/restReducers/brukerprofil/endreAdresseReducer';
import { Gateadresse, Matrikkeladresse, Postboksadresse, Utlandsadresse } from '../../../models/personadresse';
import { VeilederRoller } from '../../../models/veilederRoller';
import { Undertittel } from 'nav-frontend-typografi';
import { reloadPerson } from '../../../redux/restReducers/personinformasjon';
import { RestReducer } from '../../../redux/restReducers/restReducer';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

interface StateProps {
    postnummerReducer: RestReducer<KodeverkResponse>;
    endreAdresseReducer: RestReducer<{}>;
}

interface DispatchProps {
    hentPostnummerKodeverk: () => void;
    endreNorskGateadresse: (fødselsnummer: string, gateadresse: Gateadresse) => void;
    endreMatrikkeladresse: (fødselsnummer: string, matrikkeladresse: Matrikkeladresse) => void;
    endrePostboksadresse: (fødselsnummer: string, postboksadresse: Postboksadresse) => void;
    endreUtlandsadresse: (fødselsnummer: string, utlandsadresse: Utlandsadresse) => void;
    slettMidlertidigeAdresser: (fødselsnummer: string) => void;
    resetEndreAdresseReducer: () => void;
    reloadPerson: (fødselsnummer: string) => void;
}

interface OwnProps {
    person: Person;
    veilederRoller: VeilederRoller;
}

class AdresseFormContainer extends React.Component<StateProps & DispatchProps & OwnProps> {

    componentDidMount() {
        if (this.props.postnummerReducer.status === STATUS.NOT_STARTED) {
            this.props.hentPostnummerKodeverk();
        }
    }

    componentWillUnmount() {
        this.props.resetEndreAdresseReducer();
    }

    render() {
        return (
            <div>
                <Undertittel>Adresse</Undertittel>
                <Innholdslaster avhengigheter={[this.props.postnummerReducer]}>
                    <AdresseForm
                        veilederRoller={this.props.veilederRoller}
                        person={this.props.person}
                        endreNorskGateadresse={this.props.endreNorskGateadresse}
                        endreMatrikkeladresse={this.props.endreMatrikkeladresse}
                        endrePostboksadresse={this.props.endrePostboksadresse}
                        endreUtlandsadresse={this.props.endreUtlandsadresse}
                        slettMidlertidigeAdresser={this.props.slettMidlertidigeAdresser}
                        resetEndreAdresseReducer={this.props.resetEndreAdresseReducer}
                        endreAdresseReducer={this.props.endreAdresseReducer}
                        reloadPersonInfo={this.props.reloadPerson}
                    />
                </Innholdslaster>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return ({
        postnummerReducer: state.restEndepunkter.postnummerReducer,
        endreAdresseReducer: state.restEndepunkter.endreAdresseReducer
    });
};

function mapDispatchToProps(dispatch: ThunkDispatch<AppState, undefined, AnyAction>): DispatchProps {
    return {
        hentPostnummerKodeverk: () => dispatch(hentPostnummere()),
        endreNorskGateadresse: (fødselsnummer: string, gateadresse: Gateadresse) =>
            dispatch(endreNorskGateadresse(fødselsnummer, gateadresse)),
        endreMatrikkeladresse: (fødselsnummer: string, matrikkeladresse: Matrikkeladresse) =>
            dispatch(endreMatrikkeladresse(fødselsnummer, matrikkeladresse)),
        endrePostboksadresse: (fødselsnummer: string, postboksadresse: Postboksadresse) =>
            dispatch(endrePostboksadrese(fødselsnummer, postboksadresse)),
        endreUtlandsadresse: (fødselsnummer: string, utlandsadresse: Utlandsadresse) =>
            dispatch(endreUtlandsadresse(fødselsnummer, utlandsadresse)),
        slettMidlertidigeAdresser: fødselsnummer => dispatch(slettMidlertidigeAdresser(fødselsnummer)),
        resetEndreAdresseReducer: () => dispatch(reset()),
        reloadPerson: (fødselsnummer: string) => dispatch(reloadPerson(fødselsnummer))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdresseFormContainer);