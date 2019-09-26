import * as React from 'react';
import { Traad } from '../../../../models/meldinger/meldinger';
import styled from 'styled-components';
import theme, { pxToRem } from '../../../../styles/personOversiktTheme';
import RestResourceConsumer from '../../../../rest/consumer/RestResourceConsumer';
import TraadListe from './traadliste/TraadListe';
import { CenteredLazySpinner } from '../../../../components/LazySpinner';
import { useEffect, useState } from 'react';
import { hasData } from '../../../../rest/utils/restResource';
import { huskForrigeValgtTraad } from '../../../../redux/meldinger/actions';
import { useDispatch } from 'react-redux';
import { useAppState, useRestResource } from '../../../../utils/customHooks';
import { MeldingerDyplenkeRouteComponentProps, useInfotabsDyplenker, useValgtTraadIUrl } from '../dyplenker';
import { withRouter } from 'react-router';
import TraadVisning from './traadvisning/TraadVisning';
import Verktoylinje from './traadvisning/verktoylinje/Verktoylinje';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

const meldingerMediaTreshold = pxToRem(1000);

const MeldingerArticleStyle = styled.article`
    @media (min-width: ${meldingerMediaTreshold}) {
        display: flex;
        align-items: flex-start;
        > *:last-child {
            margin-left: ${theme.margin.layout};
        }
        max-height: 100%;
    }
    position: relative;
    > *:first-child {
        flex: 35% 1 1;
    }
    > *:last-child {
        flex: 65% 1 1;
    }
`;

const ScrollBar = styled.div`
    overflow-y: auto;
    max-height: 100%;
    padding: ${theme.margin.layout};
`;

function MeldingerContainer(props: MeldingerDyplenkeRouteComponentProps) {
    const dispatch = useDispatch();
    const forrigeValgteTraad = useAppState(state => state.meldinger.forrigeValgteTraad);
    const traaderResource = useRestResource(resources => resources.tråderOgMeldinger);
    const dyplenker = useInfotabsDyplenker();
    const traadIUrl = useValgtTraadIUrl(props);
    const [sokeord, setSokeord] = useState('');

    useEffect(() => {
        if (!traadIUrl && hasData(traaderResource)) {
            if (traaderResource.data.length === 0) {
                return;
            }
            props.history.push(dyplenker.meldinger.link(forrigeValgteTraad || traaderResource.data[0]));
        } else if (traadIUrl !== forrigeValgteTraad && !!traadIUrl) {
            dispatch(huskForrigeValgtTraad(traadIUrl));
        }
    }, [forrigeValgteTraad, traadIUrl, traaderResource, dispatch, props.history, dyplenker.meldinger]);

    return (
        <RestResourceConsumer<Traad[]>
            getResource={restResources => restResources.tråderOgMeldinger}
            returnOnPending={<CenteredLazySpinner />}
        >
            {data => {
                if (data.length === 0) {
                    return <AlertStripeInfo>Brukeren har ingen meldinger</AlertStripeInfo>;
                }
                return (
                    <MeldingerArticleStyle>
                        <ScrollBar>
                            <TraadListe
                                sokeord={sokeord}
                                setSokeord={setSokeord}
                                traader={data}
                                valgtTraad={traadIUrl}
                            />
                        </ScrollBar>
                        <ScrollBar>
                            <Verktoylinje valgtTraad={traadIUrl} />
                            <TraadVisning sokeord={sokeord} valgtTraad={traadIUrl} />
                        </ScrollBar>
                    </MeldingerArticleStyle>
                );
            }}
        </RestResourceConsumer>
    );
}

export default withRouter(MeldingerContainer);
