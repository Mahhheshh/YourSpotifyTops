import { useEffect, useContext } from "react";

import { ButtonProps } from "../../types";
import { UserDataContext } from "../App";

const Button: React.FC<ButtonProps> = ({ label }: ButtonProps) => {
  const { state, dispatchData } = useContext(UserDataContext);
  const clientId: string = "c17ce726db8b41e3ba0fa6b1a8b087c1";
  const redirectUri: string = `${window.location.origin}/callback`;
  const scopes: string = "user-top-read,user-read-private,user-read-email";
  const authUri: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true&scope=${scopes}`;
  useEffect(() => {
    const parseAccessToken = () => {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      if (accessToken) {
        dispatchData({
          type: "SET_TOKEN",
          payload: {
            ...state,
            accessToken: accessToken,
          },
        });
      }
    };

    parseAccessToken();
  });

  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out"
      onClick={() => (window.location.href = authUri)}
    >
      {label}
    </button>
  );
};

export default Button;
