const rp = require('request-promise');

const carCodes = require('../app/mock-data').carCodes;
const mock = require('../app/mock-data');

const normalizeCarModelItem = require('../app/normailze-string').normalizeCarModelItem;
const normalizeCarModelList = require('../app/normailze-string').normalizeCarModelList;
const normalizeCarModelTypeItem = require('../app/normailze-string').normalizeCarModelTypeItem;
const normalizeCarModelTypeList = require('../app/normailze-string').normalizeCarModelTypeList;
const findMatchingCarModel = require('../app/normailze-string').findMatchingCarModel;
const findMatcingCarModelType = require('../app/normailze-string').findMatcingCarModelType;
const getMatchedCarModels = require('../app/normailze-string').getMatchedCarModels;

// let carData = {
//   brand: 'Toyota',
//   year: '2006',
//   model: 'RAV4',
//   modelType: '2,2 D-4D 136hk DPF Executive'
// };

// let carData = {
//   brand: 'Ford',
//   year: '2007',
//   model: 'C-Max2',
//   modelType: '1,6 TDCi 90hk Titanium'
// };

// function getCode(value, options) {
//   let result = options.filter(item => {
//     return item.message === value;
//   })[0];

//   let code = result['code'];

//   return code;
// }

// let carCode = getCode(carData.brand, carCodes);
// let normalizedCarModelItem = normalizeCarModelItem(carData.model);
// let normailzedCarModelTypeItem = normalizeCarModelTypeItem(carData.modelType);

// console.log(normalizedCarModelItem);

let baseUrl = mock.url.baseUrl;
let classifyUrl = mock.url.classifyUrl;
let carVariantUrl = mock.url.carVariantUrl;

// search().then(res => {
//   console.log(res);
// });

let baseUrlInfo = 'https://tribe-back-end-dev.herokuapp.com/public/ofv/data';

function getAllCarInfo(carRegNumber) {
  return rp(`${baseUrlInfo}/${carRegNumber}`);
}

let carRegNumber = 'DL39474';

getAllCarInfo(carRegNumber)
  .then((response) => {
    let carInfo = JSON.parse(response);
    let short = carInfo.data.matchingVehicles[0];

    let carBrand = short.brandName;
    let carRegistrationYear = short.yearModel;
    let carModel = short.modelName;
    let carModelType = short.variantName;

    //------//
    let carData =  {
      brand: carBrand,
      year: carRegistrationYear,
      model: carModel,
      modelType: carModelType
    };

    function getCode(value, options) {
      let result = options.filter(item => {
        return item.message === value;
      })[0];
    
      let code = result['code'];
    
      return code;
    }

    let carCode = getCode(carData.brand, carCodes);
    let normalizedCarModelItem = normalizeCarModelItem(carData.model);
    let normailzedCarModelTypeItem = normalizeCarModelTypeItem(carData.modelType);

    function search() {
      return new Promise((resolver, reject) => {
    
        function getForModels(year, resolver) {
          return rp(`${classifyUrl}?bilmerkeNr=${carCode}&registreringsaar=${year}`)
            .then(response => JSON.parse(response))
            .then(result => {
              let normalizedCarModels = normalizeCarModelList(result);
              let matchedModels = getMatchedCarModels(normalizedCarModelItem, normalizedCarModels); // find car model matches
    
              getForVariants(matchedModels, year, resolver)
            });
        }
        
        function getForVariants(modelList, year, resolver) {
          if (modelList.length === 0) {
            year++;
            getForModels(year, resolver);
            return;
          }
          console.log(`Searching...`);
          //*-------------------------------------
          let carModelCode = modelList[0].code.split(':')[0];
          
          if (modelList[0].message.includes('(')) {
            let start = modelList[0].message.indexOf('(');
            let end = modelList[0].message.indexOf(')');
            modelYear = String(modelList[0].message.slice(start+1, end).trim());
          } else {
            modelYear = year;
          }
          //*-------------------------------------
        
          return rp(`${carVariantUrl}?bilmerkeNr=${carCode}&registreringsaar=${year}&modellNr=${carModelCode}&modellaar=${modelYear}`)
            .then(response => JSON.parse(response))
            .map(carVariant => ({
              code: carVariant.code,
              message: normalizeCarModelTypeItem(carVariant.message)
            }))
            .then(result => {
              let carMatched = findMatcingCarModelType(normailzedCarModelTypeItem, result);
              if (carMatched) {
                resolver(carMatched);
              } else {
                modelList.splice(0, 1);
                getForVariants(modelList, year, resolver);
              }
            })
        }
    
        getForModels(carData.year, resolver);
      });
    }

    //------//

    search().then(res => {
      console.log(res);
    });

  });