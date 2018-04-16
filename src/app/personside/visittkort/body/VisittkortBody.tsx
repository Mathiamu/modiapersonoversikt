import * as React from 'react';
import styled from 'styled-components';
import VisittkortElement from './VisittkortElement';
import { Person } from '../../../../models/person';
import Undertekst from 'nav-frontend-typografi/lib/undertekst';
import EpostContainer from './epost/EpostContainer';
import Bankkonto from './bankkonto/Bankkonto';
import MobiltelefonContainer from './telefon/MobiltelefonContainer';
import NavKontorContainer from './navkontor/NavKontorContainer';
import { Element } from 'nav-frontend-typografi';

const heartPath = require('../../../../resources/svg/heart.svg');
const locationPath = require('../../../../resources/svg/location-pin.svg');
const jentePath = require('../../../../resources/svg/jentebarn.svg');
const guttPath = require('../../../../resources/svg/guttebarn.svg');

interface VisittkortBodyProps {
    person: Person;
}

const VisittkortBodyDiv = styled.div`
  display: flex;
`;

const Kolonne = styled.div`
  flex: 0 0 50%;
  > *:not(:last-child) {
    margin-bottom: 60px;
  }
`;

const GruppeDiv = styled.div`
  > *:not(:last-child):not(:first-child) {
    margin-bottom: 30px;
  }
  > *:first-child{
    margin-bottom: 10px;
  }
`;

const PadLeft = styled.span`
  margin-left: 50px;
`;

function InfoGruppe(props: { children: string | JSX.Element | JSX.Element[]; tittel: string; }) {
    return (
        <GruppeDiv>
            <Element>
                <PadLeft>{props.tittel}</PadLeft>
            </Element>
            {props.children}
        </GruppeDiv>
    );
}

function VisittkortBody({ person }: VisittkortBodyProps) {

    return (
        <VisittkortBodyDiv>
            <Kolonne>
                <InfoGruppe tittel={'Kontakt'}>
                    <VisittkortElement beskrivelse="Postadresse Folkeregistrert" ikonPath={locationPath}>
                        <Undertekst>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Facilis neque nobis sint tempora. Quos, tenetur!
                        </Undertekst>
                    </VisittkortElement>
                    <VisittkortElement beskrivelse="Postadresse Midlertidig Norge" ikonPath={locationPath}>
                        <Undertekst>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Et, ipsum.
                        </Undertekst>
                    </VisittkortElement>
                    <EpostContainer />
                    <MobiltelefonContainer />
                    <Bankkonto person={person}/>
                </InfoGruppe>
            </Kolonne>
            <Kolonne>
                <InfoGruppe tittel={'Familie'}>
                    <VisittkortElement beskrivelse="Sivilstand" ikonPath={heartPath}>
                        <Undertekst>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                            Adipisci dignissimos eius modi natus praesentium unde velit.
                        </Undertekst>
                    </VisittkortElement>
                    <VisittkortElement beskrivelse="Jente" ikonPath={jentePath}>
                        <Undertekst>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        </Undertekst>
                    </VisittkortElement>
                    <VisittkortElement beskrivelse="Gutt" ikonPath={guttPath}>
                        <Undertekst>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        </Undertekst>
                    </VisittkortElement>
                </InfoGruppe>
                <InfoGruppe tittel={'Navkontor'}>
                    <NavKontorContainer />
                </InfoGruppe>
            </Kolonne>
        </VisittkortBodyDiv>
    );
}

export default VisittkortBody;
