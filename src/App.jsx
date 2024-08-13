import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";

import { CardBody } from "./components/Card/CardBody";
import { isEditable, constants } from "./constants";
import { usePromise } from "./hooks/usePromise";
import { Main } from "./components/Main";
import { Card } from "./components/Card";

// ! do this !

// ? strings justified left, numbers justified right
// * columns are either intrinsically typed, or you just justify each value accordingly
// * let's try the second approach

// email column to the left & frozen
// search somebody (filter sheet or highlight by search)
// functionality to delete rows & columns but must be difficult
// however, don't allow default internal & external to be deleted
// ability to add columns (create group--add ability to add group to reports)
// ability to add rows (adding a user)
// input validation
// maintain running changes so you can...
// discard changes
// save changes
// make height of spreadsheet larger
// switch between users & reports as rows (only complication being having to add a report to json file later)
// checkboxes for cells

// ! don't worry about these for now !
// functionality for displaying user & group relationships (get creative)
// consider how to show relationship between users, groups, and reports

// ↓ anatomy of spreadsheet data ↓

/*

const columnLabels = ["Flavour", "Food"];

const rowLabels = ["Item 1", "Item 2"];

const data = [
  [{ value: "Vanilla" }, { value: "Chocolate" }],
  [{ value: "Strawberry" }, { value: "Cookies" }],
];

*/

export default function App() {
  const reports = usePromise(constants.reports.promise);

  const setOfGroups =
    Array.isArray(reports) && reports.length > 0
      ? new Set(reports.map(({ groups }) => groups).flat())
      : [];

  const something = Object.fromEntries(
    reports.map(({ groups, link }) => [link, groups])
  );

  console.log(something);

  const users = usePromise(constants.users.promise);

  console.log(reports, users);

  const rowData = users;

  const columnDefs =
    Array.isArray(rowData) && rowData.length > 0
      ? Object.keys(rowData[0]).map((field) => {
          const isIdentifierColumn = field === constants.users.identifier;

          const def = {
            lockPosition: isIdentifierColumn,
            pinned: isIdentifierColumn,
            editable: isEditable,
            field,
          };

          if (!isIdentifierColumn) def.type = "numericColumn";

          return def;
        })
      : [];

  return (
    <Main>
      <Card className="my-3 shadow">
        <CardBody>
          <div className="ag-theme-quartz" style={{ height: 500 }}>
            <AgGridReact columnDefs={columnDefs} rowData={rowData} />
          </div>
        </CardBody>
      </Card>
    </Main>
  );
}
