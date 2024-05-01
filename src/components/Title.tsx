import { TitleProp } from "../../types";

import { Card } from "./Card";

const Title: React.FC<TitleProp> = ({
  display_name,
  imageUrl,
  playlists,
}: TitleProp) => {
  return (
    <div className="text-centered">
      <Card
        title={display_name}
        description={playlists?.join(", ")}
        imageUri={imageUrl}
      />
    </div>
  );
};

export default Title;
