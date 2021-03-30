/*
* This component lists out all the users genres 
*/
export default function userGenreList() {
    return (
    <div id ="user-genres-template" type="text/x-handlebars-template">
       <dt>Genres</dt> <dd>{{items}}</dd>
    </div>

    )
}