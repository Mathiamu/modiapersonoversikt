interface LeggTilbakeOppgaveBaseRequest {
    type: 'Innhabil' | 'FeilTema' | 'AnnenAarsak';
    oppgaveId: string;
    enhet: string;
}

interface LeggTilbakeOppgaveInnhabilRequest extends LeggTilbakeOppgaveBaseRequest {
    type: 'Innhabil';
}

interface LeggTilbakeOppgaveFeilTemaRequest extends LeggTilbakeOppgaveBaseRequest {
    type: 'FeilTema';
    traadId: string;
    temagruppe: string;
}

export function erLeggTilbakeOppgaveFeilTemaRequest(
    payload: LeggTilbakeOppgaveRequest
): payload is LeggTilbakeOppgaveFeilTemaRequest {
    return 'temagruppe' in payload;
}

interface LeggTilbakeOppgaveAnnenAarsakRequest extends LeggTilbakeOppgaveBaseRequest {
    type: 'AnnenAarsak';
    beskrivelse: string;
}

export type LeggTilbakeOppgaveRequest =
    | LeggTilbakeOppgaveInnhabilRequest
    | LeggTilbakeOppgaveFeilTemaRequest
    | LeggTilbakeOppgaveAnnenAarsakRequest;
