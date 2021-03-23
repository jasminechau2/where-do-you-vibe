'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('jasmine_genres.json');
let obj = JSON.parse(rawdata);
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

// console.log(genreObjForUser);

// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/16794116#16794116
const sortUserGenreObject = Object.fromEntries(
  Object.entries(genreObjForUser).sort(([,a],[,b]) => a-b)
);

let genreSortedListForUser = [];
for (let genre in sortUserGenreObject){
  genreSortedListForUser.unshift(genre);
}
// console.log(genreSortedListForUser);

//import cities from csv
// https://www.reddit.com/r/node/comments/2x066w/is_there_an_easy_synchronous_way_to_read_csv/
let genreCities = [];
let fileContents = fs.readFileSync('places.csv');
let lines = fileContents.toString().split('\n');

for(let i = 0; i < lines.length; i++) {
	genreCities.push(lines[i].toString().split(','));
}
genreCities.pop();

let cityMatches = [];
// look through each city (start at 1 bc first row is col lables)
for(let city = 1; city < genreCities.length; city++) {
  let isCityAMatch = 0;
  // start at 2 bc city, country, genre, ...)
  for(let userGenre = 0; userGenre < genreSortedListForUser.length; userGenre++){
    if(isCityAMatch > 5){
      cityMatches.push(city);
      break;
    }
    for(let cityGenre = 2; cityGenre < genreCities[city].length; cityGenre++){
      if(genreCities[city][cityGenre] == genreSortedListForUser[userGenre]){
        isCityAMatch += 1;
        // console.log(genreCities[city][0]);
        break;
      }
    }
  }
}

// time for least squares
let leastSquares = Object();
for(let city = 0; city < cityMatches.length; city++) {
  let matchedCityNumber = cityMatches[city];
  let cityScore = 0;
  // console.log(genreCities[matchedCityNumber][0]);
  // start at 2 bc city, country, genre, ...) end at -1 b/c the last elt for cites is ""
  for(let cityGenre = 2; cityGenre < genreCities[matchedCityNumber].length-1; cityGenre++){
    let cityGenrePos = cityGenre-2;
    for(let userGenrePos = 0; userGenrePos < genreSortedListForUser.length; userGenrePos++){
      if(genreCities[matchedCityNumber][cityGenre] == genreSortedListForUser[userGenrePos]){
        // console.log(genreCities[matchedCityNumber][cityGenre]);
        let differenceSquared = Math.abs(cityGenrePos - userGenrePos);
        // console.log(differenceSquared);
        cityScore += differenceSquared;
      }
    }
  }
  leastSquares[matchedCityNumber] = cityScore;
}

// console.log(leastSquares);

// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/16794116#16794116
const sortLeastSquaresObject = Object.fromEntries(
  Object.entries(leastSquares).sort(([,a],[,b]) => a-b)
);

let sortedLeastSqaresList = [];
for (let genre in sortLeastSquaresObject){
  sortedLeastSqaresList.unshift(genre);
}
// console.log(sortedLeastSqaresList);

for(let city = 0; city < sortedLeastSqaresList.length; city++) {
  let matchedCityNumber = sortedLeastSqaresList[city];
  console.log(genreCities[matchedCityNumber][0], genreCities[matchedCityNumber][1]);
}

// look at all of cities in teh maintained list
// look at each song and compare the position difference
// take the difference and square it
// then sort the cities in desc order by squares
