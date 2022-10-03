import { useEffect } from 'react';
import { useGjeldendeBruker } from '../../redux/gjeldendeBruker/types';
import featuretoggles from '../../rest/resources/featuretoggles';

export function useFetchFeatureTogglesOnNewFnr() {
    const fnr = useGjeldendeBruker();
    const resource = featuretoggles.useFetch();

    useEffect(() => {
        resource.rerun();
    }, [fnr, resource]);
}
