import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card",
  as: "div",
};

export const Card = generateSingleElementComponent(params);
