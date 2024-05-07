import { useEffect, useReducer } from "react";
import { StateDataAction, StateData } from "../types";
import { useQuery } from "@tanstack/react-query";

import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";

interface HandleSetToken {
  (newToken: string): void;
}

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

const fetchData = (url: string, token: string) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};

function App() {
  const [state, dispatchData] = useReducer(stateDataReducer, initialState);

  const handleSetToken: HandleSetToken = (newToken) => {
    dispatchData({
      type: "SET_TOKEN",
      payload: {
        ...state,
        accessToken: newToken,
      },
    });
  };

  const tracksQuery = useQuery({
    queryKey: ["tracks"],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/top/tracks",
        state.accessToken
      );
    },
    enabled: state.accessToken !== "",
  });

  const artistsQuery = useQuery({
    queryKey: ["artists"],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/top/artists",
        state.accessToken
      );
    },
    enabled: state.accessToken !== "",
  });

  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => {
      return fetchData("https://api.spotify.com/v1/me", state.accessToken);
    },
    enabled: state.accessToken !== "",
  });

  const playlistQuery = useQuery({
    queryKey: ["playlists"],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/playlists",
        state.accessToken
      ).then((data) => {
        let playListNames: Array<string> = [];
        data.items.forEach((playlist: any) => {
          playListNames.push(playlist.name);
        });
        return playListNames;
      });
    },
    enabled: state.accessToken !== "",
  });
  useEffect(() => {
    if (
      !userProfileQuery.data ||
      !tracksQuery.data ||
      !artistsQuery.data ||
      !playlistQuery.data
    )
      return;
    dispatchData({
      type: "SET_USER_DATA",
      payload: {
        accessToken: state.accessToken,
        display_name: userProfileQuery.data.display_name,
        imageUrl: userProfileQuery.data.images ? userProfileQuery.data.images[0].url : "/profile.svg",
        playlistNames: playlistQuery.data,
        tracks: tracksQuery.data.items,
        artists: artistsQuery.data.items,
      }
    }
    )
  }, [
    userProfileQuery.data,
    tracksQuery.data,
    artistsQuery.data,
    playlistQuery.data,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-purple-600">
      {state.accessToken === "" ? (
        <HomePage handleSetToken={handleSetToken} />
      ) : (
          <Dashboard stateData={state} />
      )}
    </div>
  );
}

export default App;
