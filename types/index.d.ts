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

export interface UserTop {
    tracks: Track[];
    artists: Artist[];
}

export interface HandleSetToken {
    (newToken: string): void;
}

interface ButtonProps {
    label: string;
    handleSetToken: (value: string) => void;
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
    images: Image[];
    playlists?: string[];
}