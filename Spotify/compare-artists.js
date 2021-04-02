const fs = require('fs');

var findCities = function findCities(user, places) {

  let obj = JSON.parse(user);
  let artists = obj.items;

  let genreObjForUser = Object();

  for (let i = 0; i < artists.length; i++) {
    let genreListForArtist = artists[i].genres;
    let posValue = artists.length-i;
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
  // console.log(genreSortedListForUser);

  //import cities from json
  // https://www.reddit.com/r/node/comments/2x066w/is_there_an_easy_synchronous_way_to_read_csv/
  let genreCities = [];

  let placesObj = JSON.parse(places);
  let cities = placesObj.items;
    
  for (let i = 0; i < cities.length; i++) {
    let specificCity = [];
    specificCity.push(cities[i].city);
    specificCity.push(cities[i].country);
    specificCity.push(cities[i].genres);
    genreCities.push(specificCity);
  }

  let cityMatches = [];
  // look through each city
  for(let city = 0; city < genreCities.length; city++) {
    let isCityAMatch = 0;
    for(let userGenre = 0; userGenre < genreSortedListForUser.length; userGenre++){
      if(isCityAMatch > 5){ //change back to 5
        cityMatches.push(city);
        break;
      }
      // start at 2 bc city, country, genre, ...)
      for(let cityGenre = 2; cityGenre < genreCities[city][2].length; cityGenre++){
        if(genreCities[city][2][cityGenre] === genreSortedListForUser[userGenre]){
          isCityAMatch += 1;
        }
      }
    }
  }

  // time for least squares
  let leastSquaresList = [];
  for(let city = 0; city < cityMatches.length; city++) {
    let matchedCityNumber = cityMatches[city];
    let cityScore = 0;

    for(let cityGenre = 2; cityGenre < genreCities[matchedCityNumber].length-1; cityGenre++){
      let cityGenrePos = cityGenre-2;
      for(let userGenrePos = 0; userGenrePos < genreSortedListForUser.length; userGenrePos++){
        if(genreCities[matchedCityNumber][cityGenre] === genreSortedListForUser[userGenrePos]){
          let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);

          cityScore += differenceSquared;
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

  let lowestCityNumber = 0;
  if(leastSquaresList.length > 5){
    lowestCityNumber = leastSquaresList.length-5
  }
  for(let city = lowestCityNumber; city < leastSquaresList.length; city++) {
    let matchedCityNumber = leastSquaresList[city]["cityNumber"];
    topCitiesList.push(genreCities[matchedCityNumber][0]);
    matchingCountries.push(genreCities[matchedCityNumber][1])
  }

  let returnList = [];
  returnList.push(topCitiesList);
  returnList.push(matchingCountries);

  return returnList;
}

let user = fs.readFileSync('./user.json');
let places = fs.readFileSync('./places.json');

findCities(user, places);

module.exports.findCities = findCities;