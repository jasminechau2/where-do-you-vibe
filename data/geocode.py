from opencage.geocoder import OpenCageGeocode
import csv


key = "a9fc6969619b4da09337d152b416c1f2"  # get api key from:  https://opencagedata.com
geocoder = OpenCageGeocode(key)

with open('lat-lng1.csv', 'w', newline='') as write_file:
    writer = csv.writer(write_file)
    writer.writerow(["City", "Country", "lat", "lng"])
    with open('places.csv') as read_file:
        csv_reader = csv.reader(read_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                print(f'Column names are {", ".join(row)}')
                line_count += 1
            else:
                query = row[0] +", "+ row[1]

                results = geocoder.geocode(query)
                lat = results[0]['geometry']['lat']
                lng = results[0]['geometry']['lng']
                print (lat, lng)
                writer.writerow([row[0], row[1], lat, lng])

                line_count += 1
                if(line_count == 1830):
                    break
