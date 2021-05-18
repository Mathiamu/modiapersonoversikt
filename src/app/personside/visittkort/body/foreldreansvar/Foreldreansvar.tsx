import * as React from 'react';
import { VisittkortGruppe } from '../VisittkortStyles';
import { Foreldreansvar } from '../../../../../models/foreldreansvar/foreldreansvar';
import VisittkortElement from '../VisittkortElement';
import { Normaltekst } from 'nav-frontend-typografi';
import Infotegn from '../../../../../svg/Info';

function ForeldreansvarElement(props: { foreldreansvar: Foreldreansvar }) {
    return (
        <VisittkortElement>
            <Normaltekst>
                {props.foreldreansvar.ansvarlig?.sammensatt ?? 'Navn ikke tilgjengelig'}({props.foreldreansvar.ansvar})
            </Normaltekst>
            <Normaltekst>Gjelder for: {props.foreldreansvar.ansvarssubjekt.sammensatt}</Normaltekst>
        </VisittkortElement>
    );
}

function ForendreansvarWrapper(props: { foreldreansvar?: Foreldreansvar[] }) {
    if (!props.foreldreansvar || props.foreldreansvar.length === 0) {
        return null;
    }
    const foreldreansvarElementer = props.foreldreansvar.map((foreldreansvar, index) => (
        <ForeldreansvarElement key={index} foreldreansvar={foreldreansvar} />
    ));

    return (
        <VisittkortGruppe ikon={<Infotegn />} tittel="Foreldreansvar">
            {foreldreansvarElementer}
        </VisittkortGruppe>
    );
}
export default ForendreansvarWrapper;
