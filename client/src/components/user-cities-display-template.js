/*
* This component lists the user's top cities that match with their top genres 
*/
export default function UserCityDisplayTemplate({citiesObject, callback}) {
    const cities = citiesObject[0];
    const countries = citiesObject[1]; 
    const genres = citiesObject[2];
    const combineCities = [];
    const combineGenres = [];
    const styles = [
        {
            fontSize: "38px",
            color: "#074AB5",
            fontWeight: "bolder"
        },
        {
            fontSize: "36px",
            color: "#2D61B5",
            fontWeight: "bold"
        },
        {
            fontSize: "36px",
            color: "#557AB5",
            fontWeight: "normal"
        },
        {
            fontSize: "32px",
            color: "#A6C1ED",
            fontWeight: "normal",
            fontStyle: 'italic'
        },
        {
            fontSize: "32px",
            color: "#A8CAFF",
            fontWeight: "normal",
            fontStyle: 'italic'
        },
    ]
    var i = 0; 
    if(citiesObject !== "nothing yet"){
        for( i = cities.length-1 ; i >= 0; i-- ){
            combineCities.push( //cities return in the reverse order
                 <div
                 style = {styles[cities.length-i-1]}
                 key = {cities[i]}>
                 {cities[i]}, {countries[i]}
                 </div>
             );
             combineGenres.push(  //genres return in the correct order
                <div
                style = {styles[cities.length-i-1]}
                key = {genres[cities.length-i-1]}> 
                {genres[cities.length-i-1]}
                </div>
            ); 
           };
    };

    

    return ( 
        <div>
            {combineCities}
            {combineGenres}
        </div>
        
    )
}
