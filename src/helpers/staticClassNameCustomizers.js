import { additiveAndSubtractiveBorderProps } from "./additiveAndSubtractiveBorderProps";
import { roundedProps } from "./roundedProps";

const borderCustomizers = {
  borderOpacity: (percentage) => `border-opacity-${percentage}`,
  borderColor: (variant) => `border-${variant}`,
  borderWidth: (width) => `border-${width}`,
  ...additiveAndSubtractiveBorderProps,
  ...roundedProps,
};

const bgCustomizers = {
  bgGradient: (boolean) => (boolean ? `bg-gradient` : ``),
  bgOpacity: (percentage) => `bg-opacity-${percentage}`,
  bgColor: (variant) => `bg-${variant}`,
};

const textColorCustomizers = {
  textOpacity: (percentage) => `text-opacity-${percentage}`,
  textColor: (variant) => `text-${variant}`,
};

// ! since display could have a different value per breakpoint, display prop must be capable of accepting an array

export const staticClassNameCustomizers = {
  //   display: (value) => `d-${value}`,
  ...textColorCustomizers,
  ...borderCustomizers,
  ...bgCustomizers,
};
