from pyspark import SparkContext,SparkConf
from pyspark.sql import SparkSession
import urllib2
import urllib
import json
from collections import namedtuple

url = "http://localhost:9091/obtenerTemperatura"
args = {"Tipo":"Completa","NoCo":"05590693"}

post_params = {"Tipo":"Completa","NoCo":"05590693"}

params = urllib.urlencode(post_params)
response = urllib2.urlopen(url, params)
json_response = json.loads(response.read())

datos = json_response

Temp = []
for d in datos["D"]:
    Temp.append(float(d['Temp']))

promedio = sum(Temp) / float(len(Temp))    

print("El promedio es: ",promedio)