import { ButtonProps } from "../../types";

const Button: React.FC<ButtonProps> = ({ label }: ButtonProps) => {
  const clientId: string = import.meta.env.VITE_CLIENT_ID;
  const redirectUri: string = `${window.location.origin}/callback`;
  const scopes: string = "user-top-read,user-read-private,user-read-email";
  const authUri: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&show_dialog=true&scope=${scopes}`;

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
