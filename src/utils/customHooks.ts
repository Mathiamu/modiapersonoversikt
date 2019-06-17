import * as React from 'react';
import { EffectCallback, useEffect } from 'react';
import { loggError } from './frontendLogger';
import { RefObject } from 'react';
import { useCallback } from 'react';
import { EventListener, runIfEventIsNotInsideRef } from './reactRefUtils';

export function useFocusOnMount(ref: React.RefObject<HTMLElement>) {
    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
            if (document.activeElement !== ref.current) {
                loggError(new Error('Kunne ikke sette fokus på: ' + ref.current.innerText));
            }
        }
    }, [ref]);
}

export function useOnMount(effect: EffectCallback) {
    useEffect(effect, []);
}

export function useClickOutside<T extends HTMLElement>(ref: RefObject<T>, callback: EventListener) {
    const handler: EventListener = useCallback(runIfEventIsNotInsideRef(ref, callback), [ref, callback]);

    useEffect(() => {
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [handler]);
}

export function useFocusOutside<T extends HTMLElement>(ref: RefObject<T>, callback: EventListener) {
    const handler: EventListener = useCallback(runIfEventIsNotInsideRef(ref, callback), [ref, callback]);

    useEffect(() => {
        document.addEventListener('focusin', handler);
        return () => document.removeEventListener('focusin', handler);
    }, [handler]);
}
