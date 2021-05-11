/*
* This component lists the user's top cities that match with their top genres 
*/
export default function UserCityDisplayTemplate({citiesObject, callback}) {
    const cities = citiesObject[0];
    const countries = citiesObject[1]; 
    const genres = citiesObject[2];
    const combineCities = [];
    const combineGenres = [];
    const genreStyles = [
        {
            fontSize: "52px",
            color: "#004EB9",
            fontWeight: "bolder"
        },
        {
            fontSize: "36px",
            color: "#0035B9",
            fontWeight: "bold"
        },
        {
            fontSize: "36px",
            color: "#0048D3",
            fontWeight: "normal"
        },
        {
            fontSize: "32px",
            color: "#005CED",
            fontWeight: "normal",
        },
        {
            fontSize: "32px",
            color: "#0F6BFF",
            fontWeight: "normal",
        },
    ]
    const cityStyles = [
        {
            fontSize: "52px",
            color: "#000000",
            fontWeight: "bolder"
        },
        {
            fontSize: "36px",
            color: "#333333",
            fontWeight: "bold"
        },
        {
            fontSize: "36px",
            color: "#595959",
            fontWeight: "normal"
        },
        {
            fontSize: "32px",
            color: "#636363",
            fontWeight: "normal",
        },
        {
            fontSize: "32px",
            color: "#757575",
            fontWeight: "normal",
        },
    ]
    
    if(citiesObject !== "nothing yet"){

        for(let i = 1 ; i < cities.length; i++ ){
            combineCities.push( //cities return in the reverse order
                 <div
                 style = {cityStyles[i]}
                 key = {cities[i]}
                 onClick = {() => {
                    callback(cities[i]);
                 }} 
                 >
                 {cities[i]}, {countries[i]}
                 </div>
             );
           };
           for(let i = 0; i < genres.length; i++ ){
             combineGenres.push(  //genres return in the correct order
                <div
                style = {genreStyles[i]}
                key = {genres[i]}> 
                {genres[i]}
                </div>
            ); 
           };

    };

    return ( 
        <div>
            <div className="main-display-wrapper">
                <div>Your top city:</div>
                <div style = {cityStyles[0]} onClick = {() => {callback(cities[0]); }}> {cities[0]+", "+countries[0]}
                </div>
            </div>
            <div className="main-display-wrapper">
                <div>And your next best matches:</div>
                <div>{combineCities}</div>
            </div>
            <div className="genre-display-wrapper">
                <div>Your top genres:</div>
                <div className="genres">{combineGenres}</div>
            </div>
        </div>
        
    )
}
