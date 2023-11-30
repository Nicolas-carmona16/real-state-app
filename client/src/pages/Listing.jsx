import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaSquare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import { Comment } from "../components/Comment";
import Map from "../components/Map";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [comments, setComments] = useState([]);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [recommendedProperties, setRecommendedProperties] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `/api/comment/comments/${params.listingId}`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [params.listingId]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `/api/listing/recommendations/${params.listingId}`
        );
        const data = await response.json();

        if (data.success) {
          setRecommendedProperties(data.nearbyProperties);
        } else {
          console.error("Failed to fetch recommendations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error.message);
      }
    };

    fetchRecommendations();
  }, [params.listingId]);

  const handleCommentSubmit = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/comment/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Filtra los comentarios para excluir el comentario eliminado
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-400"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.regularPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-blue-800" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-blue-800 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${listing.discountPrice.toLocaleString("en-US")} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>
            <ul className="text-blue-800 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                Stratum: {listing.stratum}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaSquare className="text-lg" />
                Meters: {listing.meters}
              </li>
            </ul>
            <div>
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[550px]"
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div>
              <Map
                lat={listing.coordinates.lat}
                lon={listing.coordinates.lon}
              />
            </div>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-800 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
            <Comment
              listingId={listing._id}
              userId={currentUser?._id}
              currentUser={currentUser}
              onCommentSubmit={handleCommentSubmit}
              comments={comments}
              handleDeleteComment={handleDeleteComment}
            />
            {recommendedProperties.length > 0 && (
              <div className="my-7">
                <h2 className="text-2xl font-semibold mb-4">
                  Recommended Listings Nearby
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendedProperties.map((property) => (
                    <div key={property._id} className="border p-4 rounded-lg">
                      <Link to={`/listing/${property._id}`}>
                        <p className="font-semibold text-lg mb-2">
                          {property.name}
                        </p>
                        {property.imageUrls &&
                          property.imageUrls.length > 0 && (
                            <img
                              src={property.imageUrls[0]} // Usa la primera imagen de la matriz
                              alt={`Property: ${property.name}`}
                              className="w-full h-40 object-cover mb-2 rounded-md"
                            />
                          )}
                        <p className="text-gray-500 mb-2">{property.address}</p>
                        <p className="text-blue-800 font-semibold">
                          $
                          {property.offer
                            ? property.discountPrice
                            : property.regularPrice.toLocaleString("en-US")}
                          {property.type === "rent" && " / month"}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
