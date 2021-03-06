const rp = require('request-promise');

const mock = require('./mock-data');

const normalize = require('./normailze-string');

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

function getCarVariants(carBrand, selectedYear, carModel) {
  carModel = normalize.normalizeCarModelItem(carModel);
  let carCode = getCode(carBrand, mock.carCodes);

  return rp(`${baseUrl}?bilmerkeNr=${carCode}`)
    .then(response => {
      let carRegistrationYears = JSON.parse(response);

      carRegistrationYears.forEach(carYear => {
        if (parseInt(carYear.code, 10) === parseInt(selectedYear, 10)) {
          choosenYear = parseInt(carYear.code, 10);
        }
      });

      return rp(`${classifyUrl}?bilmerkeNr=${carCode}&registreringsaar=${choosenYear}`);
    })
    .then(response => {
      let carVariants = JSON.parse(response);
      let choosenCarModel;
      let normalizedCarVariants = normalize.normalizeCarModelList(carVariants);
      let carModelNumber = normalize.findMatchingCarModel(carModel, normalizedCarVariants);
      carModelNumber = carModelNumber.code.split(':')[0];

      carVariants.forEach(carModel => {
        if (carModelNumber === carModel.code.split(':')[0]) {
          choosenCarModel = parseInt(carModel.code.split(':')[0]);
        }
      });
      
      if (carModel.includes('(')) {
        let start = carModel.indexOf('(');
        let end = carModel.indexOf(')');
        choosenYear = carModel.slice(start+1, end).trim();
      }

      return rp(`${carVariantUrl}?bilmerkeNr=${carCode}&registreringsaar=${choosenYear}&modellNr=${choosenCarModel}&modellaar=${choosenYear}`);
    })
    .then(response => {
      return JSON.parse(response);
    });
}

module.exports = {
  getCarVariants
};
