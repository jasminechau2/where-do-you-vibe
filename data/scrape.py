import requests
from bs4 import BeautifulSoup
import csv
import re

def firstLetter(s):
    m = re.search(r'[A-Z]', s, re.I)
    if m is not None:
        return m.start()
    return -1

links = []
with open('links.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    link = "start"
    for row in csv_reader:
        links = row
links = list(set(links))


with open('places.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["City", "Country", "Genres"])

    i = 0
    for a in links:
        page = requests.get(a)
        soup = BeautifulSoup(page.content, 'html.parser')


        cityName = ""
        country = ""
        city = soup.find_all("tr", {"class": "datarow firstrow"})
        for tr in city:
            cityName = tr.text[firstLetter(tr.text):-2]
            country = tr.text[-2:]
        locationList = [cityName, country]
        print(locationList)

        genreText = ""
        genreList = []
        genres = soup.find_all("div", {"class": "note"})
        for div in genres:
            genreText = div.text
        genreList = genreText.split("\n")
        genreList.pop(0) #remove intro text at beginning

        writer.writerow(locationList+genreList)
        i += 1
        percent = (i/3660)*100
        if(i%25 == 0):
            print(percent)
