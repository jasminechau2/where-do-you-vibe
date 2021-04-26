/*
* This component lists the user's top cities that match with their top genres 
*/
export default function UserCityDisplayTemplate({citiesObject, callback}) {
    const cities = citiesObject[0];
    const countries = citiesObject[1]; 
    const combine = [];
    var i = 0; 
    if(citiesObject !== "nothing yet"){
        for( i =0 ; i < cities.length; i++ ){
            combine.push( 
                 <li
                 key = {cities[i]}>
                 {cities[i]}, {countries[i]}
                 </li>
             )
           };
    };

    

    return ( 
    <div>
        {combine}
    </div>
    )
}