import fs from 'fs';
import _ from 'lodash';

const listDirItems = (path) => {
  const files = fs.readdirSync(path);
  return _.filter(files, (item) => !item.includes('.'));
};

const getUniqueFolderName = (name, folders) => {
  let index = 0;
  let target;
  do {
    index++;
    target = `${name}${index}`;
  } while (_.includes(folders, target))

  return target;
};

export {
  listDirItems,
  getUniqueFolderName
};
