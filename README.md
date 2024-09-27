## GEOLOCATION TRACKER
Installation

Install package with pip

pip install phonenumbers
  pip install folium
  pip install geocoder
  pip install opencage

  Step1: Need to log in or sign up

![image](https://github.com/user-attachments/assets/9af1f82b-6dff-4c45-bf70-b7494ed37c35)

Step2: Need to click Geocoding API

![image](https://github.com/user-attachments/assets/9dd051e8-afbb-4cdc-97cf-8388ca9982c7)
  
Step3: From API Keys collect API key


![image](https://github.com/user-attachments/assets/0f2e80a9-12a3-40eb-86a1-4f42aa16e2a2)

Deployment

import phonenumbers
from phonenumbers import geocoder
from phonenumbers import carrier
import opencage
from opencage.geocoder import OpenCageGeocode
import folium


key = "your key" #Geocoder API Key need to paste here "your key" 
number = input("please giver your number: ")
new_number = phonenumbers.parse(number)
location = geocoder.description_for_number(new_number, "en")
print(location)

service_name = carrier.name_for_number(new_number,"en")
print(service_name)

geocoder = OpenCageGeocode(key)
query = str(location)
result = geocoder.geocode(query)
#print(result)

lat = result[0]['geometry']['lat']
lng = result[0]['geometry']['lng']

print(lat,lng)

my_map = folium.Map(location=[lat,lng], zoom_start=9)
folium.Marker([lat, lng], popup= location).add_to(my_map)

my_map.save("location.html")

print("location tracking completed")
print("Thank you")

## MEMORY PUZZLE GAME

This is an emoji-based memory tile game
![image](https://github.com/user-attachments/assets/fa5489dd-a868-4fe5-a33f-90d671933f58)

Deployment Steps
This game requires Python 3.7+ in order to run. Pip is also recommended to enable easy installation of the required package dependencies.

Install pygame and playsound
pip install pygame
pip install playsound

























