import { usePromise } from "./hooks/usePromise";
import { Section } from "./components/Section";
import { Main } from "./components/Main";

const prerequisites = {
  reports: { url: "data/reports.json", primaryKey: "link" },
  users: { url: "data/users.json", primaryKey: "email" },
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
  const users = usePromise(promises.users);

  const reports = usePromise(promises.reports);

  const usersArray = Array.isArray(users) ? users : [];

  const reportsArray = Array.isArray(reports) ? reports : [];

  // reminder: each report's "groups" array will become stale once changes are saved
  // since you will need to convert the stateful data back to the original format anyway,
  // it may be more semantically correct to dump each report into a new object without their "groups" property
  const reportsLookup = Object.fromEntries(
    reportsArray.map((report) => [report[reportsPrimaryKey], report])
  );

  const mapGroupsToIDs = () => {
    const object = {};

    usersArray.forEach(({ [usersPrimaryKey]: id, ...groupData }) => {
      Object.entries(groupData).forEach(([group, value]) => {
        if (!(group in object)) {
          object[group] = { reportIDs: new Set(), userIDs: new Set() };
        }

        const setOfIDs = object[group].userIDs;

        if (value) setOfIDs.add(id);
      });
    });

    reportsArray.forEach(({ [reportsPrimaryKey]: id, groups = [] }) => {
      groups.forEach((group) => {
        if (!(group in object)) {
          object[group] = { reportIDs: new Set(), userIDs: new Set() };
        }

        const setOfIDs = object[group].reportIDs;

        setOfIDs.add(id);
      });
    });

    return object;
  };

  const groupsToIDs = mapGroupsToIDs();

  console.log("Relationship Data", groupsToIDs);

  console.log("Reports Lookup", reportsLookup);

  // need to derive relationships between groups, users, & reports
  // do users have any other attributes besides their id (email) & the groups they belong to?
  // don't think so!

  // data structure:
  //   const obj = {
  //     groupID1: { reportIDs: new Set(), userIDs: new Set() },
  //     groupID2: { reportIDs: new Set(), userIDs: new Set() },
  //     groupID3: { reportIDs: new Set(), userIDs: new Set() },
  //     ...
  //   };

  return (
    <Main>
      <Section></Section>
    </Main>
  );
}
