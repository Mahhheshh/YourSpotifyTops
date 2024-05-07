import { DashboardProps } from "../../types";

import { CardList } from "./Card";
import Title from "./Title";

const Dashboard: React.FC<DashboardProps> = ({ stateData }: DashboardProps) => {
  return (
    <div className="container mx-auto md:max-w-6xl">
      <Title
        display_name={stateData.display_name}
        imageUrl={stateData.imageUrl}
        playlists={stateData.playlistNames}
      />

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
          <div className="p-4 mb-2">
            <h2 className="text-xl text-white font-bold mb-1">Top Tracks</h2>
          </div>
          <div>
            <CardList items={stateData.tracks} />
          </div>
        </div>
        <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
          <div className="p-4 mb-2">
            <h2 className="text-xl text-white font-bold mb-1">Top Artists</h2>
          </div>
          <div>
            <CardList items={stateData.artists} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
