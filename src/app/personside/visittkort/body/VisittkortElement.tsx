import * as React from 'react';
import styled from 'styled-components';
import TittelOgIkon from './IkonOgTittel';
import EtikettLiten from 'nav-frontend-typografi/lib/etikett-liten';
import { ReactNode } from 'react';

interface ElementProps {
    children: ReactNode;
    beskrivelse?: string;
    ikon?: JSX.Element;
}

const VisittkortElementStyle = styled.div`
  margin: 10px 0 20px 0;
  &:last-child {
    margin: 10px 0 0 0;
  }
`;

export const TittelStyle = styled.span`
  opacity: 0.7;
`;

function VisittkortElement(props: ElementProps) {
    const tittel = props.beskrivelse
        ? <EtikettLiten tag="h4"><TittelStyle>{props.beskrivelse}</TittelStyle></EtikettLiten> : null;
    return (
        <VisittkortElementStyle>
            <TittelOgIkon tittel={tittel} ikon={props.ikon}/>
            {props.children}
        </VisittkortElementStyle>
    );
}

export default VisittkortElement;
