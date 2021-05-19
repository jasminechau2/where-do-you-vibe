from opencage.geocoder import OpenCageGeocode
import json

key = "a9fc6969619b4da09337d152b416c1f2"  # get api key from:  https://opencagedata.com
geocoder = OpenCageGeocode(key)

with open('../client/src/lat-lng.json','r') as file:
     json_data = json.load(file)
     for item in json_data['items']:
        if item['country'] in ["CA"]:
            print(item['city'])
            query = item['city'] +", Canada"
            results = geocoder.geocode(query)
            item['lat'] = results[0]['geometry']['lat']
            item['lng'] = results[0]['geometry']['lng']

with open('../client/src/lat-lng-fixed.json', 'w') as file:
    json.dump(json_data, file, indent=2)