import * as React from 'react';
import { Person } from '../../../../models/person';
import EpostContainer from './epost/EpostContainer';
import Bankkonto from './bankkonto/Bankkonto';
import MobiltelefonContainer from './telefon/MobiltelefonContainer';
import NavKontorContainer from './navkontor/NavKontorContainer';
import { Component } from 'react';
import { FamiliePlaceholder, SikkerhetstiltakPlaceholder, VergeMålPlaceholder } from './mockInfo';
import { InfoGruppe, Kolonne, VisittkortBodyDiv } from './styledComponents';
import Adresse from './adresse/Adresse';

interface VisittkortBodyProps {
    person: Person;
}

function Kontakt(person: Person) {
    return (
        <InfoGruppe tittel={'Kontakt'}>
            <Adresse  person={person}/>
            <EpostContainer/>
            <MobiltelefonContainer/>
            <Bankkonto person={person}/>
        </InfoGruppe>
    );
}

const Familie = (
    <InfoGruppe tittel={'Familie'}>
        <FamiliePlaceholder/>
    </InfoGruppe>
);

const NavKontor = (
    <InfoGruppe tittel={'Navkontor'}>
        <NavKontorContainer/>
    </InfoGruppe>
);

function OneColumnLayout(person: Person) {
    return (
        <>
            <Kolonne>
                {Kontakt(person)}
                {Familie}
                {NavKontor}
                {VergeMålPlaceholder}
                {SikkerhetstiltakPlaceholder}
            </Kolonne>
        </>
    );
}

function TwoColumnLayout(person: Person) {
    return (
        <>
            <Kolonne>
                {Kontakt(person)}
                {Familie}
            </Kolonne>
            <Kolonne>
                {NavKontor}
                {VergeMålPlaceholder}
                {SikkerhetstiltakPlaceholder}
            </Kolonne>
        </>
    );
}

function ThreeColumnLayout(person: Person) {
    return (
        <>
            <Kolonne>
                {Kontakt(person)}
            </Kolonne>
            <Kolonne>
                {Familie}
                {VergeMålPlaceholder}
            </Kolonne>
            <Kolonne>
                {NavKontor}
                {SikkerhetstiltakPlaceholder}
            </Kolonne>
        </>
    );
}

class VisittkortBody extends Component<VisittkortBodyProps> {

    private visittKortBodyRef: HTMLDivElement;

    constructor(props: VisittkortBodyProps) {
        super(props);
    }
    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }
    componentWillUnmount() {
        window.removeEventListener('resize', () => this.handleResize());
    }
    handleResize() {
        this.forceUpdate();
    }
    getComponentWidth() {
        return this.visittKortBodyRef ? this.visittKortBodyRef.clientWidth : 0;
    }
    getColumnLayout(numberOfColumns: number) {
        switch (numberOfColumns) {
            case 0:
            case 1:
                return OneColumnLayout(this.props.person);
            case 2:
                return TwoColumnLayout(this.props.person);
            default:
                return ThreeColumnLayout(this.props.person);
        }
    }
    render() {
        const componentWidth = this.getComponentWidth();
        const maxColumnWidth = 250;
        const numberOfColumns = Math.floor(componentWidth / maxColumnWidth);
        const columnLayOut = this.getColumnLayout(numberOfColumns);

        return (
            <VisittkortBodyDiv innerRef={ref => this.visittKortBodyRef = ref}>
                {columnLayOut}
            </VisittkortBodyDiv>
        );
    }
}

export default VisittkortBody;
