import { generateSingleElementComponent } from "../generators/component-generator";

const params = {
  className: "btn-group",
  role: "group",
};

// from dynamic props, remove entries where key in classNameCustomizers
// in other words,
// commonProps = Object.fromEntries(Object.entries(dynamicProps).filter(([key])=>!(key in classNameCustomizers)))

export const ButtonGroup = generateSingleElementComponent(params);
