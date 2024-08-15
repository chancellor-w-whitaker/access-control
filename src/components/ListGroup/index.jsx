import { generateSingleElementComponent } from "../../generators/component-generator";

const params = {
  className: "list-group",
  as: "ul",
};

export const ListGroup = generateSingleElementComponent(params);
