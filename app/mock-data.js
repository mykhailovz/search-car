const MIN = 0, MAX = 99;

let url = {
  baseUrl: 'https://www.finansportalen.no/insurance-calculator/rest/classifier/car/registrationYear',
  classifyUrl: 'https://www.finansportalen.no/insurance-calculator/rest/classifier/car/carModel',
  carVariantUrl: 'https://www.finansportalen.no/insurance-calculator/rest/classifier/car/carVariant'
};

const ssnList = [
  '03041049994', '03041049722', '03041049641', '03041049218', '03041049137',
  '03041049056', '03041048939', '03041048858', '03041048777', '03041048696',
  '03041048424', '03041048343', '03041048262', '03041048181', '03041047983',
  '03041047711', '03041047479', '03041047398', '03041047126', '03041047045',
  '03041046928', '03041046847', '03041046766', '03041046685', '03041046413',
  '03041046332', '03041046251', '03041045972', '03041045891', '03041045549',
  '03041045468', '03041045387', '03041045115', '03041045034', '03041044917',
  '03041044836', '03041044755', '03041044674', '03041044593', '03041044321',
  '03041044089', '03041043961', '03041043619', '03041043538', '03041043457',
  '03041043376', '03041043295', '03041043023', '03041042825', '03041042744',
  '03041042663', '03041042582', '03041042159', '03041042078', '03041041799',
  '03041041527', '03041041446', '03041041365', '03041041284', '03041041012',
  '03041040814', '03041040733', '03041040652', '03041040571', '03041040229',
  '03041040148', '03041040067', '03041039921', '03041039689', '03041039417',
  '03041039336', '03041039255', '03041039174', '03041039093', '03041038976',
  '03041038895', '03041038623', '03041038542', '03041038461', '03041038119',
  '03041038038', '03041037759', '03041037678', '03041037597', '03041037325',
  '03041037244', '03041037163', '03041037082', '03041036965', '03041036884',
  '03041036612', '03041036531', '03041036299', '03041036027', '03041035829',
  '03041035748', '03041035667', '03041035586', '03041035314', '03041035233',
];

const carCodes = [
  { "code": "1100", "message": "Alfa Romeo" },
  { "code": "1170", "message": "Aston Martin" },
  { "code": "1230", "message": "Audi" },
  { "code": "1350", "message": "Bentley" },
  { "code": "1400", "message": "BMW" },
  { "code": "1500", "message": "Buick" },
  { "code": "1550", "message": "Cadillac" },
  { "code": "2650", "message": "Chevrolet" },
  { "code": "1650", "message": "Chevrolet US" },
  { "code": "1700", "message": "Chrysler" },
  { "code": "1750", "message": "Citroën" },
  { "code": "3290", "message": "Dacia" },
  { "code": "3330", "message": "Daewoo" },
  { "code": "2030", "message": "Daihatsu" },
  { "code": "2250", "message": "Dodge" },
  { "code": "256", "message": "DS" },
  { "code": "2400", "message": "Ferrari" },
  { "code": "2450", "message": "Fiat" },
  { "code": "1199", "message": "Fisker" },
  { "code": "2600", "message": "Ford" },
  { "code": "3580", "message": "Galloper" },
  { "code": "7740", "message": "Honda" },
  { "code": "4030", "message": "Hummer" },
  { "code": "3390", "message": "Hyundai" },
  { "code": "4330", "message": "Infiniti" },
  { "code": "2003", "message": "Infiniti" },
  { "code": "3240", "message": "Isuzu" },
  { "code": "3310", "message": "Iveco" },
  { "code": "3400", "message": "Jaguar" },
  { "code": "3510", "message": "Jeep" },
  { "code": "3420", "message": "Kewet" },
  { "code": "7630", "message": "Kewet Buddy" },
  { "code": "3450", "message": "Kia" },
  { "code": "5610", "message": "Lada/VAZ" },
  { "code": "3700", "message": "Lancia" },
  { "code": "4953", "message": "Land Rover" },
  { "code": "9970", "message": "Lexus" },
  { "code": "3920", "message": "Maserati" },
  { "code": "3930", "message": "Mazda" },
  { "code": "3900", "message": "Mercedes-Benz" },
  { "code": "4000", "message": "MG" },
  { "code": "3690", "message": "MINI" },
  { "code": "4011", "message": "Mitsubishi" },
  { "code": "4050", "message": "Morgan" },
  { "code": "2001", "message": "Nissan" },
  { "code": "4350", "message": "Opel" },
  { "code": "4500", "message": "Peugeot" },
  { "code": "8520", "message": "Piaggio" },
  { "code": "4550", "message": "Plymouth" },
  { "code": "4650", "message": "Pontiac" },
  { "code": "4700", "message": "Porsche" },
  { "code": "4800", "message": "Renault" },
  { "code": "4900", "message": "Rolls-Royce" },
  { "code": "4951", "message": "Rover" },
  { "code": "5090", "message": "Seat" },
  { "code": "5150", "message": "Skoda" },
  { "code": "3590", "message": "Smart" },
  { "code": "3440", "message": "SsangYong" },
  { "code": "3440", "message": "Ssangyong" },
  { "code": "5260", "message": "Subaru" },
  { "code": "8380", "message": "Suzuki" },
  { "code": "5000", "message": "Saab" },
  { "code": "4360", "message": "Tesla" },
  { "code": "3560", "message": "Think" },
  { "code": "5480", "message": "Toyota" },
  { "code": "5750", "message": "Volkswagen" },
  { "code": "5800", "message": "Volvo" }
];

function generateRandomIndex() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function getSSNNumber() {
  let index = generateRandomIndex();

  return ssnList[index];
}

function log(car) {
  let {
    carBrand,
    registrationYear,
    carModel,
    carVariant,
    approvedTheftAlarm,
    espYes,
    approvedRetrieval,
    isVehicleLeased,
    bonus,
    maxMileageYear,
    deductibleInCaseOfDamage,
    ageOfYoungestDriver,
    coverage,
    claimsInIast3years,
    parkingConditions,
    prevInsuranceCompany,
    idNumber,
    zipCode,
    streetName,
    buildingNumber,
    antallForsikringer,
    allMemberships
  } = car;

  console.log(
    `car brand: [${carBrand}]`.bgRed.yellow,
    `registration year: [${registrationYear}]`.bgRed.yellow,
    `car model: [${carModel}]`.bgRed.yellow,
    `car variant: [${carVariant}]`.bgRed.yellow,
    `approved theft alarm: [${approvedTheftAlarm}]`.bgRed.yellow,
    `esp: [${espYes}]`.bgRed.yellow,
    `approved retrieval: [${approvedRetrieval}]`.bgRed.yellow,
    `is vehicle is leased: [${isVehicleLeased}]`.bgRed.yellow,
    `bonus: [${bonus}]`.bgRed.yellow,
    `max mile age: [${maxMileageYear}]`.bgRed.yellow,
    `deductible in case of damage: [${deductibleInCaseOfDamage}]`.bgRed.yellow,
    `age of youngest driver: [${ageOfYoungestDriver}]`.bgRed.yellow,
    `claims in last 3 years: [${claimsInIast3years}]`.bgRed.yellow,
    `parking conditions: [${parkingConditions}]`.bgRed.yellow,
    `prev insurance company: [${prevInsuranceCompany}]`.bgRed.yellow,
    `ssn: [${idNumber}]`.bgRed.yellow,
    `zip code: [${zipCode}]`.bgRed.yellow,
    `street name: [${streetName}]`.bgRed.yellow,
    `building number: [${buildingNumber}]`.bgRed.yellow,
    `number of insurance: [${antallForsikringer}]`.bgRed.yellow,
    `all memberships: [${allMemberships}]`.bgRed.yellow
  );
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

function normalizeCarModelTypeItem(item) {
  let carRegex = {
    'C-Max2': /\d+$/
  };

  let clonedStr = item.toLowerCase().trim().replace(/-/g, '');

  if (item in carRegex) {
    clonedStr = clonedStr.replace(carRegex[item], '');
  }

  return clonedStr;
}

function removeBrackets(str) {
  let regex = new RegExp(/[()]/g);

  if (regex.test(str)) {
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
  } else {
    return str;
  }
}

function findMatcingCarModelType(carModelType, carModelTypeList) {
  const matches = [];

  carModelTypeList.map(carItem => {
      if (carItem.message.indexOf(carModelType) !== -1) {
        matches.push(carItem);
      }
    });
    console.log(matches);

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
  getSSNNumber,
  log,
  carCodes,
  url,

  normalizeCarModelTypeList,
  normalizeCarModelTypeItem,
  removeBrackets,
  findMatcingCarModelType
};
