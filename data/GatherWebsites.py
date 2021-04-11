import requests
from bs4 import BeautifulSoup
import csv
import re
import json

page = requests.get("https://everynoise.com/everyplace.cgi?root=Bellingham%20Washington%20US&scope=all")
soup = BeautifulSoup(page.content, 'html.parser')

links_with_text = []
for a in soup.find_all('a', href=True):
    if a.text:
        links_with_text.append(a['href'])
links = []
for a in links_with_text:
    if ((a[0:1] == '?') & (a[-3:] == "all")):
        links.append("https://everynoise.com/everyplace.cgi"+a)
# print(links)

with open('links.json', 'w', newline='') as file:
    # writer = csv.writer(file)
    # writer.writerow(links)
    # json.dump()
