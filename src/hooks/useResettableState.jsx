import { useState } from "react";

import { useOnChange } from "./useOnChange";

export const useResettableState = (initialState) => {
  const [state, setState] = useState(initialState);

  const resetState = () => setState(initialState);

  useOnChange({ handler: resetState, value: initialState });

  return [state, setState];
};
