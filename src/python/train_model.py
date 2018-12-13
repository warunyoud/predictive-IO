import json
import sys

import numpy as np
import pandas as pd

from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.neural_network import MLPRegressor

from joblib import dump

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
clf.fit(X, y)
rms = np.sqrt(np.mean((clf.predict(X) - y)**2))
print 'Finished training on %s' % model
print 'RMS error %f' % rms

dump(clf, '%s/model.joblib' % path)

info = {}
info['training_rms'] = rms
with open('%s/info.json' % path, 'w') as outfile:
    json.dump(info, outfile)
