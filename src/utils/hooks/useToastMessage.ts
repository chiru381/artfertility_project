import { useContext } from 'react';
import RootContext from 'utils/context/RootContext';

export function useToastMessage() {
    const { toastMessage } = useContext<any>(RootContext);

    return {
        toastMessage
    }
}