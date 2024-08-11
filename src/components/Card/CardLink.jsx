import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-link",
  href: "#",
  as: "a",
};

export const CardLink = generateSingleElementComponent(params);
