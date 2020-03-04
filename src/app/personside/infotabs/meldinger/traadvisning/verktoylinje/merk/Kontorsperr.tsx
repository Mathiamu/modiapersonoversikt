import * as React from 'react';
import { useState } from 'react';
import { Checkbox } from 'nav-frontend-skjema';
import { UnmountClosed } from 'react-collapse';
import OpprettOppgaveContainer from '../oppgave/OpprettOppgaveContainer';
import { apiBaseUri } from '../../../../../../../api/config';
import { Traad } from '../../../../../../../models/meldinger/meldinger';
import { MerkKontorsperrRequest } from '../../../../../../../models/meldinger/merk';
import styled from 'styled-components/macro';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useRestResource } from '../../../../../../../rest/consumer/useRestResource';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../../../../redux/reducers';

interface Props {
    valgtTraad: Traad;
    tilbake: () => void;
    lukkPanel: () => void;
    merkPost: (url: string, object: any, name: string) => void;
}

const MERK_KONTORSPERRET_URL = `${apiBaseUri}/dialogmerking/kontorsperret`;

const Style = styled.div`
    margin-top: 1rem;
`;

function getMerkKontrorsperretRequest(fnr: String, enhet: string, traad: Traad): MerkKontorsperrRequest {
    const meldingsidListe = traad.meldinger.map(melding => melding.id);
    return {
        fnr: fnr,
        enhet: enhet,
        meldingsidListe: meldingsidListe
    };
}

export function Kontorsperr(props: Props) {
    const [opprettOppgave, settOpprettOppgave] = useState(true);
    const valgtBrukersFnr = useSelector((state: AppState) => state.gjeldendeBruker.fødselsnummer);
    const brukersKontor = useRestResource(resource => resource.brukersNavKontor);
    const brukersEnhetID = brukersKontor.data?.enhetId ? brukersKontor.data.enhetId : '';
    const valgtTraad = props.valgtTraad;

    const kontorsperr = () => {
        if (!brukersEnhetID) {
            return;
        }
        props.merkPost(
            MERK_KONTORSPERRET_URL,
            getMerkKontrorsperretRequest(valgtBrukersFnr, brukersEnhetID, valgtTraad),
            'Kontorsperring'
        );
    };

    return (
        <Style>
            <Checkbox
                label={'Opprett oppgave'}
                checked={opprettOppgave}
                onChange={_ => settOpprettOppgave(!opprettOppgave)}
            />
            <UnmountClosed isOpened={opprettOppgave}>
                <OpprettOppgaveContainer
                    lukkPanel={props.tilbake}
                    valgtTraad={valgtTraad}
                    onSuccessCallback={kontorsperr}
                />
            </UnmountClosed>
            {opprettOppgave ? null : (
                <Hovedknapp htmlType="button" onClick={kontorsperr}>
                    Merk som kontorsperret
                </Hovedknapp>
            )}
        </Style>
    );
}
