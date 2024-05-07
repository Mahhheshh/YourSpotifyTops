import { useReducer, createContext, Dispatch } from "react";
import { StateDataAction, StateData } from "../types";

import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";


function stateDataReducer(
  state: StateData,
  action: StateDataAction
): StateData {
  console.log(action);
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

const initialState = {
  accessToken: "",
  display_name: "",
  imageUrl: "",
  playlistNames: [],
  tracks: [],
  artists: [],
};

export const UserDataContext = createContext<{state: StateData; dispatchData: Dispatch<StateDataAction>}>({state: initialState, dispatchData: () => {}});

function App() {
  const [state, dispatchData] = useReducer(stateDataReducer, initialState);


  return (
    <UserDataContext.Provider value={{state, dispatchData}}>
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-purple-600">
      {state.accessToken === "" ? (
        <HomePage />
      ) : (
          <Dashboard />
      )}
    </div>
    </UserDataContext.Provider>
  );
}

export default App;
