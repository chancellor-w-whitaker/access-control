import { toCamelCase } from "../helpers/toCamelCase";

export const additiveAndSubtractiveBorderProps = Object.fromEntries(
  ["border", "border-top", "border-end", "border-bottom", "border-start"].map(
    (className) => [
      toCamelCase(className),
      (boolean) => (boolean ? className : `${className}-0`),
    ]
  )
);
