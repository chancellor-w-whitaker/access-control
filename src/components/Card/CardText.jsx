import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-text",
  as: "p",
};

export const CardText = generateSingleElementComponent(params);
