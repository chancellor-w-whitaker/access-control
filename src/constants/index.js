export const constants = {
  reportsPromise: fetch("data/reports.json").then((response) =>
    response.json()
  ),
  usersPromise: fetch("data/users.json").then((response) => response.json()),
  identifierKey: "email",
};
