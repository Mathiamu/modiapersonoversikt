import * as React from 'react';
import Undertekst from 'nav-frontend-typografi/lib/undertekst';

import VisittkortElement from '../VisittkortElement';
import { Kontaktinformasjon } from '../../../../../models/kontaktinformasjon';
import Innholdslaster from '../../../../../components/Innholdslaster';
import { Reducer } from '../../../../../redux/reducer';
import EtikettLiten from 'nav-frontend-typografi/lib/etikett-liten';

const phonePath = require('../../../../../resources/svg/phone.svg');

interface MobiltelefonProps {
    kontaktinformasjon: Kontaktinformasjon;
}

function Mobiltelefon({kontaktinformasjon }: MobiltelefonProps) {
    if (kontaktinformasjon.reservert) {
        return (
            <Undertekst>Reservert</Undertekst>
        );
    } else if (kontaktinformasjon.mobiltelefon) {
        return (
            <>
                <Undertekst>{kontaktinformasjon.mobiltelefon.value}</Undertekst>
                <EtikettLiten>Endret {kontaktinformasjon.mobiltelefon.sistOppdatert}</EtikettLiten>
            </>
        );
    } else {
        return <Undertekst>Ingen mobiltelefon registrert</Undertekst>;
    }
}

interface MobiltelefonWrapperProps {
    kontaktinformasjonReducer: Reducer<Kontaktinformasjon>;
}

function MobiltelefonWrapper ({kontaktinformasjonReducer}: MobiltelefonWrapperProps) {
    return (
        <VisittkortElement beskrivelse="Telefon Kontakt og reservasjonsregisteret" ikonPath={phonePath}>
            <Innholdslaster avhengigheter={[kontaktinformasjonReducer]}>
                <Mobiltelefon kontaktinformasjon={kontaktinformasjonReducer.data}/>
            </Innholdslaster>
        </VisittkortElement>
    );
}

export default MobiltelefonWrapper;