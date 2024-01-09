import { useState, useEffect } from 'react';
import { HandleSetToken, Track, Artist, UserTop, TitleProp } from '../types';

import Button from './components/Button';
import Dashboard from './components/Dashboard';
import Title from './components/Title';

function App() {
  const [accessToken, setToken] = useState<string>("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [data, setData] = useState<UserTop>({"tracks": [], "artists": []});
  const [userProfile, setUserProfile] = useState<TitleProp>({ "display_name": "", "images": [{"url": "", "height": 0, "width": 0}]});

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
          console.log(userInfo);
          setUserProfile(userInfo);
        })
        .catch((error): void => {
          console.log(`${error} encountred while fetching user info`);
        });
    };

    setStateData();
  }, [accessToken]);


  useEffect(() => {
    setData({"tracks": tracks, "artists": artists});
  }, [tracks, artists]);

  return (
    <div className="flex flex-col h-full">
      <div className="lg:w-3/10 bg-blue-300 p-4">
        <div className="items-center justify-center h-screen">
        {accessToken === "" ? (
          <Button label={"Login"} handleSetToken={handleSetToken} />
          ) : (
            <>
              <Title display_name={userProfile.display_name} images={userProfile.images}/>
            <Dashboard userData={data} />
            </>
        )}
        </div>
      </div>
    </div>
  )
}

export default App;
