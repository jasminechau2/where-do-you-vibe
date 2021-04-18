import json

latLngData = []

with open('lat-lng1.json') as places1Json:
    items = json.load(places1Json)
    for place in items['items']:
            latLngData.append({
                'city': place['city'],
                'country':place['country'],
                'lat':place['lat'],
                'lng':place['lng']
            })

with open('lat-lng2.json') as places2Json:
    items = json.load(places2Json)
    for place in items['items']:
            latLngData.append({
                'city': place['city'],
                'country':place['country'],
                'lat':place['lat'],
                'lng':place['lng']
            })

with open('lat-lng.json', 'w', newline='') as file:
    print(len(latLngData))
    jsonObject = []
    jsonObject.append({
        'items':latLngData
    })
    json.dump(jsonObject[0], file, indent=2)
