import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserDataContext } from "../App";
import { CardList } from "./Card";
import Title from "./Title";

import { Artist, StateData, Track } from "../../types";

type trackItem = {
  id: string;
  name: string;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
};

type artistItem = {
  id: string;
  images: Array<{ url: string }>;
  name: string;
};

const fetchData = (url: string, token: string) => {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        // 401: Token has expired.. 
        if (response.status === 401) {
          localStorage.removeItem("stateData");
        }
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
    queryKey: ["tracks", state.accessToken],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/top/tracks",
        state.accessToken,
      ).then((data) => {
        const trackData: Array<Track> = [];
        data.items.forEach((track: trackItem) => {
          trackData.push({
            id: track.id,
            name: track.name,
            imageUrl: track.album.images[0].url,
            description: track.album.name,
          });
        });
        return trackData;
      });
    },
    enabled: state.accessToken !== "",
  });

  const artistsQuery = useQuery({
    queryKey: ["artists", state.accessToken],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/top/artists",
        state.accessToken,
      ).then((data) => {
        const artistData: Array<Artist> = [];
        data.items.forEach((artist: artistItem) => {
          artistData.push({
            id: artist.id,
            name: artist.name,
            imageUrl: artist.images[0].url,
          });
        });
        return artistData;
      });
    },
    enabled: state.accessToken !== "",
  });

  const userProfileQuery = useQuery({
    queryKey: ["userProfile", state.accessToken],
    queryFn: () => {
      return fetchData("https://api.spotify.com/v1/me", state.accessToken).then(
        (data) => {
          return {
            display_name: data.display_name,
            imageUrl: data.images.length ? data.images[0].url : "/profile.svg",
          };
        },
      );
    },
    enabled: state.accessToken !== "",
  });

  const playlistQuery = useQuery({
    queryKey: ["playlists", state.accessToken],
    queryFn: () => {
      return fetchData(
        "https://api.spotify.com/v1/me/playlists",
        state.accessToken,
      ).then((data) => {
        const playListNames: Array<string> = [];
        data.items.forEach((playlist: { name: string }) => {
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
        imageUrl: userProfileQuery.data.imageUrl,
        playlistNames: playlistQuery.data,
        tracks: tracksQuery.data,
        artists: artistsQuery.data,
      },
    });
    const parsedStoredData: StateData = JSON.parse((localStorage.getItem("stateData") as string) || "{}");
    parsedStoredData.display_name = userProfileQuery.data.display_name;
    parsedStoredData.imageUrl = userProfileQuery.data.imageUrl;
    parsedStoredData.playlistNames = playlistQuery.data;
    parsedStoredData.tracks = tracksQuery.data;
    parsedStoredData.artists = artistsQuery.data;
    parsedStoredData.accessToken = state.accessToken;
    localStorage.setItem("stateData", JSON.stringify(parsedStoredData));
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
