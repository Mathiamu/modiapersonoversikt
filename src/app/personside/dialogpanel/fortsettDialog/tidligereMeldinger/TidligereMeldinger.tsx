import * as React from 'react';
import { Melding, Meldingstype, Traad } from '../../../../../models/meldinger/meldinger';
import styled from 'styled-components/macro';
import EnkeltMelding from './EnkeltMelding';
import { useRef } from 'react';
import { useFocusOnMount } from '../../../../../utils/customHooks';
import theme from '../../../../../styles/personOversiktTheme';
import { guid } from 'nav-frontend-js-utils';

interface Props {
    traad: Traad;
}

const StyledArticle = styled.article`
    ${theme.resetEkspanderbartPanelStyling};
    border: ${theme.border.skille};
`;

function Traadpanel(props: { traad: Melding[]; tittel: string; defaultApen: boolean }) {
    const meldinger = props.traad.map(melding => (
        <EnkeltMelding
            key={melding.id}
            melding={melding}
            erEnkeltstaende={props.traad.length === 1}
            defaultApen={props.defaultApen}
        />
    ));
    return <>{meldinger}</>;
}

function TidligereMeldinger(props: Props) {
    const ref = useRef<HTMLHeadingElement>(null);
    const traadUtenDelviseSvar = props.traad.meldinger.filter(
        melding => melding.meldingstype !== Meldingstype.DELVIS_SVAR_SKRIFTLIG
    );
    const delsvar = props.traad.meldinger.filter(
        melding => melding.meldingstype === Meldingstype.DELVIS_SVAR_SKRIFTLIG
    );
    const tittelId = useRef(guid());

    useFocusOnMount(ref);

    const defaultApen = delsvar.length > 0 || traadUtenDelviseSvar.length === 1;

    return (
        <StyledArticle aria-describedby={tittelId.current}>
            <h3 tabIndex={-1} className="sr-only" ref={ref} id={tittelId.current}>
                Tidligere meldinger
            </h3>
            <Traadpanel traad={traadUtenDelviseSvar} tittel="Vis tidligere meldinger" defaultApen={defaultApen} />
            <Traadpanel traad={delsvar} tittel="Vis alle delsvar" defaultApen={defaultApen} />
        </StyledArticle>
    );
}

export default TidligereMeldinger;
