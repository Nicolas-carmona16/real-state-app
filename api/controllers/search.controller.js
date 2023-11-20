import Search from "../models/search.model.js";
import Listing from "../models/listing.model.js";

export const saveSearch = async (req, res, next) => {
  try {
    const search = await Search.create(req.body);

    let typeCondition;
    if (req.body.type === "all") {
      // Si el tipo es "all", busca propiedades con "rent" o "sale"
      typeCondition = { type: { $in: ["rent", "sale"] } };
    } else {
      // Si el tipo no es "all", busca propiedades con el tipo específico
      typeCondition = { type: req.body.type };
    }

    // Encuentra las propiedades que coinciden con al menos 5 de los 6 parámetros
    const matchingListings = await Listing.find({
      $or: [
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { meters: req.body.meters },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { stratum: req.body.stratum },
            { meters: req.body.meters },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
            { meters: req.body.meters },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
            { meters: req.body.meters },
          ],
        },
        {
          $and: [
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
            { meters: req.body.meters },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { stratum: req.body.stratum },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { offer: req.body.offer },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
          ],
        },
        {
          $and: [
            { ...typeCondition },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
          ],
        },
        {
          $and: [
            { offer: req.body.offer },
            { furnished: req.body.furnished },
            { parking: req.body.parking },
            { stratum: req.body.stratum },
          ],
        },
      ],
    });

    // Actualiza el registro de búsqueda con las propiedades coincidentes
    await Search.findByIdAndUpdate(search._id, { matchingListings });

    return res.status(201).json(search);
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentSearches = await Search.find({
      userRef: req.user.id,
      createdAt: { $gte: threeMonthsAgo },
    }).populate("matchingListings");

    // Obtén las propiedades únicas de todas las búsquedas recientes
    const uniqueListings = recentSearches.reduce((listings, search) => {
      search.matchingListings.forEach((listing) => {
        if (!listings.some((l) => l._id.equals(listing._id))) {
          listings.push(listing);
        }
      });
      return listings;
    }, []);

    res.status(200).json(uniqueListings);
  } catch (error) {
    next(error);
  }
};
