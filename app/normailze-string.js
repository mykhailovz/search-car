function normalizeCarModelItem(item) {
  let carRegex = {
    'C-Max2': /\d+$/
  };

  let clonedStr = item.toLowerCase().trim().replace(/-/g, '');

  if (item in carRegex) {
    clonedStr = clonedStr.replace(carRegex[item], '');
  }

  return clonedStr;
}

function normalizeCarModelList(collection) {
  let clonedCollection = collection.map(item => Object.assign({}, item));

  clonedCollection.map(item => {
    item.message = item.message.toLowerCase().trim();
    item.message = item.message.replace(/-/g, '');
  });

  return clonedCollection;
}

function findMatchingCarModel(carModelOptional, modelList) {
  const matches = [];

  modelList.map(modelItem => {
    if (modelItem.message.indexOf(carModelOptional) !== -1) {
      matches.push(modelItem);
    }
  });

  if (matches.length > 1) {
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].message === carModelOptional) {
        return matches[i];
      }
    }

    for (let i = 0; i < matches.length; i++) {
      if (matches[i].message.indexOf(carModelOptional) !== -1) {
        return matches[i];
      }
    }

  } else {
    return matches[0];
  }

  return matches;
}

function getCarMatchedCarModels(carModelOptional, modelList) {
  const matches = [];

  modelList.map(modelItem => {
    if (modelItem.message.indexOf(carModelOptional) !== -1) {
      matches.push(modelItem);
    }
  });

  return matches;
}

function normalizeCarModelTypeItem(item) {
  let clonedStr = item.toLowerCase().trim().replace(/-/g, '');

  return clonedStr;
}

function normalizeCarModelTypeList(collection) {
  let clonedCollection = collection.map(item => Object.assign({}, item));

  clonedCollection.map(item => {
    item.message = removeBrackets(item.message);
    item.message = item.message.toLowerCase().trim();
    item.message = item.message.replace(/-/g, '');
  });

    return clonedCollection;
}

function removeBrackets(str) {
  let bracketLength = str.match(/[()]/g).length;
  let START = 0;
  let END = 0;

  let normalizedString = '';

  switch (bracketLength) {
    case 2: {
      START = str.indexOf('(');
      END = str.indexOf(')');
      normalizedString = str.slice(0, START - 1);
      break;
    }

    case 4: {
      let firstOpenBracket = str.indexOf('(');
      let secondOpenBracket = str.indexOf('(', firstOpenBracket + 1);
      let firstClosedBracket = str.indexOf(')', firstOpenBracket + 1);

      if (firstClosedBracket < secondOpenBracket) {
        let START = str.indexOf(')');
        let END = str.indexOf('(', START + 1);

        normalizedString = str.slice(0, END - 1); 
      } else {
        let END = str.indexOf('(');

        normalizedString = str.slice(0, END - 1);
      }
      break;
    }

    case 6: {
      let startPos = str.indexOf(')');
      START = str.indexOf('(', startPos);
      END = str.lastIndexOf(')');
      normalizedString = str.slice(0, START - 1);
      break;
    }
  }

  return normalizedString;
}

function findMatcingCarModelType(carModelType, carModelTypeList) {
  const matches = [];

  carModelTypeList.map(carItem => {
      if (carItem.message.indexOf(carModelType) !== -1) {
        matches.push(carItem);
      }
  });

    if (matches.length > 1) {
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].message === carModelType) {
          return matches[i];
        }
      }

      for (let i = 0; i < matches.length; i++) {
        if (matches[i].message.indexOf(carModelType) !== -1) {
          return matches[i];
        }
      }

    } else {

      return matches[0];
    }
}

module.exports = {
  normalizeCarModelItem,
  normalizeCarModelList,
  findMatchingCarModel,
  normalizeCarModelTypeItem,
  normalizeCarModelTypeList,
  removeBrackets,
  findMatcingCarModelType,
  getCarMatchedCarModels
};
