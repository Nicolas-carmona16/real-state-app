import ListingItem from "../components/ListingItem";
import { useEffect, useState } from "react";

export default function Recommendation() {
  const [recommendedListings, setRecommendedListings] = useState([]);

  useEffect(() => {
    const fetchRecommendedListings = async () => {
      try {
        const res = await fetch("/api/search/recommendations?limit=9");
        const data = await res.json();
        setRecommendedListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecommendedListings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
      <div className="">
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-blue-800">
            Recommended Listings
          </h2>
        </div>
        {recommendedListings && recommendedListings.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {recommendedListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        ) : (
          <p className="text-slate-800">you have no recommendations</p>
        )}
      </div>
    </div>
  );
}
