const rp = require('request-promise');
const debug = require('debug');
const Nightmare = require('nightmare');
const colors = require('colors');

const getCarModule = require('./get-car-variants');
const mock = require('./mock-data');

const baseUrl = 'https://tribe-back-end-dev.herokuapp.com/public/ofv/data'

const endpoint = 'https://www.finansportalen.no/forsikring/bilforsikring/';

const carRegNumber = 'BS14585';

function getAllCarInfo(carRegNumber) {
  return rp(`${baseUrl}/${carRegNumber}`);
}

debug('booting');

getAllCarInfo(carRegNumber)
  .then(response => {

    let nightmare = Nightmare({
      show: true,
      openDevTools: true,
      waitTimeout: 6000000,
      gotoTimeout: 6000000,
      webPreferences: {
        partition: 'nopersist'
      }
    });

    let carInfo = JSON.parse(response);
    let short = carInfo.data.matchingVehicles[0];
    let carBrand = short.brandName;
    let carRegistrationYear = short.yearModel;
    // carRegistrationYear = (carRegistrationYear * 1) + 1;
    let carModel = short.modelName;
    let carModelType = short.variantName;

    let carIsPresentInCurrentYear = true;

    console.log(
      `[${carBrand}]`.bgRed.yellow,
      `[${carRegistrationYear}]`.bgRed.yellow,
      `[${carModel}]`.bgRed.yellow,
      `[${carModelType}]`.bgRed.yellow
    );
    
    getCarModule.getCarVariants(carBrand, carRegistrationYear, carModel).then(carModelTypes => {
      let normCarVariant = mock.normalizeCarModelTypeItem(carModelType);
      let normCarVariants = mock.normalizeCarModelTypeList(carModelTypes);
      
      let findCarVariant = mock.findMatcingCarModelType(normCarVariant, normCarVariants);
      
      if (!findCarVariant) {
        carRegistrationYear = Number(carRegistrationYear) + 1;
        carIsPresentInCurrentYear = false;
        // console.log(`here #1`, carRegistrationYear)
      }

      let carInstance = {carBrand, carRegistrationYear, carModel, carModelType, carIsPresentInCurrentYear};

      nightmare
      .goto(endpoint)

      .wait(15000)
      .evaluate((carInstance) => {
        let carBrand = carInstance['carBrand']
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
      }, carInstance)

      .wait(5000)
      .evaluate((carInstance) => {
        let carRegistrationYear = carInstance['carRegistrationYear']
        let elem = document.querySelector(`select[name="registrationYear"]`);
        let options = angular.element(elem).scope().questions.registrationYear.options;

        let carRegistrationYearToString = ('' + carRegistrationYear);
        // console.log(`>>>>`, carRegistrationYearToString);
        options.forEach(regYear => {
          if (regYear.code === carRegistrationYearToString) {
            angular.element(elem).scope().questions.registrationYear.value = carRegistrationYearToString;
            angular.element(elem).scope().questions.registrationYear.onChange();
          }
        })

      }, carInstance)

      .wait(5000)
      .evaluate((carInstance) => {
        let carModel = carInstance['carModel'];
        let carRegistrationYear = carInstance['carRegistrationYear'];
        let carIsPresentInCurrentYear = carInstance['carIsPresentInCurrentYear'];

        if (!carIsPresentInCurrentYear) {
          carRegistrationYear -= 1;
        }

        function normalizeCollection(collection) {
          let clonedCollection = collection.map(item => Object.assign({}, item));
        
          clonedCollection.map(item => {
            item.message = item.message.toLowerCase().trim();
            item.message = item.message.replace(/-/g, '');
          });
        
          return clonedCollection;
        }

        function normalizeItem(item) {
          let carRegex = {
            'C-Max2': /\d+$/
          };

          let clonedStr = item.toLowerCase().trim().replace(/-/g, '');

          if (item in carRegex) {
            clonedStr = clonedStr.replace(carRegex[item], '');
          }

          return clonedStr;
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
          if (matches.length > 1) {

            for (let i = 0; i < matches.length; i++) {
              if (matches[i].message.indexOf(carModel) !== -1 && matches[i].message.indexOf(carRegistrationYear) !== -1) {
                console.log(`REG YEAR`, carRegistrationYear);
                return matches[i];
              }
            }

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

          return matches;
        }

        let elem = document.querySelector(`select[name="model"]`);
        let options = angular.element(elem).scope().questions.model.options;

        let normCarModel = normalizeItem(carModel);
        let normCollectionModels = normalizeCollection(options);

        let findModel = findMatchingModel(normCarModel, normCollectionModels);

        options.forEach(model => {
          if (model.code === findModel.code) {
            angular.element(elem).scope().questions.model.value = findModel.code;
            angular.element(elem).scope().questions.model.onChange();
          }
        });

      }, carInstance)

      .wait(5000)
      .evaluate((carInstance) => {
        // console.log(`carModelType`, carModelType);
        let carModelType = carInstance['carModelType'];

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

        let normCarVariant = normalizeItem(carModelType);
        let normCarsCollection = normalizeCollection(options);

        let findModelType = findMatchingCar(normCarVariant, normCarsCollection);

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
      }, carInstance)

      .wait(30000)
      .end()
      .then(() => {
        console.log('end of script'.green);
      })
      .catch((err) => {
        console.log('error'.red, `${err}`.bgRed);
        console.log(JSON.stringify(err));
      })
    });
  })
  .catch(err => {
  console.log(`Error with in request`.bgRed.yellow);
  console.log(err.toString().bgRed);
  })


