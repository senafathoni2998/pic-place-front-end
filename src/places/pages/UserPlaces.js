import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Empire_State_Building_%28cropped%29.jpg/800px-Empire_State_Building_%28cropped%29.jpg",
    address: "20 W 34th St, New York, NY 10001, USA",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Eiffel Tower",
    description:
      "A wrought-iron lattice tower on the Champ de Mars in Paris, France.",
    imageUrl:
      "https://planetrail.co.uk/wp-content/uploads/Eiffel-Tower-Paris-resized-600x398.jpg",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    location: {
      lat: 48.8588443,
      lng: 2.2943506,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userID = useParams().userId;
  const userPlaces = DUMMY_PLACES.filter((p) => p.creator === userID);
  return <PlaceList places={userPlaces} />;
};

export default UserPlaces;
