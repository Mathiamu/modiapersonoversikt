import navfaker from 'nav-faker';

import { Diskresjonskoder } from '../../konstanter';

export function getDiskresjonskode() {
    if (navfaker.random.vektetSjanse(0.5)) {
        return {
            kodeRef: Diskresjonskoder.FORTROLIG_ADRESSE,
            beskrivelse: 'Sperret adresse, fortrolig'
        };
    } else {
        return {
            kodeRef: Diskresjonskoder.STRENGT_FORTROLIG_ADRESSE,
            beskrivelse: 'Sperret adresse, strengt fortrolig'
        };
    }
}