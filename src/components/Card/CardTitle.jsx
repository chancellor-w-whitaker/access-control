import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-title",
  as: "h5",
};

export const CardTitle = generateSingleElementComponent(params);
