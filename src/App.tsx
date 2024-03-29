import { useState, useEffect } from 'react';
import { HandleSetToken, Track, Artist, UserTop, TitleProp } from '../types';

import Button from './components/Button';
import Dashboard from './components/Dashboard';
import Title from './components/Title';

function App() {
  const [accessToken, setToken] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [data, setData] = useState<UserTop>({ "tracks": [], "artists": [] });
  const [userProfile, setUserProfile] = useState<TitleProp>({ "display_name": "", "images": [{ "url": "", "height": 0, "width": 0 }], "playlists": [] });

  const handleSetToken: HandleSetToken = (newToken: string) => {
    setToken(newToken);
  }

  const fetchData = (url: string, token: string) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        throw error;
      });
  };

  useEffect(() => {
    if (accessToken === "") {
      return;
    }

    const setStateData = () => {
      fetchData("https://api.spotify.com/v1/me/top/tracks?limit=5", accessToken)
        .then((topTracks) => {
          setTracks(topTracks.items);
        })
        .catch((error): void => {
          console.log(`${error} encountred while fetching top tracks`);
        });

      fetchData("https://api.spotify.com/v1/me/top/artists?limit=5", accessToken)
        .then((TopArtists) => {
          setArtists(TopArtists.items);
        })
        .catch((error): void => {
          console.log(`${error} encountred while fetching top artists`);
        });

      fetchData("https://api.spotify.com/v1/me", accessToken)
        .then((userInfo) => {
          setUserProfile(userInfo);
        })
        .catch((error): void => {
          console.log(`${error} encountred while fetching user info`);
        });
    };

    setStateData();
  }, [accessToken]);


  useEffect(() => {
    setData({ "tracks": tracks, "artists": artists });
  }, [tracks, artists]);

  useEffect(() => {
    fetchData("https://api.spotify.com/v1/me/playlists", accessToken).then((playListData) => {
      let playListNames: Array<string> = [];
      playListData.items.map((playList: any) => {
        playListNames.push(playList.name);
      });
      console.log(userProfile);
      let updatedProfile = {
        "display_name": userProfile.display_name,
        "images": userProfile.images,
        playlists: playListNames

      };
      setUserProfile(updatedProfile);
      console.log(userProfile);
    })
  }, [userProfile])

  return (
    <>
    {
      accessToken === "" ? (
        <Button label={"View Your Top's"} handleSetToken={handleSetToken} />
      ) : (
        <div className="bg-[#38423B] h-screen">
          <Title display_name={userProfile.display_name} images={userProfile.images} playlists={userProfile.playlists} />
          <Dashboard userData={data} />
        </div>
      )
    }
    </>
  )
}

export default App;
