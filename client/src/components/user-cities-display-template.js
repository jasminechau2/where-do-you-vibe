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
            fontWeight: "bolder",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "36px",
            color: "#0035B9",
            fontWeight: "bold",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "36px",
            color: "#0048D3",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "32px",
            color: "#005CED",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "24px",
            color: "#0F6BFF",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
    ]
    const cityStyles = [
        {
            fontSize: "52px",
            color: "#000000",
            fontWeight: "bolder",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "48px",
            color: "#333333",
            fontWeight: "bold",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "42px",
            color: "#595959",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "36px",
            color: "#636363",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
        {
            fontSize: "28px",
            color: "#757575",
            fontWeight: "normal",
            textDecoration:"underline",
            cursor:"pointer"
        },
    ]
    
    if(citiesObject !== "nothing yet"){

        for(let i = 1 ; i < cities.length; i++ ){
            combineCities.push( //cities return in the reverse order
                 <p
                 style = {cityStyles[i]}
                 key = {cities[i]}
                 onClick = {() =>{
                    var stringArray = cities[i].split(/(\s+)/);
                    for(let i = 0; i<stringArray.length;i++){
                        if(stringArray[i]===" "){
                            stringArray[i] = "%20";
                        }
                    }
                    var joinedCityString = stringArray.join("");
                    window.open("https://everynoise.com/everyplace.cgi?root=" +joinedCityString+ "%20"+countries[i]+"&scope=all");
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
                key = {genres[i]}
                onClick = {() =>{
                    var genreString = genres[i].replace(/[^A-Z0-9]/ig, "");
                    window.open("https://everynoise.com/engenremap-" +genreString+ ".html");
                 }}
                
                > 
                {genres[i]}
                </p>
            ); 
           };

    };

    return ( 
        <div>
            <div className="main-display-wrapper">
                <h1>Your top city:</h1>
                <div style = {cityStyles[0]} 
                onClick = {() => {
                    var stringArray = cities[0].split(/(\s+)/);
                    for(let i = 0; i<stringArray.length;i++){
                        if(stringArray[0]===" "){
                            stringArray[0] = "%20";
                        }
                    }
                    var joinedCityString = stringArray.join("");
                    window.open("https://everynoise.com/everyplace.cgi?root=" +joinedCityString+ "%20"+countries[0]+"&scope=all");
                }}
                > {cities[0]+", "+countries[0]}
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


            {/* {combineCities.length === 0 ? <div style = {styles[0]}> You have no matches </div> : combineCities}
            {combineGenres} */}
        </div>
        
    )
}
