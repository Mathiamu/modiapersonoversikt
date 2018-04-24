import * as React from 'react';
import { connect } from 'react-redux';
import { Egenansatt } from '../../../../models/egenansatt';
import Innholdslaster from '../../../../components/Innholdslaster';
import { AppState, Reducer } from '../../../../redux/reducer';
import { Person } from "../../../../models/person";
import Etiketter from "./Etiketter";

interface Props {
    egenAnsattReducer: Reducer<Egenansatt>;
    personReducer: Reducer<Person>;
}

const onError = (
    <em>Problemer med å hente eventuell egenAnsatt-markering</em>
);

function EtikkerWrapper(props: { person?: Person, egenAnsatt?: Egenansatt }) {
    if ( !props.person) {
        return <p>Kunne ikke vise etikker</p>;
    }
    return <Etiketter person={props.person} egenAnsatt={props.egenAnsatt}/>;
}

class EtiketterContainer extends React.Component<Props> {

    render() {
        return (
            <Innholdslaster
                avhengigheter={[this.props.egenAnsattReducer, this.props.personReducer]}
                spinnerSize={'XXS'}
                returnOnError={onError}
            >
            <EtikkerWrapper person={this.props.personReducer.data} egenAnsatt={this.props.egenAnsattReducer.data}/>
            </Innholdslaster>
        );
    }
}

const mapStateToProps = (state: AppState) => {
    return ({
        egenAnsattReducer: state.egenAnsatt,
        personReducer: state.personinformasjon
    });
};

export default connect(mapStateToProps, null)(EtiketterContainer);