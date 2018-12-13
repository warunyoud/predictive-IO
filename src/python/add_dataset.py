import sys
import csv
import json
import re

from writing_utilities import *
from models import Column
from shutil import copyfile
from collections import Counter

import numpy as np
import pandas as pd
import math

workspace_path = sys.argv[1]

TAG_READING = 0
TAG_WRITING = 1
TAG_DONE = 2

MOST_COMMON = 10

CHUNK_SIZE = 100000
BIN_NUM = 40

NUMERICAL = ['float64', 'int64']
iter = 9

def send_json_message(tag, message):
    print(json.dumps({ 'tag': tag, 'message': message }))

file_path = sys.argv[2]
path = create_dataset_folder(workspace_path)

send_json_message(0, 'Reading file')
graph_info = {}

chunk_count = 0
for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE, iterator=True, parse_dates=True):
    if chunk_count == iter:
        break
    chunk_count += 1
    chunk.to_csv(get_actual_path('%s/data.csv' % path, workspace_path), mode='a', header=chunk_count==1)
    for column in chunk:
        if chunk[column].dtypes in NUMERICAL:
            if column not in graph_info:
                graph_info[column] = { 'name': column, 'type': 'numerical', 'max': float('-inf'), 'min': float('inf'), 'data': Counter({})}
            max = graph_info[column]['max']
            current_max = np.nanmax(chunk[column].values)
            if current_max > max:
                graph_info[column]['max'] = current_max

            min = graph_info[column]['min']
            current_min = np.nanmin(chunk[column].values)
            if current_min < min:
                graph_info[column]['min'] = current_min

    print 'Copied %d chunks' % chunk_count

del min

for column in graph_info:
    graph_info[column]['max'] = np.ceil(graph_info[column]['max'])
    graph_info[column]['min'] = np.floor(graph_info[column]['min'])
    diff = graph_info[column]['max'] - graph_info[column]['min']
    graph_info[column]['num_of_bins'] = min(diff + 2, BIN_NUM)

number_of_chunk = chunk_count
chunk_count = 0
for chunk in pd.read_csv(file_path, chunksize=CHUNK_SIZE, iterator=True, parse_dates=True):
    if chunk_count == iter:
        break
    chunk_count += 1
    for column in chunk:
        if chunk[column].dtypes in NUMERICAL:
            binned_chunk = pd.cut(chunk[column].dropna(), np.linspace(graph_info[column]['min'], graph_info[column]['max'] + 1, num=graph_info[column]['num_of_bins']), right=False)
            midpoint_chunk = [ item.left for item in binned_chunk ]
            graph_info[column]['data'] = graph_info[column]['data'] + Counter(midpoint_chunk)

    print('Analying %d/%d' % (chunk_count, number_of_chunk))

for column in graph_info:
    graph_info[column]['data'] = [{ 'x': key, 'y': value } for key, value in graph_info[column]['data'].iteritems()]

send_json_message(1, 'Saving graph')
write_to_file(graph_info.values(), '%s/graph.json' % path, workspace_path)
send_json_message(2, 'Graph created')

sys.stdout.flush()
