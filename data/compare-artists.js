'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('zacks-artists.json');
let obj = JSON.parse(rawdata);
let artists = obj.items;

let genreObjForUser = Object();

for (let i = 0; i < artists.length; i++) {
	let genreListForArtist = artists[i].genres;
  let posValue = artists.length-i;
  for(let i = 0; i < genreListForArtist.length; i++){
    var genre = String(genreListForArtist[i]);
    if(genreObjForUser[genre]){
      genreObjForUser[genre] +=posValue;
    }
    else{
      genreObjForUser[genre] = posValue;
    }
  }
}

// https://stackoverflow.com/questions/1069666/sorting-object-property-by-values/16794116#16794116
const sorted = Object.fromEntries(
  Object.entries(genreObjForUser).sort(([,a],[,b]) => a-b)
);

var genreSortedListForUser = [];
for (let genre in sorted){
  genreSortedListForUser.unshift(genre);
}

console.log(genreSortedListForUser);

look through each city
maintain a list of cities that have at least one of the similar genres
time for least squares
look at all of cities in teh maintained list
look at each song and compare the position difference
take the difference and square it
then sort the cities in desc order by squares
