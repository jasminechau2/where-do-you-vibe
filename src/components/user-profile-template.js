/*
* This component prints out the users name and shows their spotify profile picture. 
*/

export default function userProfile() {
    return(
        <div>
        <h1>Logged in as {{display_name}}</h1>
        <div class="media">
          <div class="pull-left">
            <img class="media-object" width="150" src="{{images.0.url}}" />
          </div>
          <div class="media-body">
            <dl class="dl-horizontal">
              <dt>Name</dt><dd class="clearfix">{{display_name}}</dd>
            </dl>
          </div>
        </div>
    </div>
    )
}