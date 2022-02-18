import { Meldingstype, Traad } from '../../../../models/meldinger/meldinger';
import { OppgavelisteValg } from '../sendMelding/SendNyMelding';
import { JournalforingsSak } from '../../infotabs/meldinger/traadvisning/verktoylinje/journalforing/JournalforingPanel';
import { FortsettDialogType } from './FortsettDialogContainer';
import { Temagruppe } from '../../../../models/temagrupper';

export enum DialogPanelStatus {
    UNDER_ARBEID,
    POSTING,
    ERROR,
    SVAR_SENDT,
    DELSVAR_SENDT,
    OPPGAVE_LAGT_TILBAKE
}

export type KvitteringsData = {
    fritekst: string;
    meldingstype: Meldingstype;
    temagruppe?: Temagruppe;
    traad: Traad;
};

interface DialogStatusInterface {
    type: DialogPanelStatus;
}

interface UnderArbeid extends DialogStatusInterface {
    type: DialogPanelStatus.UNDER_ARBEID | DialogPanelStatus.POSTING | DialogPanelStatus.ERROR;
}

interface SvarSendtSuccess extends DialogStatusInterface {
    type: DialogPanelStatus.SVAR_SENDT | DialogPanelStatus.DELSVAR_SENDT;
    kvitteringsData: KvitteringsData;
}

export type FortsettDialogPanelState = UnderArbeid | SvarSendtSuccess;

export interface FortsettDialogState {
    tekst: string;
    dialogType: FortsettDialogType;
    temagruppe?: Temagruppe;
    oppgaveListe: OppgavelisteValg;
    sak?: JournalforingsSak;
    visFeilmeldinger: boolean;
}
