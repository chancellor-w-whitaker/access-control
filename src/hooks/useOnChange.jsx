import { useState } from "react";

export const useOnChange = ({ handler, value }) => {
  const [previousValue, setPreviousValue] = useState(value);

  if (previousValue !== value) {
    setPreviousValue(value);

    typeof handler === "function" && handler(previousValue);
  }
};
