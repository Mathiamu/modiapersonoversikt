import * as React from 'react';
import { useCallback } from 'react';
import NAVSPA from '@navikt/navspa';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { DecoratorProps, EnhetDisplay, FnrDisplay, RESET_VALUE } from './decoratorprops';
import { fjernBrukerFraPath, setNyBrukerIPath } from '../routes/routing';
import { useHistory } from 'react-router';
import './personsokKnapp.less';
import './hurtigtaster.less';
import './decorator.less';
import { useAppState, useFødselsnummer, useOnMount } from '../../utils/customHooks';
import PersonsokContainer from '../personsok/Personsok';
import DecoratorEasterEgg from './EasterEggs/DecoratorEasterEgg';
import { velgEnhetAction } from '../../redux/session/session';
import { useQueryParams } from '../../utils/urlUtils';
import styled from 'styled-components';
import HurtigtastTipsContainer from '../../components/hutigtastTips/HurtigtastTipsContainer';
import useHandleGosysUrl from './useHandleGosysUrl';
import { loggEvent } from '../../utils/logger/frontendLogger';

const InternflateDecorator = NAVSPA.importer<DecoratorProps>('internarbeidsflatefs');
const etterSokefelt = `
<div class="knapper_container">
  <button class="personsok-button" id="toggle-personsok" aria-label="Åpne avansert søk" title="Åpne avansert søk">
    <span> A <span class="personsok-pil"></span></span>
  </button>
  <button class="hurtigtaster-button" id="hurtigtaster-button" aria-label="Åpne hurtigtaster" title="Åpne hurtigtaster">
    <span class="typo-element hurtigtaster-ikon">?<span class="sr-only">Vis hurtigtaster</span></span>
  </button>
</div>
`;

const StyledNav = styled.nav`
    .dekorator .dekorator__container {
        max-width: initial;
    }
`;

function lagConfig(
    gjeldendeFnr: string | undefined | null,
    sokFnr: string | undefined,
    enhet: string | undefined | null,
    history: History,
    settEnhet: (enhet: string) => void
): DecoratorProps {
    const onsketFnr = sokFnr || gjeldendeFnr || null;
    const fnrValue = sokFnr === '0' ? RESET_VALUE : onsketFnr;

    return {
        appname: 'Modia personoversikt',
        fnr: {
            value: fnrValue,
            display: FnrDisplay.SOKEFELT,
            onChange(fnr: string | null): void {
                if (fnr === gjeldendeFnr) {
                    return;
                }
                if (fnr && fnr.length > 0) {
                    setNyBrukerIPath(history, fnr);
                } else {
                    fjernBrukerFraPath(history);
                }
            }
        },
        enhet: {
            initialValue: enhet || null,
            display: EnhetDisplay.ENHET_VALG,
            onChange(enhet: string | null): void {
                if (enhet) {
                    settEnhet(enhet);
                }
            }
        },
        toggles: {
            visVeileder: true
        },
        markup: {
            etterSokefelt: etterSokefelt
        }
    };
}

function Decorator() {
    const gjeldendeFnr = useFødselsnummer();
    const valgtEnhet = useAppState(state => state.session.valgtEnhetId);
    const history = useHistory();
    const dispatch = useDispatch();
    const queryParams = useQueryParams<{ sokFnr?: string }>();

    useHandleGosysUrl();

    useOnMount(() => {
        if (queryParams.sokFnr) {
            loggEvent('Oppslag', 'Puzzle');
        }
    });

    const handleSetEnhet = (enhet: string) => {
        dispatch(velgEnhetAction(enhet));
    };

    const config = useCallback(lagConfig, [gjeldendeFnr, valgtEnhet, history, handleSetEnhet])(
        gjeldendeFnr,
        queryParams.sokFnr,
        valgtEnhet,
        history,
        handleSetEnhet
    );

    return (
        <StyledNav>
            <InternflateDecorator {...config} />
            <PersonsokContainer />
            <HurtigtastTipsContainer />
            <DecoratorEasterEgg />
        </StyledNav>
    );
}

export default Decorator;
