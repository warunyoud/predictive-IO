from joblib import load
import sys
import json

from collections import Counter
import pandas as pd
import numpy as np

model_path = sys.argv[1]
test_path = sys.argv[2]
output_path = sys.argv[3]

BIN_NUM = 40

KEY_COLUMN = ['key']

with open('%s/config.json' % model_path) as json_file:
    config = json.load(json_file)

selected_features = config['selected_features']
predicting_column = config['predicting_column']

print('Predicting data')
df = pd.read_csv(test_path)
r_df = df[selected_features]
o_df = df[KEY_COLUMN]
clf = load('%s/model.joblib' % model_path)
predictions = clf.predict(r_df)
o_df[predicting_column] = predictions
o_df.to_csv('%s/output.csv' % output_path, header=True)

prediction_min = np.floor(min(predictions))
prediction_max = np.ceil(max(predictions))
diff = prediction_max - prediction_min
graph_info = { 'name': predicting_column, 'type': 'numerical', 'min': prediction_min, 'max': prediction_max, 'num_of_bins': min(diff + 2, BIN_NUM) }
binned_data = pd.cut(predictions, np.linspace(graph_info['min'], graph_info['max'] + 1, num=graph_info['num_of_bins']), right=False)
midpoint = [ item.left for item in binned_data ]
graph_info['data'] = [{ 'x': key, 'y': value } for key, value in Counter(midpoint).iteritems()]

with open('%s/graph.json' % output_path, 'w') as outfile:
    json.dump(graph_info, outfile)

print('Finished predicting')
print('Saved predictions at ...')
print('%s/output.csv' % output_path)
