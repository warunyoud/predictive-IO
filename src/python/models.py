from collections import defaultdict

CATEGORICAL = "categorical"
NUMERICAL = "numerical"

PERCENTAGE_THRESHOLD = 0.05
NUMBER_OF_BINS = 20

class Column:
    def __init__(self, name):
        self.name = name
        self.count = defaultdict(int)
        self.total = 0.0
        self.type = None

    @staticmethod
    def get_type(item):
        try:
            num = float(item)
            return NUMERICAL
        except:
            return CATEGORICAL

    @staticmethod
    def create_column_with_item(name, item):
        type = Column.get_type(item)
        column = None
        if type == NUMERICAL:
            column = NumericalColumn(name)
        elif type == CATEGORICAL:
            column = CategoricalColumn(name)

        if column:
            column.type = type

        column.process_item(item)
        return column

    def process_item(self, item):
        self.count[item] += 1
        self.total += 1

    def get_graph_data(self, data):
        return { 'name': self.name, 'type': self.type, 'data': data, 'uniques': len(self.count) }

class NumericalColumn(Column):
    def __init__(self, name):
        Column.__init__(self, name)
        self.min = float('inf')
        self.max = float('-inf')

    def process_item(self, item):
        num = float(item)
        if num > self.max:
            self.max = num
        if num < self.min:
            self.min = num
        Column.process_item(self, num)

    def get_graph_data(self):
        data = []
        unique = len(self.count)
        # num of bins might be proportional to the number of unique item with some
        if unique > NUMBER_OF_BINS:
            bin_size = 0
            bin_size = (self.max - self.min) / NUMBER_OF_BINS
            bin_count = defaultdict(int)
            for key, value in self.count.iteritems():
                bin_count[int((key - self.min) / bin_size)*bin_size + self.min] += value
            self.count = bin_count

        for key, value in self.count.iteritems():
            data.append({ 'x': key, 'y': value })

        return Column.get_graph_data(self, data)

class CategoricalColumn(Column):
    def get_graph_data(self):
        data = []
        others = 0
        for key, value in self.count.iteritems():
            if value / self.total > PERCENTAGE_THRESHOLD:
                data.append({ 'x': key, 'y': value })
            else:
                others += 1
        if others != 0:
            data.append({ 'x': 'others', 'y': self.total - others })
        return Column.get_graph_data(self, data)
