import { HandleSetToken } from "../../types";

import Button from "./Button";

const HomePage: React.FC<HandleSetToken> = ({handleSetToken}: HandleSetToken) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-8">View Your Top's</h1>
      <Button label={"Login With Spotify"} handleSetToken={handleSetToken}></Button>   
    </div>
  );
}

export default HomePage;
