from pyspark import SparkContext,SparkConf
from pyspark.sql import SparkSession
import urllib2
import urllib
import json

conf = SparkConf().setAppName("api_temperatura").setMaster("local")
sc = SparkContext(conf=conf)
url = "http://localhost:9091/obtenerTemperatura"
args = {"Tipo":"Completa","NoCo":"05590693"}
post_params = {"Tipo":"Completa","NoCo":"05590693"}
params = urllib.urlencode(post_params)
response = urllib2.urlopen(url, params)
json_response = json.loads(response.read())
datos = json_response

Temperatura = []
for d in datos["D"]:
    Temperatura.append(float(d['Temp']))

Data1 = sc.parallelize(Temperatura).sum()
Data2 = sc.parallelize(Temperatura).count()

promedio = Data1 / Data2
print("El promedio es: ",promedio)