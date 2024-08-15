import { usePromise } from "./hooks/usePromise";

const getJsonPromise = (url) => fetch(url).then((response) => response.json());

const ensureIsArray = (param) => (Array.isArray(param) ? param : []);

const constants = {
  reports: { url: "data/reports.json", primaryKey: "link" },
  users: { url: "data/users.json", primaryKey: "email" },
};

const promises = {
  reports: getJsonPromise(constants.reports.url),
  users: getJsonPromise(constants.users.url),
};

const [usersPrimaryKey, reportsPrimaryKey] = [
  constants.users.primaryKey,
  constants.reports.primaryKey,
];

// * add user
// * add group
// * delete user
// * delete group
// * add user to group
// * add report to group
// delete user from group
// delete report from group

// convert state back to original json format

const addUser = ({ state, id }) => {
  const { users } = state;

  if (!users.has(id)) {
    const newSet = new Set(users);

    newSet.add(id);

    return { ...state, users: newSet };
  }
};

const addGroup = ({ state, id }) => {
  const { groups } = state;

  if (!(id in groups)) {
    const newObject = {
      ...groups,
      [id]: { reportIDs: new Set(), userIDs: new Set() },
    };

    return { ...state, groups: newObject };
  }
};

const deleteUser = ({ state, id }) => {
  const { groups, users } = state;

  if (users.has(id)) {
    const newSetA = new Set(users);

    newSetA.delete(id);

    const newObject = Object.fromEntries(
      Object.entries(groups).map(([group, sets]) => {
        const { userIDs } = sets;

        if (userIDs.has(id)) {
          const newSetB = new Set(userIDs);

          newSetB.delete(id);

          return [group, { ...sets, userIDs: newSetB }];
        }

        return [group, sets];
      })
    );

    return { ...state, groups: newObject, users: newSetA };
  }
};

const deleteGroup = ({ state, id }) => {
  const { groups } = state;

  if (id in groups) {
    const { [id]: deletedGroup, ...newObject } = groups;

    return { ...state, groups: newObject };
  }
};

const addUserToGroup = ({ groupID, userID, state }) => {
  const { groups } = state;

  const group = groups[groupID];

  const { userIDs } = group;

  if (!userIDs.has(userID)) {
    const newSet = new Set(userIDs);

    newSet.add(userID);

    return {
      ...state,
      groups: { ...groups, [groupID]: { ...group, userIDs: newSet } },
    };
  }
};

const addReportToGroup = ({ reportID, groupID, state }) => {
  const { groups } = state;

  const group = groups[groupID];

  const { reportIDs } = group;

  if (!reportIDs.has(reportID)) {
    const newSet = new Set(reportIDs);

    newSet.add(reportID);

    return {
      ...state,
      groups: { ...groups, [groupID]: { ...group, reportIDs: newSet } },
    };
  }
};

export default function App() {
  const fetchedUsers = usePromise(promises.users);

  const fetchedReports = usePromise(promises.reports);

  const [users, reports] = [
    ensureIsArray(fetchedUsers),
    ensureIsArray(fetchedReports),
  ];

  const getLists = () => {
    const lists = { users: new Set(), reports: {}, groups: {} };

    const {
      reports: reportsLookup,
      groups: groupsTable,
      users: usersSet,
    } = lists;

    // fill users & userIDs in groups
    users.forEach(({ [usersPrimaryKey]: userID, ...groupData }) => {
      usersSet.add(userID);

      Object.entries(groupData).forEach(([group, access]) => {
        if (!(group in groupsTable)) {
          groupsTable[group] = { reportIDs: new Set(), userIDs: new Set() };
        }

        const set = groupsTable[group].userIDs;

        if (access) set.add(userID);
      });
    });

    // fill reports & reportIDs in groups
    reports.forEach(({ groups = [], ...report }) => {
      const reportID = report[reportsPrimaryKey];

      reportsLookup[reportID] = report;

      groups.forEach((group) => {
        if (!(group in groupsTable)) {
          groupsTable[group] = { reportIDs: new Set(), userIDs: new Set() };
        }

        const set = groupsTable[group].reportIDs;

        set.add(reportID);
      });
    });

    return lists;
  };

  const lists = getLists();

  console.log(lists);

  return <div>Hello!</div>;
}
