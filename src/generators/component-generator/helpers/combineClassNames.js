import { validateString } from "./validateString";

export const combineClassNames = ({
  dynamic: dynamicClassName,
  static: staticClassName,
}) =>
  typeof dynamicClassName === "function"
    ? dynamicClassName(validateString(staticClassName) ? staticClassName : "")
    : [staticClassName, dynamicClassName]
        .filter((string) => validateString(string))
        .join(" ");
