import { TitleProp } from "../../types";

import { Card } from "./Card";

const Title: React.FC<TitleProp> = ({ display_name, images }: TitleProp) => {
    return (
        <div className="text-centered">
        <Card title={display_name} description="" imageUri={images[0].url}/>
        </div>
    );
}

export default Title;