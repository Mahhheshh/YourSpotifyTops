export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Track {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface HandleSetToken {
  handleSetToken: (newToken: string) => void;
}

interface ButtonProps {
  label: string;
}

interface CardProps {
  key?: string;
  title: string;
  description?: string;
  imageUri: string;
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
