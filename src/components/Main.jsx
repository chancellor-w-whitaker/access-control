import { generateSingleElementComponent } from "../generators/component-generator";

const params = {
  className: "container",
  as: "main",
};

export const Main = generateSingleElementComponent(params);
