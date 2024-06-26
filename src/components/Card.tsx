import { Artist, Track, CardProps } from "../../types";

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUri,
}: CardProps) => {
  return (
    <div className="bg-[#3F5E5A] rounded-lg shadow-lg p-4 mb-2 flex items-center hover:cursor-pointer">
      <div className="flex-shrink-0 mr-4">
        <img
          src={imageUri}
          alt="Your Image"
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
      <div className="overflow-hidden text-left text-white ">
        <h2 className="text-xl font-semibold mb-2 whitespace-nowrap overflow-hidden">
          {title}
        </h2>
        <p className="text-sm whitespace-nowrap">{description}</p>
      </div>
    </div>
  );
};

export const CardList = ({ items }: { items: (Track | Artist)[] }) => {
  return (
    <div>
      {items.map((item) => (
        <Card
          key={item.id}
          title={item.name}
          description={item.description || ""}
          imageUri={item.imageUrl}
        />
      ))}
    </div>
  );
};
