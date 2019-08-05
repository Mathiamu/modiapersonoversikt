import { BaseUrlsResponse } from '../../../../../models/baseurls';
import { hentBaseUrl } from '../../../../../redux/restReducers/baseurls';
import { Sakstema } from '../../../../../models/saksoversikt/sakstema';
import { sakstemakodeAlle } from '../sakstemaliste/SakstemaListe';
import { DokumentMetadata } from '../../../../../models/saksoversikt/dokumentmetadata';
import * as React from 'react';
import { hasData, RestResource } from '../../../../../rest/utils/restResource';
import { PersonRespons } from '../../../../../models/person/person';
import { AppState } from '../../../../../redux/reducers';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';
import { isLoadedPerson } from '../../../../../redux/restReducers/personinformasjon';

function lenkeNorg2Frontend(props: StateProps): string {
    const temakodeTilNorgoppslag = props.valgtSakstema ? byggSøkestrengTilNorgTemaOppslag(props.valgtSakstema) : '';
    return `${props.baseUrl}/#/startsok?tema=${temakodeTilNorgoppslag}&gt=${props.geografistTilknytning}`;
}

function byggSøkestrengTilNorgTemaOppslag(sakstema: Sakstema) {
    if (sakstema.temakode !== sakstemakodeAlle) {
        return sakstema.temakode;
    }
    const temaArray: string[] = sakstema.dokumentMetadata.reduce((acc: string[], dok: DokumentMetadata) => {
        const tema = dok.temakode;
        if (acc.includes(tema)) {
            return acc;
        } else {
            return [...acc, tema];
        }
    }, []);
    return temaArray.join();
}

function hentNorg2Url(baseUrlResource: RestResource<BaseUrlsResponse>) {
    return hasData(baseUrlResource) ? hentBaseUrl(baseUrlResource.data, 'norg2-frontend') : '';
}

function hentGeografiskTilknytning(personResource: RestResource<PersonRespons>) {
    return isLoadedPerson(personResource) ? personResource.data.geografiskTilknytning : '';
}

interface StateProps {
    valgtSakstema?: Sakstema;
    baseUrl: string;
    geografistTilknytning?: string;
}

function LenkeNorg(props: StateProps) {
    const norgUrl = lenkeNorg2Frontend(props);

    return (
        <a className="lenke" target={'_blank'} rel={'noopener noreferrer'} href={norgUrl}>
            <Normaltekst>Oversikt over enheter og tema de behandler</Normaltekst>
        </a>
    );
}

function mapStateToProps(state: AppState): StateProps {
    return {
        valgtSakstema: state.saksoversikt.valgtSakstema,
        baseUrl: hentNorg2Url(state.restResources.baseUrl),
        geografistTilknytning: hentGeografiskTilknytning(state.restResources.personinformasjon)
    };
}

export default connect(mapStateToProps)(LenkeNorg);
