import { color } from "d3-color";

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
            fontSize: "38px",
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
            fontStyle: 'italic'
        },
        {
            fontSize: "32px",
            color: "#0F6BFF",
            fontWeight: "normal",
            fontStyle: 'italic'
        },
    ]
    const cityStyles = [
        {
            fontSize: "38px",
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
            fontStyle: 'italic'
        },
        {
            fontSize: "32px",
            color: "#757575",
            fontWeight: "normal",
            fontStyle: 'italic'
        },
    ]
    
    if(citiesObject !== "nothing yet"){

        for(let i = 1 ; i < cities.length; i++ ){
            combineCities.push( //cities return in the reverse order
                 <div
                 style = {cityStyles[i]}
                 key = {cities[i]}
                 >
                 {cities[i]}, {countries[i]}
                 </div>
             );
           };
           for(let i = 1; i < genres.length; i++ ){
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
            <ul className="main-display-wrapper">
                <li>
                    <ul className="title-and-cities">
                        <li>Your to city and your most listened genres:</li>
                        <li style = {cityStyles[0]}>{cities[0]+", "+countries[0]}</li>
                    </ul>
                </li>
                <li style={genreStyles[0]}>
                    {genres[0]}
                </li>
            </ul>
            <ul className="main-display-wrapper">
                <li>
                    <ul className="title-and-cities">
                        {combineCities}
                    </ul>
                </li>
                <li>
                    {combineGenres}
                </li>
            </ul>
            
            


            {/* {combineCities.length === 0 ? <div style = {styles[0]}> You have no matches </div> : combineCities}
            {combineGenres} */}
        </div>
        
    )
}
