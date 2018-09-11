import * as React from 'react';
import styled from 'styled-components';
import Undertittel from 'nav-frontend-typografi/lib/undertittel';
import NavKontorContainer from './navkontor/NavKontorContainer';

import { erDød, Navn, Person } from '../../../../models/person/person';
import PersonStatus from './status/PersonStatus';
import EtiketterContainer from './EtiketterContainer';
import Mann from '../../../../svg/Mann.js';
import Kvinne from '../../../../svg/Kvinne.js';
import DetaljerKnapp from '../../infotabs/utbetalinger/utils/DetaljerKnapp';
import theme from '../../../../styles/personOversiktTheme';

interface Props {
    person: Person;
    toggleVisittkort: () => void;
    visittkortApent: boolean;
}

const VisittkortHeaderDiv = styled.section`
  background-color: white;
  border-radius: ${theme.borderRadius.layout};
  padding: ${theme.margin.px20};
  padding-right: 3rem;
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  cursor: pointer;
  > * {
    flex: 1 1 50%;
  }
`;

const VenstreFelt = styled.section`
  display: flex;
`;

const HøyreFelt = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  text-align: right;
  box-sizing: border-box;
`;

const IkonDiv = styled.div`
  flex: 0 0 50px;
  text-align: left;
  svg {
    height: 40px;
    width: auto;
  }
`;

const GrunninfoDiv = styled.section`
  flex: 1 1;
  text-align: left;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  > *:first-child {
    margin-bottom: 0.2em !important;
  };
`;

const ChevronStyling = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

interface PersonProps {
    person: Person;
}

function Navnelinje({person}: PersonProps) {
    const alder = erDød(person.personstatus) ? 'Død' : person.alder;
    return (
        <Undertittel tag="h1">
            {hentNavn(person.navn)} ({alder})
        </Undertittel>
    );
}

function hentNavn(navn: Navn) {
    return navn.fornavn +
        (navn.mellomnavn ? ' ' + navn.mellomnavn + ' ' : ' ')
        + navn.etternavn;
}

function VisittkortHeader({person, toggleVisittkort, visittkortApent}: Props) {
    const ikon = {
        ikon: person.kjønn === 'M' ? <Mann alt="Mann"/> : <Kvinne alt="Kvinne"/>,
    };
    return (
        <VisittkortHeaderDiv role="region" aria-label="Visittkort-hode" onClick={toggleVisittkort}>

            <VenstreFelt>
                <IkonDiv>
                    {ikon.ikon}
                </IkonDiv>
                <GrunninfoDiv>
                    <Navnelinje person={person}/>
                    <PersonStatus person={person}/>
                </GrunninfoDiv>
            </VenstreFelt>

            <HøyreFelt>
                <EtiketterContainer/>
                <NavKontorContainer person={person}/>
            </HøyreFelt>

            <ChevronStyling>
                <DetaljerKnapp onClick={() => null} open={visittkortApent}>
                    <span className="visually-hidden">
                        {visittkortApent ? 'Lukk visittkort' : 'Ekspander visittkort'}
                        </span>
                </DetaljerKnapp>
            </ChevronStyling>
        </VisittkortHeaderDiv>
    );
}

export default VisittkortHeader;
