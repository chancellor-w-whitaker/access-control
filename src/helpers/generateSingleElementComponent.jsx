export const generateSingleElementComponent = ({
  className: staticClassName = "",
  element: defaultElement = "div",
  ...defaultProps
}) => {
  const Component = ({
    as = defaultElement,
    className = "",
    ...nonRequiredProps
  }) => {
    const As = as;

    const combineClassNames = ({
      dynamic: dynamicClassName,
      static: staticClassName,
    }) => {
      const validateString = (string) =>
        typeof string === "string" && string.length > 0;

      return typeof dynamicClassName === "function"
        ? dynamicClassName(
            validateString(staticClassName) ? staticClassName : ""
          )
        : [staticClassName, dynamicClassName]
            .filter((string) => validateString(string))
            .join(" ");
    };

    const entireClassName = combineClassNames({
      static: staticClassName,
      dynamic: className,
    });

    const requiredProps = Object.fromEntries(
      Object.entries(defaultProps).filter(([key]) => !(key in nonRequiredProps))
    );

    const allPropsMerged = {
      className: entireClassName,
      ...nonRequiredProps,
      ...requiredProps,
    };

    return <As {...allPropsMerged} />;
  };

  return Component;
};
