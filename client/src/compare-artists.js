
var getSortedUserGenreList = function getSortedUserGenreList(artists) {
  let genreObjForUser = Object();

  for (let i = 0; i < artists.length; i++) {
    let genreListForArtist = artists[i].genres;
    let posValue = Math.log(artists.length-i);
    for(let i = 0; i < genreListForArtist.length; i++){
      let genre = String(genreListForArtist[i]);
      if(genreObjForUser[genre]){
        genreObjForUser[genre] +=posValue;
      }
      else{
        genreObjForUser[genre] = posValue;
      }
    }
  }


  // https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/16794116#16794116
  const sortUserGenreObject = Object.fromEntries(
    Object.entries(genreObjForUser).sort(([,a],[,b]) => a-b)
  );

  let genreSortedListForUser = [];
  for (let genre in sortUserGenreObject){
    genreSortedListForUser.unshift(genre);
  }

  return genreSortedListForUser;
}

//create usable list of cities and genres
var getListofCityGenres = function getListofCityGenres(cities){
  let genreCities = [];
    
  for (let i = 0; i < cities.length; i++) {
    let specificCity = [];
    specificCity.push(cities[i].city);
    specificCity.push(cities[i].country);
    specificCity.push(cities[i].genres);
    genreCities.push(specificCity);
  }

  return genreCities;
}

// last three params: cut-off for number of genres of the city to look at and number of genres of the user to look at, genre matches required for the city to be considered
var createListOfPotentialMatches = function createListOfPotentialMatches(genreCities, genreSortedListForUser, minGenreMatches, numCityGenres, numUserGenres){
  let cityMatches = [];
  // look through each city
  for(let city = 0; city < genreCities.length; city++) {
    let isCityAMatch = 0;
    for(let userGenre = 0; userGenre < numUserGenres; userGenre++){
      if(isCityAMatch === minGenreMatches){
        cityMatches.push(city);
        break;
      }
      // start at 2 bc city, country, genre, ...)
      for(let cityGenre = 0; cityGenre < numCityGenres; cityGenre++){
        if(genreCities[city][2][cityGenre] === genreSortedListForUser[userGenre]){
          isCityAMatch += 1;
        }
      }
    }
  }
  return cityMatches;
}
  
// last two params: cut-off for number of genres of the city to look at (genreCities[matchedCityNumber][2].length-1) and number of genres of the user to look at (genreSortedListForUser.length)
var sortListOfMatches = function sortListOfMatches(cityMatches, genreCities, genreSortedListForUser, numCityGenres, numUserGenres){
  // time for least squares
  let leastSquaresList = [];
  for(let city = 0; city < cityMatches.length; city++) {
    let matchedCityNumber = cityMatches[city];
    let cityScore = 0;

    for(let cityGenre = 0; cityGenre < numCityGenres; cityGenre++){
      let cityGenrePos = cityGenre-2;
      for(let userGenrePos = 0; userGenrePos < numUserGenres; userGenrePos++){
        if(genreCities[matchedCityNumber][2][cityGenre] === genreSortedListForUser[userGenrePos]){
          if(cityGenre <5 | userGenrePos < 5){
            cityScore = 0;
          } else{
            let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);
            cityScore += differenceSquared;
          }
        }
      }
    }
    let cityScoreObject = {
      cityNumber: matchedCityNumber,
      score: cityScore
    }
    leastSquaresList.push(cityScoreObject)
  }

  leastSquaresList.sort(function(a, b){return a.score - b.score});

  let topCitiesList = [];
  let matchingCountries = [];

  for(let city = leastSquaresList.length-1; city >= 0 ; city--) {
    let matchedCityNumber = leastSquaresList[city]["cityNumber"];
    topCitiesList.push(genreCities[matchedCityNumber][0]);
    matchingCountries.push(genreCities[matchedCityNumber][1])
  }

  let returnLists = [topCitiesList,matchingCountries];
  return returnLists;
}

var findCities = function findCities(user, places) {
  let topCitiesList = [];
  let topCountriesList = [];
  let artists = user.items;

  let genreSortedListForUser = getSortedUserGenreList(artists);

  let genreListMax = 10;
  if (genreSortedListForUser.length < genreListMax){
    genreListMax = genreSortedListForUser.length;
  }
  let genreReturnList = [];
  for (let genre = 0; genre < genreListMax; genre++){
    genreReturnList.push(genreSortedListForUser[genre])
  }

  let genreCities = getListofCityGenres(places.items);

  // top 3 user compared to and top 3 of all cites
  let cityMatches = createListOfPotentialMatches(genreCities, genreSortedListForUser, 2, 3, 3);
  let topCitiesAndCountries = sortListOfMatches(cityMatches, genreCities, genreSortedListForUser, 15 , 3);
  topCitiesList.push.apply(topCitiesList, topCitiesAndCountries[0]);
  topCountriesList.push.apply(topCountriesList, topCitiesAndCountries[1]);

  if(topCitiesList.length >= 5){
    let returnList = [];
    returnList.push(topCitiesList.slice(0,5));
    returnList.push(topCountriesList.slice(0,5));
    returnList.push(genreReturnList.slice(0,10));
  
    return returnList;
  }

  // top 5 user compared to and top 5 of all cites
  cityMatches = createListOfPotentialMatches(genreCities, genreSortedListForUser, 2, 3, 5);
  topCitiesAndCountries = sortListOfMatches(cityMatches, genreCities, genreSortedListForUser, 15 , 5);
  topCitiesList.push.apply(topCitiesList, topCitiesAndCountries[0]);
  topCountriesList.push.apply(topCountriesList, topCitiesAndCountries[1]);

  if(topCitiesList.length >= 5){
    let returnList = [];
    returnList.push(topCitiesList.slice(0,5));
    returnList.push(topCountriesList.slice(0,5));
    returnList.push(genreReturnList.slice(0,10));
  
    return returnList;
  }

  // top 5 user compared to top 15 (or less) of all cities
  cityMatches = createListOfPotentialMatches(genreCities, genreSortedListForUser, 1, 15, 5);
  topCitiesAndCountries = sortListOfMatches(cityMatches, genreCities, genreSortedListForUser, 15 , 5);
  for(let i = 0; i<topCitiesAndCountries[0].length; i++){
    if(!topCitiesList.includes(topCitiesAndCountries[0][i])){
      topCitiesList.push(topCitiesAndCountries[0][i]);
      topCountriesList.push(topCitiesAndCountries[1][i]);
    }
  }

  if(topCitiesList.length >= 5){
    let returnList = [];
    returnList.push(topCitiesList.slice(0,5));
    returnList.push(topCountriesList.slice(0,5));
    returnList.push(genreReturnList.slice(0,10));
  
    return returnList;
  }

  // do the old alg
  cityMatches = createListOfPotentialMatches(genreCities, genreSortedListForUser, 1, 15, genreSortedListForUser.length);
  topCitiesAndCountries = sortListOfMatches(cityMatches, genreCities, genreSortedListForUser, 15 , genreSortedListForUser.length);
  for(let i = 0; i<topCitiesAndCountries[0].length; i++){
    if(!topCitiesList.includes(topCitiesAndCountries[0][i])){
      topCitiesList.push(topCitiesAndCountries[0][i]);
      topCountriesList.push(topCitiesAndCountries[1][i]);
    }
  }

  if(topCitiesList.length >= 5){
    let returnList = [];
    returnList.push(topCitiesList.slice(0,5));
    returnList.push(topCountriesList.slice(0,5));
    returnList.push(genreReturnList.slice(0,10));
  
    return returnList;
  }

}


const _findCities = findCities;
export { _findCities as findCities };

