import { Artist, Track, CardProps } from "../../types";

export const Card: React.FC<CardProps> = ({ key, title, description, imageUri }: CardProps) => {
  return (
    <div key={key} className="bg-purple-500 rounded-lg shadow-lg p-4 mb-2 flex items-center">
      <div className="flex-shrink-0 mr-4">
        <img src={imageUri} alt="Your Image" className="h-16 w-16 rounded-full object-cover" />
      </div>
      <div className="overflow-hidden text-left">
        <h2 className="text-xl font-semibold mb-2 text-white whitespace-nowrap overflow-hidden">{title}</h2>
        <p className="text-white text-sm">{description}</p>
      </div>
    </div>
  );
};

export const CardList = ({ items }: { items: (Track | Artist)[] }) => {
  return (
    <div>
      {items.map((item, key) => (
        <Card
          key={key}
          title={item.name}
          description={('album' in item) ? item.album.name : 'No album description available'}
          imageUri={('album' in item) ? item.album.images[0].url : item.images[0].url}
        />
      ))}
    </div>
  );
};
