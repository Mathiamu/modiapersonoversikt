import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../../redux/reducers';
import { Person, PersonRespons } from '../../../../../models/person/person';
import { RestReducer } from '../../../../../redux/restReducers/restReducer';
import Etiketter from './Etiketter';
import styled from 'styled-components/macro';
import PlukkRestData from '../../../infotabs/ytelser/pleiepenger/PlukkRestData';
import ErrorBoundary from '../../../../../components/ErrorBoundary';

interface Props {
    personReducer: RestReducer<PersonRespons>;
}

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

function EtiketterContainer(props: Props) {
    return (
        <ErrorBoundary boundaryName="Etiketter">
            <Wrapper>
                <PlukkRestData restReducer={props.personReducer}>
                    {data => <Etiketter person={data as Person} />}
                </PlukkRestData>
            </Wrapper>
        </ErrorBoundary>
    );
}

const mapStateToProps = (state: AppState) => {
    return {
        personReducer: state.restEndepunkter.personinformasjon
    };
};

export default connect(
    mapStateToProps,
    null
)(EtiketterContainer);
