import Spreadsheet from "react-spreadsheet";
import { useMemo } from "react";

import { useResettableState } from "./hooks/useResettableState";
import { CardBody } from "./components/Card/CardBody";
import { usePromise } from "./hooks/usePromise";
import { Button } from "./components/Button";
import { Main } from "./components/Main";
import { Card } from "./components/Card";
import { constants } from "./constants";

// ! do this !
// strings justified left, numbers justified right
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

// ? don't worry about this for now ?
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

const { identifierKey, usersPromise } = constants;

export default function App() {
  const users = usePromise(usersPromise);

  const { data: initialData, ...labels } = useMemo(
    () => getSpreadsheetDataAndLabels(users),
    [users]
  );

  const [data, setData] = useResettableState(initialData);

  const spreadsheetDataIsReady = Array.isArray(data) && data.length > 0;

  return (
    <Main textColor={`white`} textOpacity={75} bgColor={`dark`} bgOpacity={75}>
      <Button variant="primary">Chance</Button>
      Did it work?
      {/* <Card className="my-3 shadow">
        <CardBody>
          <div className="overflow-auto">
            {spreadsheetDataIsReady && (
              <Spreadsheet
                data={data}
                {...labels}
                onChange={setData}
              ></Spreadsheet>
            )}
          </div>
        </CardBody>
      </Card> */}
    </Main>
  );
}

const getSpreadsheetDataAndLabels = (fetchResult) => {
  const canProceed = Array.isArray(fetchResult) && fetchResult.length > 0;

  if (!canProceed) return { columnLabels: null, data: null };

  const fetchedData = fetchResult;

  const columnLabels = Object.keys(fetchedData[0]).sort(
    (a, b) => (a === "email" ? 0 : 1) - (b === "email" ? 0 : 1)
  );

  const data = fetchedData.map((row) =>
    columnLabels.map((key) => ({
      readOnly: key === identifierKey,
      originalKey: key,
      value: row[key],
    }))
  );

  // const rowLabels = data.map(
  //   (row) => row.find(({ originalKey }) => originalKey === identifierKey).value
  // );

  return { columnLabels, data };
};
