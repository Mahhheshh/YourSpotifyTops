import { DashboardProps } from "../../types";

import { CardList } from "./Card";

const Dashboard: React.FC<DashboardProps> = ({ userData }: DashboardProps ) => {
    return (
        <div className = "flex flex-col lg:flex-row flex-1" >
            <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
                <div className="p-4 mb-2">
                    <h2 className="text-xl font-semibold mb-1">Top Tracks</h2>
                </div>
                <div>
                    <CardList items={userData.tracks} />
                </div>
            </div>
            <div className="text-xl font-semibold mb-2 text-center lg:w-1/2 p-4">
                <div className="p-4 mb-2">
                    <h2 className="text-xl font-semibold mb-1">Top Artists</h2>
                </div>
                <div>
                    <CardList items={userData.artists} />
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
