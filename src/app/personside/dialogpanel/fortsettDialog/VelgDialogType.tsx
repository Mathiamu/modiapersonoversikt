import * as React from 'react';
import { Meldingstype } from '../../../../models/meldinger/meldinger';
import { FortsettDialogType } from './FortsettDialogContainer';
import { Radio } from 'nav-frontend-skjema';
import { VelgDialogtypeStyle } from '../fellesStyling';
import { FortsettDialogState } from './FortsettDialogTypes';
import { useAppState } from '../../../../utils/customHooks';

interface Props {
    formState: FortsettDialogState;
    updateDialogType: (dialogType: FortsettDialogType) => void;
    erTilknyttetOppgave: boolean;
    erDelvisBesvart: boolean;
}

function VelgDialogType(props: Props) {
    const jobberMedSTO = useAppState(state => state.session.jobberMedSTO);
    function lagRadio(label: string, type: FortsettDialogType) {
        return (
            <Radio
                label={label}
                name="dialogtype"
                onChange={() => props.updateDialogType(type)}
                checked={props.formState.dialogType === type}
            />
        );
    }

    const svar = lagRadio('Svar', Meldingstype.SVAR_SKRIFTLIG);
    const spørsmål = lagRadio('Spørsmål', Meldingstype.SPORSMAL_MODIA_UTGAAENDE);
    const delvisSvar = lagRadio('Delvis svar', Meldingstype.DELVIS_SVAR_SKRIFTLIG);
    const svarTelefon = lagRadio('Svar telefon', Meldingstype.SVAR_TELEFON);
    const svarOppmote = lagRadio('Svar oppmøte', Meldingstype.SVAR_OPPMOTE);

    if (props.erDelvisBesvart) {
        return (
            <VelgDialogtypeStyle>
                {svar}
                {delvisSvar}
            </VelgDialogtypeStyle>
        );
    }

    if (props.erTilknyttetOppgave) {
        return (
            <VelgDialogtypeStyle>
                {svar}
                {spørsmål}
                {delvisSvar}
                {!jobberMedSTO && svarTelefon}
                {!jobberMedSTO && svarOppmote}
            </VelgDialogtypeStyle>
        );
    }

    return (
        <VelgDialogtypeStyle>
            {svar}
            {spørsmål}
            {svarTelefon}
            {svarOppmote}
        </VelgDialogtypeStyle>
    );
}

export default VelgDialogType;
