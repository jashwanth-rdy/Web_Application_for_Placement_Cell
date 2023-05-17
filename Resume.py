import nltk
import json
import sys
from pyresparser import ResumeParser

def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

str = '/Users/jashwanthreddy/Desktop/Web Dev/Prototype - 1/assets/uploads/'

filed=str+'Description/'+sys.argv[1]
datad=ResumeParser(filed).get_extracted_data()

filer=str+'Resumes/'+sys.argv[2]
datar=ResumeParser(filer).get_extracted_data()

count=0
total=0
for s in datad['skills']:
    total = total + 1
    for r in datar['skills']:
       if(s.lower()==r.lower()):
          count = count + 1

percent = (count/total)*100
print(percent)