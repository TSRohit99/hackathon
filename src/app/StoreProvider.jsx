'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';
import { fetchSubjects } from '@/lib/features/subjects/subjectSlice';

export default function StoreProvider({ children }) {
    const storeRef = useRef();

    if (!storeRef.current) {
        storeRef.current = makeStore();

        const state = storeRef.current.getState();
        if (state.subjectStore.subjects.length === 0) {
            storeRef.current.dispatch(fetchSubjects());
        }
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}