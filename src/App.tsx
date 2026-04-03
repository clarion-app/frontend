import { ClarionRoutes } from "./build/ClarionRoutes";
// import { ClarionRoutes as NewRoutes } from "./Routes";
import useClarionEvents from "./build/useClarionEvents";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "./hooks";
import { selectLoggedInUser } from "./user/loggedInUserSlice";
import Login from "./user/Login";
import { useUsersExistQuery } from "./user/userApi";
import { NewUser } from "./user/NewUser";
import { backendUrl } from "./build/backendUrl";
import { postAndThen } from "./fetchAndThen";
import { LocalNodes } from "./node/LocalNodes";
import { selectCurrentNode, setCurrentNode } from "./node/currentNodeSlice";
import { SideDrawer } from "./SideDrawer";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "./auth/useAuth";
import "./SideDrawer.css";

interface BlockchainSetupPropsType {
  shouldPoll: Function;
}

const BlockchainSetup = (props: BlockchainSetupPropsType) => {
  const [decision, setDecision] = useState("undecided");
  const [chosenNode, setChosenNode] = useState("");
  const localNode = useAppSelector(selectCurrentNode);
  const { shouldPoll } = props;

  useEffect(() => {
    let url = '';
    switch(decision) {
      case "create":
        url = `${backendUrl}/api/clarion/system/network/create`;
        postAndThen(url, {}, () => {
          shouldPoll(true);
        });
        break;
      case "choose":
        console.log('Chose ', chosenNode);
        url = `${backendUrl}/api/clarion/system/network/join`;
        postAndThen(url, { node_id: chosenNode }, () => {
          shouldPoll(true);
        });
        break;
      default:
        break;
    }
  }, [decision, shouldPoll, chosenNode]);

  return <div className="container">
    <h1 className="title">Welcome to Clarion</h1>
    {decision === "undecided" && (
      <div>
        <p>Would you like to create a new Clarion network or join an existing one?</p>
        <button className="button" onClick={() => setDecision("create")}>Create</button>
        <button className="button" onClick={() => setDecision("join")}>Join</button>
      </div>)}
    {decision === "join" && <LocalNodes excludeNodes={[localNode.node_id]} chooseNode={(id: string) => {
      setChosenNode(id);
      setDecision("choose");
      }} />}
  </div>;
}

function App() {
  const dispatch = useAppDispatch();
  const [shouldPoll, setShouldPoll] = useState(true);
  const loggedInUser = useAppSelector(selectLoggedInUser);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data, isLoading, isError } = useUsersExistQuery({}, {
    pollingInterval: shouldPoll ? 5000 : undefined
  });

  const handleShouldPoll = useCallback((value: boolean) => {
    setShouldPoll(value);
  }, []);

  useAuth();
  useClarionEvents();
  useEffect(() => {
    if(data?.blockchainCreated && data?.usersExist) {
      setShouldPoll(false);
    }
  }, [data]);

  if(isLoading) {
    return <div role="status">Loading...</div>;
  }

  if(isError) {
    return <div role="alert">Unable to connect to server. Please try again.</div>;
  }

  if(data?.node) {
    dispatch(setCurrentNode(data.node));
  }

  if(!data?.blockchainCreated) {
    return <BlockchainSetup shouldPoll={handleShouldPoll} />;
  }

  if(!loggedInUser.id) {
    if(data?.usersExist) {
      return <Login />;
    }
    return <NewUser />;
  }

  if(Notification.permission === 'default') {
    try {
      Notification.requestPermission().then(permission => {
        if(permission === 'granted') {
          new Notification('Clarion', { body: 'Welcome to Clarion!' });
        }
      });
    } catch {
      // Notification API not available
    }
  }

  return (
    <div
    style={{ height: "100vh" }}
    >
      <header className="header container">
      <button
          style={{
            position: "fixed",
            left: "1rem",
            top: "1rem",
            zIndex: 1100,
          }}
          onClick={() => setDrawerOpen(!drawerOpen)}
        >
          ☰
        </button>
        <h3 className="title" style={{ marginLeft: "3rem" }}>{loggedInUser.name}</h3>
      </header>
      <SideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <main>
        <section className="section container">
          <ErrorBoundary>
            <ClarionRoutes />
          </ErrorBoundary>
        </section>
      </main>
    </div>
  )
}

export default App
