import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "nav nav-pills card-header-pills",
  as: "ul",
};

export const CardHeaderPills = generateSingleElementComponent(params);
