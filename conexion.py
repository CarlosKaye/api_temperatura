from pyspark import SparkContext, SparkConf

conf = SparkConf().setAppName("api_temperatura").setMaster("local")
sc = SparkContext(conf=conf)

datosT = sc.parallelize(datos)