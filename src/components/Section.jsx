import { generateSingleElementComponent } from "../generators/component-generator";

const params = {
  className: "my-3 p-3 shadow-sm",
  bgColor: "body",
  rounded: true,
};

export const Section = generateSingleElementComponent(params);
