import { useHistory } from 'react-router';
import { useQueryParams } from '../../utils/urlUtils';
import { paths, setNyBrukerIPath } from '../routes/routing';
import { useOnMount } from '../../utils/customHooks';
import { loggEvent } from '../../utils/frontendLogger';
import { INFOTABS } from '../personside/infotabs/InfoTabEnum';
import { useDispatch } from 'react-redux';
import { usePostResource } from '../../rest/consumer/usePostResource';

function useHandleQueryParams() {
    const history = useHistory();
    const queryParams = useQueryParams<{ sokFnr?: string; oppgaveid?: string; behandlingsid?: string }>();
    const sokFnr = queryParams.behandlingsid ? undefined : queryParams.sokFnr === '0' ? '' : queryParams.sokFnr;
    const plukkOppgaverResource = usePostResource(resources => resources.plukkNyeOppgaver);
    const dispatch = useDispatch();

    useOnMount(() => {
        if (queryParams.behandlingsid && queryParams.sokFnr && queryParams.oppgaveid) {
            dispatch(
                plukkOppgaverResource.actions.setResponse([
                    {
                        oppgaveId: queryParams.oppgaveid,
                        fødselsnummer: queryParams.sokFnr,
                        traadId: queryParams.behandlingsid,
                        fraGosys: true
                    }
                ])
            );
            history.push(
                `${paths.personUri}/${queryParams.sokFnr}/${INFOTABS.MELDINGER.toLowerCase()}/${
                    queryParams.behandlingsid
                }`
            );
            loggEvent('Oppgave', 'FraGosys');
        } else if (queryParams.sokFnr) {
            loggEvent('Oppslag', 'Puzzle');
            setNyBrukerIPath(history, queryParams.sokFnr);
        }
    });

    return { queryParams, sokFnr };
}

export default useHandleQueryParams;
