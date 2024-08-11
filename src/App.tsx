import { ClarionRoutes } from "./build/ClarionRoutes";
import { CircleMenu  } from "./CircleMenu";
import useClarionEvents from "./build/useClarionEvents";
import { useEffect, useState } from "react";
import { useAppSelector } from "./hooks";
import { selectLoggedInUser } from "./user/loggedInUserSlice";
import { selectToken } from "./user/tokenSlice";
import Login from "./user/Login";
import { useUsersExistQuery } from "./user/userApi";
import { NewUser } from "./user/NewUser";
import { backendUrl } from "./build/backendUrl";
import { postAndThen } from "./fetchAndThen";
import { LocalNodes } from "./LocalNodes";

interface BlockchainSetupPropsType {
  shouldPoll: Function;
}

const BlockchainSetup = (props: BlockchainSetupPropsType) => {
  const [decision, setDecision] = useState("undecided");
  const [chosenNode, setChosenNode] = useState("");

  useEffect(() => {
    let url = '';
    switch(decision) {
      case "create":
        url = `${backendUrl}/api/clarion/system/network/create`;
        postAndThen(url, {}, () => {
          props.shouldPoll(true);
        });
        break;
        case "choose":
          console.log('Chose ', chosenNode);
          url = `${backendUrl}/api/clarion/system/network/join`;
          postAndThen(url, { node_id: chosenNode }, () => {
            props.shouldPoll(true);
          });
          break;
        default:
          break;
    }
  }, [decision, props, chosenNode]);

  return <div className="container">
    <h1 className="title">Welcome to Clarion</h1>
    {decision === "undecided" && (
      <div>
        <p>Would you like to create a new Clarion network or join an existing one?</p>
        <button className="button" onClick={() => setDecision("create")}>Create</button>
        <button className="button" onClick={() => setDecision("join")}>Join</button>
      </div>)}
      {decision === "join" && <LocalNodes chooseNode={(id: string) => {
        setChosenNode(id);
        setDecision("choose");
        }} />}
  </div>;
}

function App() {
  const [shouldPoll, setShouldPoll] = useState(true);
  const token = useAppSelector(selectToken);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { data, isLoading } = useUsersExistQuery({}, {
    pollingInterval: shouldPoll ? 5000 : undefined
  });

  useClarionEvents();
  useEffect(() => {
    if(data?.blockchainCreated && data?.usersExist) {
      setShouldPoll(false);
    }
  }, [data]);

  if(isLoading) {
    return <div>Loading...</div>;
  }

  if(!data.blockchainCreated) {
    return <BlockchainSetup shouldPoll={setShouldPoll} />;
  }

  if(!token) {
    if(data.usersExist) {
      return <Login />;
    }
    return <NewUser />;
  }

  return (
    <div
    style={{ height: "100vh" }}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowMenu(true);
        setMenuPosition({ x: e.clientX, y: e.clientY });
      }}
    >
      <header className="header container">
        <h3 className="title">{loggedInUser.name}</h3>
        <CircleMenu showMenu={showMenu} setShowMenu={setShowMenu} position={menuPosition} />
      </header>
      <main>
        <section className="section container">
          <ClarionRoutes />
        </section>
      </main>
    </div>
  )
}

export default App
