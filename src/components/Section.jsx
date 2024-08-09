import { generateSingleElementComponent } from "../helpers/generateSingleElementComponent";

const params = {
  className: "my-3 p-3 bg-body rounded shadow-sm",
  element: "div",
};

export const Section = generateSingleElementComponent(params);
