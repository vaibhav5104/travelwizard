
function computeFeatureVector(itinerary) {
  const { userBudget, totalDays, selectedPlaces = [], selectedHotel } = itinerary;

  // --- Score logic based on budget ---
  let budget_score = 0, midrange_score = 0, luxury_score = 0;

  if (userBudget < 5000) budget_score = 1;
  else if (userBudget < 15000) midrange_score = 1;
  else luxury_score = 1;

  // --- Average rating of selected places ---
  const totalRatings = selectedPlaces.reduce((sum, place) => sum + (place.rating || 0), 0);
  const avgPlaceRating = selectedPlaces.length > 0 ? totalRatings / selectedPlaces.length : 0;

  // --- Hotel rating ---
  const hotelRating = selectedHotel?.Rating || 0;

  // --- Final vector ---
  const featureVector = [
    budget_score,
    midrange_score,
    luxury_score,
    totalDays,
    avgPlaceRating,
    hotelRating
  ];

  return {
    budget_score,
    midrange_score,
    luxury_score,
    featureVector
  };
}

module.exports = computeFeatureVector