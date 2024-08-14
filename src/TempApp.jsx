import { useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import { ButtonGroup } from "./components/ButtonGroup";
import { CardBody } from "./components/Card/CardBody";
import { CardLink } from "./components/Card/CardLink";
import { usePromise } from "./hooks/usePromise";
import { Button } from "./components/Button";
import { Main } from "./components/Main";
import { Card } from "./components/Card";

const prerequisites = {
  users: {
    nonEditableValues: ["default internal", "default external"],
    url: "data/users.json",
    primaryKey: "email",
  },
  reports: {
    url: "data/reports.json",
    nonEditableValues: [],
    primaryKey: "link",
  },
};

const {
  reports: { primaryKey: reportsPrimaryKey },
  users: { primaryKey: usersPrimaryKey },
} = prerequisites;

const promises = {
  reports: fetch(prerequisites.reports.url).then((response) => response.json()),
  users: fetch(prerequisites.users.url).then((response) => response.json()),
};

export default function App() {
  const [activeGrid, setActiveGrid] = useState("users");

  const [gridVisible, setGridVisible] = useState(true);

  /*
  const [rowData, setRowData] = useState();

  const [initialState, setInitialState] = useState({
    reports: null,
    users: null,
  });

  const onGridReady = useCallback((params) => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  const onGridPreDestroyed = useCallback((params) => {
    const { state } = params;
    console.log("Grid state on destroy (can be persisted)", state);
    setInitialState((object) => ({ [activeGrid]: state, ...object }));
  }, []);

  const reloadGrid = useCallback(() => {
    setGridVisible(false);
    setTimeout(() => {
      setRowData(undefined);
      setGridVisible(true);
    });
  }, []);
  */

  const users = usePromise(promises.users);

  const reports = usePromise(promises.reports);

  const usersArray = Array.isArray(users) ? users : [];

  const reportsArray = Array.isArray(reports) ? reports : [];

  const getState = () => {
    // every groupID: { userIDs: new Set(), reportIDs: new Set() }
    const groupsTable = {};

    // every reportID: { ...report }
    const reportsTable = {};

    // set of userIDs
    const usersTable = new Set();

    // get users table and fill each group's userIDs
    usersArray.forEach((user) => {
      const { [usersPrimaryKey]: id, ...groupData } = user;

      usersTable.add(id);

      Object.entries(groupData).forEach(([group, value]) => {
        if (!(group in groupsTable)) {
          groupsTable[group] = {
            reportIDs: new Set(),
            userIDs: new Set(),
          };
        }

        const setOfIDs = groupsTable[group].userIDs;

        if (value) setOfIDs.add(id);
      });
    });

    // get reports table and fill each group's reportIDs
    reportsArray.forEach((report) => {
      const { groups = [], ...rest } = report;

      const id = rest[reportsPrimaryKey];

      reportsTable[id] = { ...rest };

      groups.forEach((group) => {
        if (!(group in groupsTable)) {
          groupsTable[group] = {
            reportIDs: new Set(),
            userIDs: new Set(),
          };
        }

        const setOfIDs = groupsTable[group].reportIDs;

        setOfIDs.add(id);
      });
    });

    const tables = {
      reports: reportsTable,
      groups: groupsTable,
      users: usersTable,
    };

    return tables;
  };

  const state = getState();

  const getGrids = () => {
    const groupNames = Object.keys(state.groups);

    const allGroupNamesUnchecked = Object.fromEntries(
      groupNames.map((groupID) => [groupID, false])
    );

    const userRows = Object.fromEntries(
      [...state.users].map((userID) => [userID, { ...allGroupNamesUnchecked }])
    );

    const reportRows = Object.fromEntries(
      Object.keys(state.reports).map((reportID) => [
        reportID,
        { ...allGroupNamesUnchecked },
      ])
    );

    Object.entries(state.groups).forEach(
      ([groupID, { reportIDs, userIDs }]) => {
        userIDs.forEach((userID) => (userRows[userID][groupID] = true));

        reportIDs.forEach((reportID) => (reportRows[reportID][groupID] = true));
      }
    );

    const usersGrid = Object.entries(userRows).map(([userID, row]) => ({
      [usersPrimaryKey]: userID,
      ...row,
    }));

    const reportsGrid = Object.entries(reportRows).map(([reportsID, row]) => ({
      [reportsPrimaryKey]: reportsID,
      ...row,
    }));

    const grids = { reports: reportsGrid, users: usersGrid };

    return grids;
  };

  const grids = getGrids();

  const switchToUsersGrid = () => setActiveGrid("users");

  const switchToReportsGrid = () => setActiveGrid("reports");

  const rowData = grids[activeGrid];

  const activePrimaryKey = prerequisites[activeGrid].primaryKey;

  const editable = ({ colDef: { field }, data }) =>
    data[activePrimaryKey] !== "default internal" &&
    data[activePrimaryKey] !== "default external" &&
    field !== activePrimaryKey;

  const columnDefs = Object.entries(
    typeof rowData[0] === "object" ? rowData[0] : {}
  ).map(([field]) => ({
    lockPosition: field === activePrimaryKey,
    pinned: field === activePrimaryKey,
    editable,
    field,
  }));

  // maintain active state of grids (even after switching)
  // give options to save
  // then give option to return to server (needs to be sent back in the original format)

  console.log(rowData, columnDefs);

  // create new user
  // create new group
  // modify user's access to different groups
  // modify report's visibility to different groups

  // turn tables object back into returnToServerData
  // turn tables object into modifiableData

  return (
    <Main>
      <Card className="my-3 shadow-sm">
        <CardBody>
          <ButtonGroup>
            <Button
              active={activeGrid === "users"}
              onClick={switchToUsersGrid}
              variant="primary"
            >
              Users
            </Button>
            <Button
              active={activeGrid === "reports"}
              onClick={switchToReportsGrid}
              variant="primary"
            >
              Reports
            </Button>
          </ButtonGroup>
        </CardBody>
        <CardBody>
          <div className="ag-theme-quartz" style={{ height: 500 }}>
            {gridVisible && (
              <AgGridReact
                // initialState={initialState[activeGrid]}
                // onGridPreDestroyed={onGridPreDestroyed}
                // onGridReady={onGridReady}
                columnDefs={columnDefs}
                rowData={rowData}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </Main>
  );
}
