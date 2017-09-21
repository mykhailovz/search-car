const rp = require('request-promise');

const mock = require('../app/mock-data');

const normalize = require('../app/normailze-string');

const normalizeCarModelItem = require('../app/normailze-string').normalizeCarModelTypeItem;
const normalizeCarModelList = require('../app/normailze-string').normalizeCarModelList;
const normalizeCarModelTypeItem = require('../app/normailze-string').normalizeCarModelTypeItem;
const normalizeCarModelTypeList = require('../app/normailze-string').normalizeCarModelTypeList;
const findMatchingCarModel = require('../app/normailze-string').findMatchingCarModel;
const findMatcingCarModelType = require('../app/normailze-string').findMatcingCarModelType;
const getMatchedCarModels = require('../app/normailze-string').getMatchedCarModels;

let baseUrl = mock.url.baseUrl;
let classifyUrl = mock.url.classifyUrl;
let carVariantUrl = mock.url.carVariantUrl;

let GLOBAL_CAR_MODEL_MATCHES = [];
let COUNTER = 0;

function getCode(value, options) {
  let result = options.filter(item => {
    return item.message === value;
  })[0];

  let code = result['code'];

  return code;
}

function getCarYears(carBrand) {
  let carCode = getCode(carBrand, mock.carCodes);

  return rp(`${baseUrl}?bilmerkeNr=${carCode}`)
           .then(response => JSON.parse(response))
           .map(carBrand => ({ code: carBrand.code, message: carBrand.message }));
}

function getCarModels(carBrand, carYear) {
  let carCode = getCode(carBrand, mock.carCodes);

  return rp(`${classifyUrl}?bilmerkeNr=${carCode}&registreringsaar=${carYear}`)
           .then(response => JSON.parse(response))
           .map(carYear => ({
             code: carYear.code,
             message: normalize.normalizeCarModelItem(carYear.message)
           }));
}

function getCarVariants(carBrand, carYear, carModel, carModelType) {
  let carCode = getCode(carBrand, mock.carCodes);
  let normalizedCarModels = getCarModels(carBrand, carYear);
  let normalizeCarModelItem = normalize.normalizeCarModelItem(carModel);

  return normalizedCarModels.then(result => {
    GLOBAL_CAR_MODEL_MATCHES = getMatchedCarModels(normalizeCarModelItem, result);

    let matchedCarModel = normalize.findMatchingCarModel(normalizeCarModelItem, result);
    let carModelCode = matchedCarModel.code.split(':')[0];
    let modelYear;

    if (matchedCarModel.message.includes('(')) {
      let start = matchedCarModel.message.indexOf('(');
      let end = matchedCarModel.message.indexOf(')');
      modelYear = String(matchedCarModel.message.slice(start+1, end).trim());
    } else {
      modelYear = carYear;
    }

    return rp(
      `${carVariantUrl}
      ?bilmerkeNr=${carCode}
      &registreringsaar=${carYear}
      &modellNr=${carModelCode}
      &modellaar=${modelYear}` // carYear
    ).then(response => JSON.parse(response))
     .map(carVariant => ({
        code: carVariant.code,
        message: normalize.normalizeCarModelTypeItem(carVariant.message)
     }));
  });
}

let carBrand = 'Hyundai';
let carYear = '2008';
let carModel = 'Tucson';
let carModelType = '2,0 CRDI Comfort 4WD';

function recursiveSearch(carBrand, carYear, carModel, carModelType) {

  return getCarVariants(carBrand, carYear, carModel, carModelType).then((result) => {
    let normalizedCarModelType = normalize.normalizeCarModelTypeItem(carModelType);
    let carMatched = normalize.findMatcingCarModelType(normalizedCarModelType, result);
    console.log(result);
    console.log(`FIND RESULT`, carMatched);
    if (!carMatched) {
      carYear = Number(carYear) + 1;
      return recursiveSearch(carBrand, carYear, carModel, carModelType)
    } else {
      return carMatched;
    }
  });

}

recursiveSearch(carBrand, carYear, carModel, carModelType)
  .then(result => console.log(result));
