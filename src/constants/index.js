const userIdentifier = "email";

export const constants = {
  users: {
    promise: fetch("data/users.json").then((response) => response.json()),
    identifier: userIdentifier,
  },
  reports: {
    promise: fetch("data/reports.json").then((response) => response.json()),
  },
};

export const isEditable = ({ colDef: { field }, data }) => {
  return (
    data[userIdentifier] !== "default internal" &&
    data[userIdentifier] !== "default external" &&
    field !== userIdentifier
  );
};
