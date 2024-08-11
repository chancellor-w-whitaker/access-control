import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-img",
  src: "...",
  alt: "...",
  as: "img",
};

export const CardImg = generateSingleElementComponent(params);
