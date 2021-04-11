import * as d3 from 'd3';
import data from './user_top_cities.csv';
import { useState } from 'react';

/*
* This component lists out all the users genres 
*/
export default function UserGenreList() {
    const [genres] = useState(data);

     d3.csv(genres, function(genre) { 
        console.log(genre);
        //console.log(data.city);
     });

     const rows = genres.split('\n');
     if (!rows || rows.length === 0) {
         return [];
     }

    return ( 
    // <div id ="user-genres-template" type="text/x-handlebars-template">
    //    <dt>Genres</dt> <dd>{{items}}</dd>
    // </div>
    <div>
        { genres }
    </div>
    )
}