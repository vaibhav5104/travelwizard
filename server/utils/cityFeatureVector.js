function cityFeatureVector(bestTime) {
    const text = bestTime.toLowerCase();

    // Map of months to season
    const monthToSeason = {
        january: 'winter',
        february: 'winter',
        march: 'summer',
        april: 'summer',
        may: 'summer',
        june: 'summer',
        july: 'monsoon',
        august: 'monsoon',
        september: 'monsoon',
        october: 'winter',
        november: 'winter',
        december: 'winter'
    };

    // Initialize sets
    const foundMonths = new Set();
    const allMonths = Object.keys(monthToSeason);

    // Match months in text
    for (const month of allMonths) {
        if (text.includes(month)) {
            foundMonths.add(month);
        }
    }

    // Categorize
    let summerCount = 0, winterCount = 0, monsoonCount = 0;
    for (const month of foundMonths) {
        const season = monthToSeason[month];
        if (season === 'summer') summerCount++;
        if (season === 'winter') winterCount++;
        if (season === 'monsoon') monsoonCount++;
    }

    // Compute scores based on total possible
    const summer_score = summerCount / 4;   // Mar-Jun
    const winter_score = winterCount / 6;   // Nov-Feb + Oct
    const monsoon_score = monsoonCount / 3; // Jul-Sep

    // Check if it's year-round
    const allyear = /(throughout|whole year|all year)/.test(text) ? 1 : 0;

    return {
        summer_score: +summer_score.toFixed(2),
        winter_score: +winter_score.toFixed(2),
        monsoon_score: +monsoon_score.toFixed(2),
        allyear
    };
}

module.exports = cityFeatureVector;