import * as React from 'react';
import { Familierelasjon, getBarn } from '../../../../../models/person';

interface Props {
    familierelasjoner: Familierelasjon[];
}

export function AntallBarn({familierelasjoner}: Props) {
    const barn = getBarn(familierelasjoner);
    if (barn.length === 0 ) {
        return <>Ingen barn under 21 år </>;
    }

    return (
        <> {barn.length} barn (under 21)</>
    );
}