import { staticClassNameCustomizers } from "./props/staticClassNameCustomizers";
import { combineClassNames } from "./helpers/combineClassNames";
import { validateString } from "./helpers/validateString";

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

    const classNameCustomizers = {
      ...staticClassNameCustomizers,
      ...dynamicClassNameCustomizers,
    };

    const defaultedProps = Object.fromEntries(
      Object.entries(defaultProps).filter(([key]) => !(key in dynamicProps))
    );

    const standardDefaultedProps = Object.fromEntries(
      Object.entries(defaultedProps).filter(
        ([key]) => !(key in classNameCustomizers)
      )
    );

    const standardDynamicProps = Object.fromEntries(
      Object.entries(dynamicProps).filter(
        ([key]) => !(key in classNameCustomizers)
      )
    );

    const standardProps = {
      ...standardDefaultedProps,
      ...standardDynamicProps,
    };

    const defaultedPropBasedClasses = Object.entries(defaultedProps)
      .filter(([propName]) => propName in classNameCustomizers)
      .map(([propName, defaultValue]) =>
        typeof classNameCustomizers[propName] === "function"
          ? classNameCustomizers[propName](defaultValue)
          : ""
      );

    const dynamicPropBasedClasses = Object.entries(classNameCustomizers)
      .filter(([propName]) => propName in dynamicProps)
      .map(([propName, method]) =>
        typeof method === "function" ? method(dynamicProps[propName]) : ""
      );

    const propBasedClasses = [
      ...dynamicPropBasedClasses,
      ...defaultedPropBasedClasses,
    ];

    const completeClassName = [classNamesCombined, ...propBasedClasses]
      .filter((string) => validateString(string))
      .join(" ");

    const propsMerged = {
      className: completeClassName,
      ...standardProps,
    };

    return <As {...propsMerged} />;
  };

  return Component;
};
