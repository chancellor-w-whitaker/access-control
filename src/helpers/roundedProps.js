import { toCamelCase } from "./toCamelCase";

const roundedSizes = new Set(["circle", "pill", "0", "1", "2", "3", "4", "5"]);

export const roundedProps = Object.fromEntries(
  [
    "rounded",
    "rounded-top",
    "rounded-end",
    "rounded-bottom",
    "rounded-start",
  ].map((className) => [
    toCamelCase(className),
    (size) => {
      const segment = `${size}`.toLowerCase();

      if (roundedSizes.has(segment)) return `${className}-${segment}`;

      return size ? className : `${className}-0`;
    },
  ])
);
