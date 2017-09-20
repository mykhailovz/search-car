const rp = require('request-promise');

const mock = require('../app/mock-data');

const normalize = require('../app/normailze-string');

let baseUrl = mock.url.baseUrl;
let classifyUrl = mock.url.classifyUrl;
let carVariantUrl = mock.url.carVariantUrl;

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


// not finished
function getCarVariants(carBrand, carYear, carModel, carModelType) {
  let carCode = getCode(carBrand, mock.carCodes);
  let carModels = getCarModels(carBrand, carYear);

  return carModels.then(result => {
    console.log(result)
    // let normalizedCarModels = normalize.normalizeCarModelList(result);
    // return normalizedCarModels;
  });

  // return rp(`${carVariantUrl}?bilmerkeNr=${carCode}&registreringsaar=${carYear}&modellNr=${choosenCarModel}&modellaar=${carYear}`)
}
// not finished

let carBrand = 'Audi';
let carYear = '2000';
let carModel = 'A2 ( 2001 ) ';
let carModelType = '1,4 ( Combi-Coupè Udefinert )';

getCarVariants(carBrand, carYear, carModel, carModelType).then(result => {
  console.log('end');
});
