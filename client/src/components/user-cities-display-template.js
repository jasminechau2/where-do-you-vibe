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
                 <p
                 style = {cityStyles[i]}
                 key = {cities[i]}
                 onClick = {() =>{
                    console.log("https://everynoise.com/everyplace.cgi?root=Brownsville%20Texas%20US&scope=all");
                 }}
                 >
                 {cities[i]}, {countries[i]}
                 </p>
             );
           };
           for(let i = 0; i < genres.length; i++ ){
             combineGenres.push(  //genres return in the correct order
                <p
                style = {genreStyles[i]}
                key = {genres[i]}> 
                {genres[i]}
                </p>
            ); 
           };
           console.log(cities);

    };

    return ( 
        <div>
            <div className="main-display-wrapper">
                <h1>Your top city:</h1>
                <div style = {cityStyles[0]} onClick = {() => {callback(cities[0]); }}> {cities[0]+", "+countries[0]}
                </div>
            </div>
            <div className="main-display-wrapper">
                <h2>And your next best matches:</h2>
                <div>{combineCities}</div>
            </div>
            <div className="genre-display-wrapper">
                <h2>Your top genres:</h2>
                <div className="genres">{combineGenres}</div>
            </div>
        </div>
        
    )
}
