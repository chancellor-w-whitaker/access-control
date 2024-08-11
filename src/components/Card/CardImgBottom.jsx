import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "card-img-bottom",
  src: "...",
  alt: "...",
  as: "img",
};

export const CardImgBottom = generateSingleElementComponent(params);
