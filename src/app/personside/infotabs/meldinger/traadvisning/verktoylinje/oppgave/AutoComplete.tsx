import React from 'react';
import Downshift from 'downshift';
import styled from 'styled-components';
import { Normaltekst } from 'nav-frontend-typografi';
import theme from '../../../../../../../styles/personOversiktTheme';
import { Input } from 'nav-frontend-skjema';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';

const DropDownWrapper = styled.div`
    ul {
        z-index: 1000;
        position: absolute;
        top: 100%;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
        max-height: 20rem;
        overflow: auto;
    }
    li {
        min-width: 20rem;
        padding: 0.5rem 1rem;
        border: solid 0.05rem rgba(0, 0, 0, 0.2);
        background-color: white;
        color: black;
        display: flex;
    }
`;

const Style = styled.div`
    position: relative;
`;

const StyledSpinner = styled(NavFrontendSpinner)`
    position: absolute !important;
    bottom: 0.4rem;
    right: 0.4rem;
`;

const InputfeltWrapper = styled.div`
    position: relative;
    margin-bottom: 1rem;
    .skjemaelement {
        margin-bottom: 0;
    }
`;

interface Props<Item> {
    setValue: (value: Item) => void;
    inputValue: Item | undefined;
    itemToString: (item: Item) => string;
    label: string;
    suggestions: Item[];
    filter: (item: Item, input: string) => boolean;
    spinner: boolean;
    feil?: SkjemaelementFeil;
}

function AutoComplete<Item>(props: Props<Item>) {
    const handleStateChange = (changes: any) => {
        if (changes.hasOwnProperty('selectedItem')) {
            props.setValue(changes.selectedItem);
        }
    };

    const spinner = props.spinner && <StyledSpinner type={'S'} />;

    return (
        <Downshift
            selectedItem={props.inputValue}
            onStateChange={handleStateChange}
            itemToString={(item: Item) => (item ? props.itemToString(item) : '')}
        >
            {helpers => (
                <Style {...helpers.getRootProps()}>
                    <InputfeltWrapper>
                        <Input
                            feil={props.feil}
                            // @ts-ignore
                            {...helpers.getInputProps({
                                onChange: e => {
                                    if (e.target.value === '') {
                                        helpers.clearSelection();
                                    }
                                }
                            })}
                            label={props.label}
                            onFocus={helpers.openMenu}
                            aria-label={props.spinner ? 'Laster data' : props.label}
                        />
                        {spinner}
                    </InputfeltWrapper>
                    {helpers.isOpen ? (
                        <DropDownWrapper>
                            <ul>
                                {props.suggestions
                                    .filter(item => !helpers.inputValue || props.filter(item, helpers.inputValue))
                                    .map((item, index) => (
                                        <li
                                            {...helpers.getItemProps({
                                                key: props.itemToString(item),
                                                index,
                                                item,
                                                style: {
                                                    backgroundColor:
                                                        helpers.highlightedIndex === index
                                                            ? theme.color.navLysGra
                                                            : '#ffffff',
                                                    fontWeight: helpers.selectedItem === item ? 'bold' : 'normal'
                                                }
                                            })}
                                        >
                                            <Normaltekst>{props.itemToString(item)}</Normaltekst>
                                        </li>
                                    ))}
                            </ul>
                        </DropDownWrapper>
                    ) : null}
                </Style>
            )}
        </Downshift>
    );
}

export default AutoComplete;
