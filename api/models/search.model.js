import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    offer: {
      type: Boolean,
    },
    furnished: {
      type: Boolean,
    },
    parking: {
      type: Boolean,
    },
    stratum: {
      type: Number,
    },
    meters: {
      type: Number,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    matchingListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
      },
    ],
  },
  { timestamps: true }
);

const Search = mongoose.model("Search", searchSchema);

export default Search;
