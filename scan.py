import docx2txt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import sys


def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

job_description = docx2txt.process(sys.argv[1])
resume = docx2txt.process(sys.argv[2])
content = [job_description,resume]
cv = CountVectorizer()
matrix = cv.fit_transform(content)
similarity_matrix = cosine_similarity(matrix)
print(similarity_matrix[1][0]*100)