import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "nav nav-tabs card-header-tabs",
  as: "ul",
};

export const CardHeaderTabs = generateSingleElementComponent(params);
