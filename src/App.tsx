import { useState, useEffect } from "react";
import { UserStateData } from "../types";
import { useQuery } from "@tanstack/react-query";

import Dashboard from "./components/Dashboard";
import Title from "./components/Title";
import HomePage from "./components/HomePage";

interface HandleSetToken {
  (newToken: string): void;
}

function App() {
  const [accessToken, setToken] = useState<string>("");
  const [data, setData] = useState<UserStateData>({
    display_name: "",
    imageUrl: "",
    playlistNames: [],
    tracks: [],
    artists: [],
  });

  const handleSetToken: HandleSetToken = (newToken: string) => {
    setToken(newToken);
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

  const tracksQuery = useQuery({
    queryKey: ["tracks"],
    queryFn: () => {
      return fetchData("https://api.spotify.com/v1/me/top/tracks", accessToken);
    },
    enabled: accessToken !== "",
  });

  const artistsQuery = useQuery({
    queryKey: ["artists"],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/top/artists",
        accessToken
      );
    },
    enabled: accessToken !== "",
  });

  const userProfileQuery = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => {
      return fetchData("https://api.spotify.com/v1/me", accessToken);
    },
    enabled: accessToken !== "",
  });

  const playlistQuery = useQuery({
    queryKey: ["playlists"],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/playlists",
        accessToken
      ).then((data) => {
        let playListNames: Array<string> = [];
        data.items.forEach((playlist: any) => {
          playListNames.push(playlist.name);
        });
        return playListNames;
      });
    },
    enabled: accessToken !== "",
  });

  useEffect(() => {
    if (
      !userProfileQuery.data ||
      !tracksQuery.data ||
      !artistsQuery.data ||
      !playlistQuery.data
    )
      return;
    setData({
      display_name: userProfileQuery.data?.display_name,
      imageUrl: userProfileQuery.data?.images[0].url,
      playlistNames: playlistQuery.data,
      tracks: tracksQuery.data?.items,
      artists: artistsQuery.data?.items,
    });
  }, [
    userProfileQuery.data,
    tracksQuery.data,
    artistsQuery.data,
    playlistQuery.data,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-purple-600">
      {accessToken === "" ? (
        <HomePage handleSetToken={handleSetToken} />
      ) : (
        <div className="container mx-auto md:max-w-6xl">
          <Title
            display_name={data.display_name}
            imageUrl={data.imageUrl}
            playlists={data.playlistNames}
          />
          <Dashboard userData={data} />
        </div>
      )}
    </div>
  );
}

export default App;
