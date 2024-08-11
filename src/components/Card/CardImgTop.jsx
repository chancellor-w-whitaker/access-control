import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-img-top",
  src: "...",
  alt: "...",
  as: "img",
};

export const CardImgTop = generateSingleElementComponent(params);
