import { createContext } from 'react';
import { DefaultState } from 'utils/types';

type ContextProps = {
  toastMessage: DefaultState['toastMessage'];
};

const RootContext = createContext<Partial<ContextProps>>({})

export default RootContext;