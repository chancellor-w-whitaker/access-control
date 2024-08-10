import { staticClassNameCustomizers } from "./staticClassNameCustomizers";
import { combineClassNames } from "./combineClassNames";
import { validateString } from "./validateString";

export const generateSingleElementComponent = ({
  classNameCustomizers: dynamicClassNameCustomizers = {},
  className: staticClassName = "",
  as: defaultElement = "div",
  ...defaultProps
}) => {
  const Component = ({
    className: dynamicClassName = "",
    as = defaultElement,
    ...dynamicProps
  }) => {
    const As = as;

    const classNames = { dynamic: dynamicClassName, static: staticClassName };

    const classNamesCombined = combineClassNames(classNames);

    const defaultedProps = Object.fromEntries(
      Object.entries(defaultProps).filter(([key]) => !(key in dynamicProps))
    );

    const classNameCustomizers = {
      ...staticClassNameCustomizers,
      ...dynamicClassNameCustomizers,
    };

    const commonProps = Object.fromEntries(
      Object.entries(dynamicProps).filter(
        ([key]) => !(key in classNameCustomizers)
      )
    );

    const propDerivedClasses = Object.entries(classNameCustomizers)
      .filter(([propName]) => propName in dynamicProps)
      .map(([propName, method]) =>
        typeof method === "function" ? method(dynamicProps[propName]) : ""
      )
      .filter((string) => validateString(string))
      .join(" ");

    const completeClassName = [classNamesCombined, propDerivedClasses]
      .filter((string) => validateString(string))
      .join(" ");

    const propsMerged = {
      className: completeClassName,
      ...defaultedProps,
      ...commonProps,
    };

    return <As {...propsMerged} />;
  };

  return Component;
};
