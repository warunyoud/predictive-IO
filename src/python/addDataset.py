import sys
import csv
import json
import re

from writing_utilities import *
from models import Column
from shutil import copyfile

import numpy as np

workspace_path = sys.argv[1]

TAG_READING = 0
TAG_WRITING = 1
TAG_DONE = 2

def send_json_message(tag, message):
    print(json.dumps({ 'tag': tag, 'message': message }))

csv.field_size_limit(sys.maxsize)

for i in range(2, len(sys.argv)):

    file_path = sys.argv[i]
    line_count = 0
    with open(file_path) as csvfile:
        training_data = csv.reader(csvfile, delimiter=',')
        columns = []
        column_names = []

        path = create_dataset_folder(workspace_path)

        send_json_message(0, 'Reading data')

        for row in training_data:
            column_count = 0
            for item in row:
                if line_count == 0:
                    column_names.append(item)
                elif line_count == 1:
                    columns.append(Column.create_column_with_item(column_names[column_count], item))
                else:
                    columns[column_count].process_item(item)
                column_count += 1
            line_count += 1

        output_path = '%s/graph.json' % path
        send_json_message(1, 'Saving graph')

        output = []
        for column in columns:
            output.append(column.get_graph_data())
        write_to_file(output, output_path, workspace_path)
        copyfile(file_path, get_actual_path('%s/data.csv' % path, workspace_path))

        send_json_message(2, 'Graph created')

sys.stdout.flush()
