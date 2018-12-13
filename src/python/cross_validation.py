import json
import sys

import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neural_network import MLPRegressor

def createModel(model):
    if model == 'LinearRegression':
        return LinearRegression()
    elif model == 'LogisticRegression':
        return LogisticRegression()
    elif model == 'DecisionTreeClassifier':
        return DecisionTreeClassifier()
    elif model == 'DecisionTreeRegressor':
        return DecisionTreeRegressor()
    elif model == 'NeuralNetworkRegressor':
        return MLPRegressor()


path = sys.argv[1]
num_fold = int(sys.argv[2])
with open('%s/config.json' % path) as json_file:
    config = json.load(json_file)

dataset_path = config['dataset_path']
predicting_column = config['predicting_column']
selected_features = config['selected_features']
model = config['model']

df = pd.read_csv(dataset_path)
clf = createModel(model)
chunk = df.dropna()
X = chunk.loc[:, selected_features].values
y = chunk[predicting_column].values

rms = []
chunk_size = int(len(y) / num_fold)
print ("Performing Cross Validation")
for i in range(num_fold):
    testIndex = range(i * chunk_size, min((i+1) * chunk_size, len(y)))
    test_X = X[testIndex, :]
    test_y = y[testIndex]
    train_X = np.delete(X, testIndex, axis=0)
    train_y = np.delete(y, testIndex)
    clf.fit(train_X, train_y)
    current_rms = np.sqrt(np.mean((clf.predict(test_X) - test_y)**2))
    rms.append(current_rms)
    print ("%d out of %d completed" % (i+1, num_fold))
    print ("RMS: %f" % current_rms)

with open('%s/info.json' % path) as json_file:
    info = json.load(json_file)

avg_rms = np.average(rms) 
info['cross_validation_rms'] = avg_rms
print ("Average RMS: %f" % avg_rms) 
with open('%s/info.json' % path, 'w') as outfile:
    json.dump(info, outfile)
