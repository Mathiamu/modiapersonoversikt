import * as React from 'react';
import styled from 'styled-components/macro';
import { Normaltekst } from 'nav-frontend-typografi';
import theme from '../../../styles/personOversiktTheme';
import EtikettGrå from '../../../components/EtikettGrå';
import { formatterDatoTid } from '../../../utils/dateUtils';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Tekstomrade from '../../../components/tekstomrade/tekstomrade';
import { useSendtMelding } from './useSendtMelding';

const PreviewStyle = styled.article`
    padding: 1rem;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: ${theme.borderRadius.layout};
    > * {
        margin-bottom: 0.5rem;
    }
    overflow-wrap: break-word;
`;

interface Props {
    tittel: string;
    fritekst: string;
}

function Preview(props: Props) {
    const sendtMelding = useSendtMelding(props.fritekst);

    const opprettetDato = sendtMelding.melding ? (
        <EtikettGrå>{formatterDatoTid(sendtMelding.melding.opprettetDato)}</EtikettGrå>
    ) : (
        <NavFrontendSpinner type="XXS" />
    );

    return (
        <PreviewStyle>
            <Normaltekst>{props.tittel}</Normaltekst>
            {opprettetDato}
            <Tekstomrade>{sendtMelding.melding?.fritekst || props.fritekst}</Tekstomrade>
        </PreviewStyle>
    );
}

export default Preview;
