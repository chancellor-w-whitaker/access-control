import { useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { ButtonGroup } from "./components/ButtonGroup";
import { usePromise } from "./hooks/usePromise";
import { Section } from "./components/Section";
import { Button } from "./components/Button";
import { Main } from "./components/Main";

const getJsonPromise = (url) => fetch(url).then((response) => response.json());

const ensureIsArray = (param) => (Array.isArray(param) ? param : []);

const constants = {
  users: {
    nonEditableIDs: ["default internal", "default external"],
    url: "data/users.json",
    primaryKey: "email",
  },
  reports: {
    url: "data/reports.json",
    nonEditableIDs: [],
    primaryKey: "link",
  },
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
// * delete user from group
// * delete report from group

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

const deleteUserFromGroup = ({ groupID, userID, state }) => {
  const { groups } = state;

  const group = groups[groupID];

  const { userIDs } = group;

  if (userIDs.has(userID)) {
    const newSet = new Set(userIDs);

    newSet.delete(userID);

    return {
      ...state,
      groups: { ...groups, [groupID]: { ...group, userIDs: newSet } },
    };
  }
};

const deleteReportFromGroup = ({ reportID, groupID, state }) => {
  const { groups } = state;

  const group = groups[groupID];

  const { reportIDs } = group;

  if (reportIDs.has(reportID)) {
    const newSet = new Set(reportIDs);

    newSet.delete(reportID);

    return {
      ...state,
      groups: { ...groups, [groupID]: { ...group, reportIDs: newSet } },
    };
  }
};

export default function App() {
  const [activeGrid, setActiveGrid] = useState("users");

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

  const getGrids = () => {
    const reports = Object.keys(lists.reports).map((reportID) => {
      const groupAccess = Object.fromEntries(
        Object.entries(lists.groups).map(([groupID, { reportIDs }]) => [
          groupID,
          reportIDs.has(reportID),
        ])
      );

      return { [reportsPrimaryKey]: reportID, ...groupAccess };
    });

    const users = [...lists.users].map((userID) => {
      const groupAccess = Object.fromEntries(
        Object.entries(lists.groups).map(([groupID, { userIDs }]) => [
          groupID,
          userIDs.has(userID),
        ])
      );

      return { [usersPrimaryKey]: userID, ...groupAccess };
    });

    return { reports, users };
  };

  const grids = getGrids();

  const rowData = grids[activeGrid];

  const firstRow =
    Array.isArray(rowData) && rowData.length > 0 ? rowData[0] : {};

  const activePrimaryKey = constants[activeGrid].primaryKey;

  const editable = ({ colDef: { field }, data }) =>
    !constants[activeGrid].nonEditableIDs.includes(data[activePrimaryKey]) &&
    field !== activePrimaryKey;

  const columnDefs = Object.keys(firstRow).map((field) => {
    return {
      lockPosition: field === activePrimaryKey,
      pinned: field === activePrimaryKey,
      editable,
      field,
    };
  });

  const onGridPreDestroyed = useCallback((params) => {
    const { state } = params;

    const model = params.api.getModel();

    const { rowsToDisplay } = model;

    const rowDataState = rowsToDisplay.map(({ data }) => data);

    console.log(rowDataState);
  }, []);

  return (
    <Main>
      <Section>
        <ButtonGroup>
          <Button
            onClick={() => setActiveGrid("users")}
            active={activeGrid === "users"}
            variant="primary"
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveGrid("reports")}
            active={activeGrid === "reports"}
            variant="primary"
          >
            Reports
          </Button>
        </ButtonGroup>
      </Section>
      <Section>
        <div className="ag-theme-quartz" style={{ height: 500 }}>
          <AgGridReact
            onGridPreDestroyed={onGridPreDestroyed}
            columnDefs={columnDefs}
            rowData={rowData}
            key={rowData}
          ></AgGridReact>
        </div>
      </Section>
    </Main>
  );
}
