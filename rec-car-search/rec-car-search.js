const rp = require('request-promise');
const colors = require('colors');
const Nightmare = require('nightmare');

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

const endpoint = 'https://www.finansportalen.no/forsikring/bilforsikring/';

// search().then(res => {
//   console.log(res);
// });

let baseUrlInfo = 'https://tribe-back-end-dev.herokuapp.com/public/ofv/data';

function getAllCarInfo(carRegNumber) {
  return rp(`${baseUrlInfo}/${carRegNumber}`);
}

let carRegNumber = 'AR92851';

getAllCarInfo(carRegNumber)
  .then((response) => {
    let carInfo = JSON.parse(response);
    let short = carInfo.data.matchingVehicles[0];

    let carBrand = short.brandName;
    let carRegistrationYear = short.yearModel;
    let carModel = short.modelName;
    let carModelType = short.variantName;

    console.log(
      `[${carBrand}]`.bgRed.yellow,
      `[${carRegistrationYear}]`.bgRed.yellow,
      `[${carModel}]`.bgRed.yellow,
      `[${carModelType}]`.bgRed.yellow
    );

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
              message: carVariant.message // message: normalizeCarModelTypeItem(carVariant.message)
            }))
            .then(result => {
              let normlizedCarModelTypeList = normalizeCarModelTypeList(result);
              let carMatched = findMatcingCarModelType(normailzedCarModelTypeItem, normlizedCarModelTypeList);
              if (carMatched) {
                carMatched['carModel'] = modelList[0].message;
                carMatched['year'] = year;
                resolver(carMatched);
                return; // test feature
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

    search()
      .then(searchResult => searchResult)
      .then(carInfo => {
        // nightmare configuration instance
        let nightmare = Nightmare({
          show: true,
          openDevTools: true,
          waitTimeout: 6000000,
          gotoTimeout: 6000000,
          webPreferences: {
            partition: 'nopersist'
          }
        });
        // nightmare configuration instance

        console.log(carInfo);
        let carYear = carInfo['year'];
        let carModel = carInfo['carModel'];
        let carModelType = carInfo['message'];

        nightmare
          .goto(endpoint)

          .wait(15000)
          .evaluate((carBrand) => {
            let elem = document.querySelector(`select[name="brand"]`);
            let options = angular.element(elem).scope().questions.brand.options;

            function getCode(value, options) {
              let result = options.filter(item => {
                return item.message === value;
              })[0];
    
              let code = result['code'];
    
              return code;
            }
    
            let code = getCode(carBrand, options);
    
            options.forEach(brand => {
              if (brand.message === carBrand) {
                angular.element(elem).scope().questions.brand.value = code;
                angular.element(elem).scope().questions.brand.onChange();
              }
            });
          }, carBrand)

          .wait(5000)
          .evaluate((carYear) => {
            let elem = document.querySelector(`select[name="registrationYear"]`);
            let options = angular.element(elem).scope().questions.registrationYear.options;

            let carYearToStr = ('' + carYear);

            options.forEach(regYear => {
              if (regYear.code === carYearToStr) {
                angular.element(elem).scope().questions.registrationYear.value = carYearToStr;
                angular.element(elem).scope().questions.registrationYear.onChange();
              }
            })
          }, carYear)

          .wait(5000)
          .evaluate((carModel) => {
            let elem = document.querySelector(`select[name="model"]`);
            let options = angular.element(elem).scope().questions.model.options;

            let normCollectionModels = normalizeCollection(options);

            function normalizeCollection(collection) {
              let clonedCollection = collection.map(item => Object.assign({}, item));
            
              clonedCollection.map(item => {
                item.message = item.message.toLowerCase().trim();
                item.message = item.message.replace(/-/g, '');
              });
            
              return clonedCollection;
            }

            function findMatchingModel(carModel, modelList) {
              const matches = [];

              modelList.map(modelItem => {
                if (modelItem.message.indexOf(carModel) !== -1) {
                  matches.push(modelItem);
                }
              });
              // debugger;
              console.log(`}}}`, matches);
              // debugger;
              if (matches.length > 1) {

                for (let i = 0; i < matches.length; i++) {
                  if (matches[i].message === carModel) {
                    return matches[i];
                  }
                }

                for (let i = 0; i < matches.length; i++) {
                  if (matches[i].message.indexOf(carModel) !== -1) {
                    return matches[i];
                  }
                }
    
    
                for (let i = 0; i < matches.length; i++) {
                  if (matches[i].message.indexOf(carModel) !== -1) {
                    return matches[i];
                  }
                }
    
              } else {
                return matches[0];
              }
    
              return matches;
            }

            let findModel = findMatchingModel(carModel, normCollectionModels);

            options.forEach(model => {
              if (model.code === findModel.code) {
                angular.element(elem).scope().questions.model.value = findModel.code;
                angular.element(elem).scope().questions.model.onChange();
              }
            });

          }, carModel)

          .wait(5000)
          .evaluate((carModelType) => {
            function normalizeCollection(collection) {
              let clonedCollection = collection.map(item => Object.assign({}, item));

              clonedCollection.map(item => {
                item.message = removeBrackets(item.message);
                item.message = item.message.toLowerCase().trim();
                item.message = item.message.replace(/-/g, '');
              });
    
              return clonedCollection;
            }

            function normalizeItem(item) {
              let clonedStr = item.toLowerCase().trim().replace(/-/g, '');
              return clonedStr;
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

            function findMatchingCar(carModel, carList) {
              const matches = [];
    
              carList.map(carItem => {
                if (carItem.message.indexOf(carModel) !== -1) {
                  matches.push(carItem);
                }
              });
              // debugger;
              console.log(matches);
              if (matches.length > 1) {
                for (let i = 0; i < matches.length; i++) {
                  if (matches[i].message === carModel) {
                    return matches[i];
                  }
                }
      
                for (let i = 0; i < matches.length; i++) {
                  if (matches[i].message.indexOf(carModel) !== -1) {
                    return matches[i];
                  }
                }
    
              } else {
                return matches[0];
              }
            }

            let elem = document.querySelector(`select[name="modelType"]`);
            let options = angular.element(elem).scope().questions.modelType.options;

            let normCarsCollection = normalizeCollection(options);

            let findModelType = findMatchingCar(carModelType, normCarsCollection);
            console.log(findModelType);
            for (let i = 0; i < options.length; i++) {
              if (options[i].code === findModelType.code) {
                angular.element(elem).scope().questions.modelType.value = ('string:' + findModelType.code);
                elem.value = ('string:' + findModelType.code);
                var event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, true);
                elem.dispatchEvent(event);
                break;
              }
            }

            }, carModelType)

          .wait(30000)

          .end()
          .then(() => {
            console.log('THIS IS END OF CRAWLING')
          })
          .catch((err) => {
            console.log(`ERR`, JSON.stringify(err))
          })

      })

  })
  .catch((err) => {
    console.log('There is no correct response from OFV service')
  })