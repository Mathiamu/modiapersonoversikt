import * as React from 'react';

interface Props {
    harSammeBosted: boolean;
}

function BorMedBruker({harSammeBosted}: Props) {
    if (harSammeBosted) {
        return <>Bor med bruker</>;
    } else {
        return <>Bor ikke med bruker</>;
    }
}

export default BorMedBruker;