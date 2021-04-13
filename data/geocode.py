from opencage.geocoder import OpenCageGeocode
import json


key = "a9fc6969619b4da09337d152b416c1f2"  # get api key from:  https://opencagedata.com
geocoder = OpenCageGeocode(key)

latLngData = []

with open('places.json') as placesJson:
    cityCount = 0;
    items = json.load(placesJson)
    for place in items['items']:
        if (cityCount >= 1380):
            query = place['city'] +", "+ place['country']
            results = geocoder.geocode(query)
            lat = results[0]['geometry']['lat']
            lng = results[0]['geometry']['lng']
            print (lat, lng,  place['city'], cityCount)
            latLngData.append({
                'city': place['city'],
                'country':place['country'],
                'lat':lat,
                'lng':lng
            })
        cityCount += 1
        if(cityCount == 3660):
            with open('lat-lng2.json', 'w', newline='') as file:
                jsonObject = []
                jsonObject.append({
                    'items':latLngData
                })
                json.dump(jsonObject[0], file, indent=2)
                break
# 0-1380
# 1381 - 3660
