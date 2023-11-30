import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { geocodeAddress } from "../utils/geocoding.js";

export const createListing = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      stratum,
      meters,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;

    // Geocodifica la dirección
    const geocodedData = await geocodeAddress(address);

    // Crea el nuevo listado con las coordenadas geocodificadas
    const newListing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      stratum,
      meters,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
      coordinates: {
        lat: geocodedData.geometry.lat,
        lon: geocodedData.geometry.lng,
      },
    });

    return res.status(201).json(newListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Boolean filters
    const offer =
      req.query.offer !== undefined
        ? req.query.offer === "true"
        : { $in: [false, true] };
    const furnished =
      req.query.furnished !== undefined
        ? req.query.furnished === "true"
        : { $in: [false, true] };
    const parking =
      req.query.parking !== undefined
        ? req.query.parking === "true"
        : { $in: [false, true] };

    // Type filter
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    //Numeric filter
    const meters = req.query.meters;
    const metersFilter = meters ? { meters: parseFloat(meters) } : {};

    const stratum = req.query.stratum;
    const stratumFilter = stratum ? { stratum: parseInt(stratum) } : {};

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
      ...metersFilter,
      ...stratumFilter,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
