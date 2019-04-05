import * as React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import NavFrontendSpinner from 'nav-frontend-spinner';
import AlertStripe from 'nav-frontend-alertstriper';

import { AppState } from '../../redux/reducers';
import { BegrensetTilgang, erPersonResponsAvTypeBegrensetTilgang, PersonRespons } from '../../models/person/person';
import FillCenterAndFadeIn from '../../components/FillCenterAndFadeIn';
import BegrensetTilgangSide from '../../app/personside/BegrensetTilgangSide';
import { DeprecatedRestResource } from '../../redux/restReducers/deprecatedRestResource';
import Visittkort from '../../app/personside/visittkort/VisittkortContainer';
import PlukkRestDataDeprecated from '../../app/personside/infotabs/ytelser/pleiepenger/PlukkRestDataDeprecated';

interface OwnProps {
    fødselsnummer: string;
}

interface PersonsideStateProps {
    personResource: DeprecatedRestResource<PersonRespons>;
}

type Props = OwnProps & PersonsideStateProps;

const Margin = styled.div`
    margin: 0.5em;
`;

const onPending = (
    <FillCenterAndFadeIn>
        <Margin>
            <NavFrontendSpinner type={'XL'} />
        </Margin>
    </FillCenterAndFadeIn>
);

const onError = (
    <FillCenterAndFadeIn>
        <AlertStripe type="advarsel">Beklager. Det skjedde en feil ved lasting av persondata.</AlertStripe>
    </FillCenterAndFadeIn>
);

class Personside extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    getSideinnhold(data: PersonRespons) {
        if (erPersonResponsAvTypeBegrensetTilgang(data)) {
            return <BegrensetTilgangSide person={data as BegrensetTilgang} />;
        } else {
            return <Visittkort />;
        }
    }

    render() {
        return (
            <PlukkRestDataDeprecated
                restResource={this.props.personResource}
                returnOnPending={onPending}
                returnOnError={onError}
            >
                {data => this.getSideinnhold(data)}
            </PlukkRestDataDeprecated>
        );
    }
}

function mapStateToProps(state: AppState): PersonsideStateProps {
    return {
        personResource: state.restResources.personinformasjon
    };
}

export default connect(mapStateToProps)(Personside);
