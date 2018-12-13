import json
import os
import re

def extract_file_name(path):
    m = re.search('\w+(?:\.\w+)*$', path)
    return m.group(0)

def file_name_without_extension(file_name):
    return file_name[:file_name.find('.')]

def get_actual_path(path, workspace_path):
    return '%s/%s' % (workspace_path, path)

def create_dataset_folder(workspace_path):
    base_name = 'dataset_'
    i = 1
    path = '%s%d' % (base_name, i)
    while (os.path.exists(get_actual_path(path, workspace_path))):
        i += 1
        path = '%s%d' % (base_name, i)
    os.mkdir(get_actual_path(path, workspace_path))
    return path

def write_to_file(data, output_path, workspace_path):
    with open(get_actual_path(output_path, workspace_path), 'w') as outfile:
        json.dump(data, outfile)
