export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Track {
    id: string;
    name: string;
    image: string;
    album: { name: string, [key: string]: Image[] };
}

export interface Artist {
    id: string;
    name: string;
    images: Image[];
}

export interface HandleSetToken {
    handleSetToken: (newToken: string) => void;
}

interface ButtonProps {
    label: string;
    handleSetToken: HandleSetToken.handleSetToken;
}

interface CardProps {
    key?: number;
    title: string;
    description?: string;
    imageUri: string;
}

export interface DashboardProps {
    userData: UserTop;
}

export interface TitleProp {
    display_name: string;
    imageUrl: string;
    playlists?: string[];
}
export interface StateDataAction {
    type: "SET_TOKEN" | "SET_USER_DATA";
    payload: StateData;
} 

export interface StateData {
    accessToken: string;
    display_name: string;
    imageUrl: string;
    playlistNames: string[];
    tracks: Track[];
    artists: Artist[];
}