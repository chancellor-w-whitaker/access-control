import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "list-group-item",
  as: "li",
};

export const ListGroupItem = generateSingleElementComponent(params);
