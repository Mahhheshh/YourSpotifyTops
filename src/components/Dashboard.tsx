import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserDataContext } from "../App";
import { CardList } from "./Card";
import Title from "./Title";

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

const Dashboard: React.FC = () => {
  const { state, dispatchData } = useContext(UserDataContext);
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
        imageUrl: userProfileQuery.data.images
          ? userProfileQuery.data.images[0].url
          : "/profile.svg",
        playlistNames: playlistQuery.data,
        tracks: tracksQuery.data.items,
        artists: artistsQuery.data.items,
      },
    });
  }, [
    userProfileQuery.data,
    tracksQuery.data,
    artistsQuery.data,
    playlistQuery.data,
  ]);
  return (
    <div className="container mx-auto md:max-w-6xl">
      <Title
        display_name={state.display_name}
        imageUrl={state.imageUrl}
        playlists={state.playlistNames}
      />

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
          <div className="p-4 mb-2">
            <h2 className="text-xl text-white font-bold mb-1">Top Tracks</h2>
          </div>
          <div>
            <CardList items={state.tracks} />
          </div>
        </div>
        <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
          <div className="p-4 mb-2">
            <h2 className="text-xl text-white font-bold mb-1">Top Artists</h2>
          </div>
          <div>
            <CardList items={state.artists} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
