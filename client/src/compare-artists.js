//const fs = require('fs');

var findCities = function findCities(user, places) {

  //let obj = JSON.parse(user);
  let artists = user.items;

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

  let genreListMax = 5;
  if (genreSortedListForUser.length < genreListMax){
    genreListMax = genreSortedListForUser.length;
  }
  let genreReturnList = [];
  for (let genre = 0; genre < genreListMax; genre++){
    genreReturnList.push(genreSortedListForUser[genre])
  }

  //import cities from json
  // https://www.reddit.com/r/node/comments/2x066w/is_there_an_easy_synchronous_way_to_read_csv/
  let genreCities = [];

  //let placesObj = JSON.parse(places);
  let cities = places.items;
    
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
    for(let userGenre = 0; userGenre < 5; userGenre++){
      if(isCityAMatch > 2){
        cityMatches.push(city);
        break;
      }
      // start at 2 bc city, country, genre, ...)
      for(let cityGenre = 2; cityGenre < 15; cityGenre++){
        if(genreCities[city][2][cityGenre] === genreSortedListForUser[userGenre]){
          isCityAMatch += 1;
        }
      }
    }
  }

  console.log(cityMatches.length);

  //minimum length of the two cities
  //only look at top 5 - full match is 1, no match is 0

  // top 5 user compared to and top 5 of all cites
  // top 5 user compared to top 15 (or less) of all cities
  // do the old alg
  // after each iteration, if there is more than 1, sort and add in that order (be careful with orders)

  // time for least squares
  // let leastSquaresList = [];
  // for(let city = 0; city < cityMatches.length; city++) {
  //   let matchedCityNumber = cityMatches[city];
  //   let cityScore = 0;

  //   for(let cityGenre = 2; cityGenre < genreCities[matchedCityNumber][2].length-1; cityGenre++){
  //     let cityGenrePos = cityGenre-2;
  //     for(let userGenrePos = 0; userGenrePos < genreSortedListForUser.length; userGenrePos++){
  //       if(genreCities[matchedCityNumber][2][cityGenre] === genreSortedListForUser[userGenrePos]){
  //         let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);
  //         cityScore += differenceSquared;
  //         if(cityGenre>25){
  //           let differenceSquared = Math.pow(cityGenrePos - userGenrePos,5);
  //           cityScore += differenceSquared;
  //         } else if(cityGenre <5 | userGenrePos < 5){
  //           cityScore = 0;
  //         } else{
  //           let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);
  //           cityScore += differenceSquared;
  //         }
  //       }
  //       else{
  //         cityScore += 500;
  //       }
  //     }
  //   }
  //   let cityScoreObject = {
  //     cityNumber: matchedCityNumber,
  //     score: cityScore
  //   }
  //   leastSquaresList.push(cityScoreObject)
  // }

  let leastSquaresList = [];
  for(let city = 0; city < cityMatches.length; city++) {
    let matchedCityNumber = cityMatches[city];
    let cityScore = 0;
    

    for(let cityGenre = 2; cityGenre < 15; cityGenre++){
      let cityGenrePos = cityGenre-2;
      for(let userGenrePos = 0; userGenrePos < genreSortedListForUser.length; userGenrePos++){
        if(genreCities[matchedCityNumber][2][cityGenre] === genreSortedListForUser[userGenrePos]){
          let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);
          cityScore += differenceSquared;
          if(cityGenre>25){
            let differenceSquared = Math.pow(cityGenrePos - userGenrePos,5);
            cityScore += differenceSquared;
          } else if(cityGenre <5 | userGenrePos < 5){
            cityScore = 0;
          } else{
            let differenceSquared = Math.pow(cityGenrePos - userGenrePos,2);
            cityScore += differenceSquared;
          }
        }
        else{
          cityScore += 500;
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
//prints in 5,4,3,2,1 order

  let returnList = [];
  returnList.push(topCitiesList);
  returnList.push(matchingCountries);
  returnList.push(genreReturnList);

  return returnList;
}

//let user = fs.readFileSync('./user.json');
//let places = fs.readFileSync('./places.json');

//findCities(user, places);

const _findCities = findCities;
export { _findCities as findCities };