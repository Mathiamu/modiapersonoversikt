import React from 'react';
import { FormStyle } from '../personside/dialogpanel/fellesStyling';
import { Normaltekst, Systemtittel, Undertekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import Tekstomrade from 'nav-frontend-tekstomrade';
import useNotifikasjoner from './useNotifikasjoner';
import { CenteredLazySpinner } from '../../components/LazySpinner';
import { AlertStripeInfo, AlertStripeFeil } from 'nav-frontend-alertstriper';
import styled from 'styled-components';
import { NotfikiasjonerVelger } from './NotifikasjonerVelger';
import Etikett from 'nav-frontend-etiketter';

const StyledPanel = styled(Panel)`
    margin: 1rem;
`;

const StyledPanelPrioritert = styled(Panel)`
    margin: 1rem;
    border-color: red;
    border-width: thick;
`;

const StyledEtikett = styled(Etikett)`
    margin: 0rem;
    background-color: red;
    color: black;
`;

function Notifikasjon() {
    const notifikasjoner = useNotifikasjoner();
    console.log(notifikasjoner);

    if (notifikasjoner.error) {
        return <AlertStripeFeil>Notifikasjoner er nede, vennligst prøv igjen senere.</AlertStripeFeil>;
    }
    if (notifikasjoner.data.length === 0) {
        return <AlertStripeInfo>Fant ingen notifikasjoner</AlertStripeInfo>;
    }
    if (notifikasjoner.pending) {
        return <CenteredLazySpinner />;
    }

    const notifikasjonArray = notifikasjoner.data.map(notifikasjon => {
        return notifikasjon;
    });

    const sortertNotifikasjonArray = notifikasjonArray.sort((a, b) => {
        return a.dato.localeCompare(b.dato);
    });

    sortertNotifikasjonArray.sort((a, b) => {
        return b.prioritet - a.prioritet;
    });

    const alleNotifikasjoner = sortertNotifikasjonArray.map(notifikasjon => {
        if (notifikasjon.prioritet === 1) {
            return (
                <StyledPanelPrioritert border>
                    <StyledEtikett type="advarsel">Viktig</StyledEtikett>
                    <Systemtittel>{notifikasjon.tittel}</Systemtittel>
                    <Undertekst>{notifikasjon.dato}</Undertekst>
                    <Normaltekst>
                        <Tekstomrade>{notifikasjon.beskrivelse}</Tekstomrade>
                    </Normaltekst>
                </StyledPanelPrioritert>
            );
        }
        return (
            <StyledPanel border>
                <Systemtittel>{notifikasjon.tittel}</Systemtittel>
                <Undertekst>{notifikasjon.dato}</Undertekst>
                <Normaltekst>
                    <Tekstomrade>{notifikasjon.beskrivelse}</Tekstomrade>
                </Normaltekst>
            </StyledPanel>
        );
    });

    return (
        <form>
            <FormStyle>
                <section>{alleNotifikasjoner}</section>
                <NotfikiasjonerVelger />
            </FormStyle>
        </form>
    );
}

export default Notifikasjon;
