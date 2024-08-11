import { generateSingleElementComponent } from "../generators/component-generator";

const params = {
  classNameCustomizers: { variant: (prop) => `btn-${prop}` },
  className: "btn",
  type: "button",
  as: "button",
};

// from dynamic props, remove entries where key in classNameCustomizers
// in other words,
// commonProps = Object.fromEntries(Object.entries(dynamicProps).filter(([key])=>!(key in classNameCustomizers)))

export const Button = generateSingleElementComponent(params);
