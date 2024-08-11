import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-subtitle mb-2",
  textColor: "body-secondary",
  as: "h6",
};

export const CardSubtitle = generateSingleElementComponent(params);
