import { useReducer, createContext, Dispatch, useEffect } from "react";
import { StateDataAction, StateData } from "../types";

import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";

function stateDataReducer(
  state: StateData,
  action: StateDataAction,
): StateData {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        display_name: action.payload.display_name,
        imageUrl: action.payload.imageUrl,
        playlistNames: action.payload.playlistNames,
        tracks: action.payload.tracks,
        artists: action.payload.artists,
      };
    default:
      return state;
  }
}

export const isEmpty = (stateData: StateData): boolean => {
  return (
    !stateData.accessToken ||
    !stateData.display_name ||
    !stateData.imageUrl ||
    !stateData.playlistNames.length ||
    !stateData.tracks.length ||
    !stateData.artists.length
  );
};

const initialState = {
  accessToken: "",
  display_name: "",
  imageUrl: "",
  playlistNames: [],
  tracks: [],
  artists: [],
};

export const UserDataContext = createContext<{
  state: StateData;
  dispatchData: Dispatch<StateDataAction>;
}>({ state: initialState, dispatchData: () => {} });

function init() {
  const storedState = localStorage.getItem("stateData");
  if (!storedState) {
    return initialState;
  }
  const parsedState = JSON.parse(storedState);
  if (isEmpty(parsedState)) {
    return initialState;
  }
  return JSON.parse(storedState);
}

function App() {
  const [state, dispatchData] = useReducer(stateDataReducer, null, init);
  useEffect(() => {
    if (isEmpty(state)) {
      return;
    }

    const parsedStoredState = JSON.parse(localStorage.getItem("stateData") as string || "{}");
    localStorage.setItem("stateData", JSON.stringify({
      ...parsedStoredState,
      accessToken: state.accessToken,
    }));
    
  }, [state.accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    if (!accessToken) {
      return;
    }
    dispatchData({
      type: "SET_TOKEN",
      payload: {
        ...state,
        accessToken: accessToken,
      },
    });

    window.history.pushState({}, "", "/");
  }, [window.location.hash]);

  return (
    <UserDataContext.Provider value={{ state, dispatchData }}>
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-purple-600">
        {!state.accessToken ? <HomePage /> : <Dashboard />}
      </div>
    </UserDataContext.Provider>
  );
}

export default App;
