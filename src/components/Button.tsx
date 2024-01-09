import { useEffect } from "react";
import { ButtonProps } from "../../types";

const Button: React.FC<ButtonProps> = ({ label, handleSetToken }: ButtonProps) => {
    const clientId: string = "c17ce726db8b41e3ba0fa6b1a8b087c1";
    const redirectUri: string = window.location.origin;
    const authUri: string = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/&response_type=token&show_dialog=true&scope=user-top-read,user-read-private
,user-read-email`;

    useEffect(() => {
        const parseAccessToken = () => {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = params.get('access_token');

            if (accessToken) {
                handleSetToken(accessToken);
            }
        };

        parseAccessToken();
    });

    return (
        <div className="flex items-center justify-center h-screen">
            <a
                href={authUri}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                {label}
            </a>
        </div>
    );
};

export default Button;
