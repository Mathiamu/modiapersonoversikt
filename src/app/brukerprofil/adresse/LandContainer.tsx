import { Action } from 'history';
import { STATUS } from '../../../redux/utils';
import styled from 'styled-components';
import { AppState, RestReducer } from '../../../redux/reducer';
import { connect, Dispatch } from 'react-redux';
import * as React from 'react';
import { Kodeverk, KodeverkResponse } from '../../../models/kodeverk';
import { hentLand } from '../../../redux/kodeverk/landKodeverk';
import Innholdslaster from '../../../components/Innholdslaster';
import { Land } from './LandInput';
import { InputState } from '../formUtils';
import { Utlandsadresse } from '../../../models/personadresse';

interface DispatchProps {
    hentLand: () => void;
}

interface StateProps {
    landReducer: RestReducer<KodeverkResponse>;
}

interface OwnProps {
    midlertidigAdresseUtland: Utlandsadresse;
    landChanged: (input: Kodeverk) => void;
    state: InputState;
}

type Props = OwnProps & DispatchProps & StateProps;

const LandContainerWrapper = styled.div`
  margin-top: 2em;
`;

class LandContainer extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.landReducer.status === STATUS.NOT_STARTED) {
            this.props.hentLand();
        }
    }

    render() {
        return (
            <div>
                <Innholdslaster avhengigheter={[this.props.landReducer]}>
                    <LandContainerWrapper>
                        <Land
                            visFeilmeldinger={false}
                            landKodeverk={this.props.landReducer.data}
                            midlertidigAdresseUtland={this.props.midlertidigAdresseUtland}
                            onChange={this.props.landChanged}
                        />
                    </LandContainerWrapper>
                </Innholdslaster>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => {
    return ({
        landReducer: state.landReducer,
    });
};

function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        hentLand: () => dispatch(hentLand())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandContainer);
