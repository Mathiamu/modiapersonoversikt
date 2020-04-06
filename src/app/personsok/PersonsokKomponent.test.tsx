import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TestProvider from '../../test/Testprovider';
import PersonsokSkjema from './PersonsokSkjema';
import PersonsokResultat from './PersonsokResultat';

test('viser personsøk-komponent', () => {
    const personsokKomponent = renderer.create(
        <TestProvider>
            <>
                <PersonsokSkjema setResponse={() => {}} />
                <PersonsokResultat response={undefined} onClose={() => {}} />
            </>
        </TestProvider>
    );

    expect(personsokKomponent.toJSON()).toMatchSnapshot();
});
