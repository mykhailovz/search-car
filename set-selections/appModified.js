const Nightmare = require('nightmare');

let nightmare = Nightmare({
  show: true,
  openDevTools: true,
  waitTimeout: 6000000,
  gotoTimeout: 6000000,
  executionTimeout: 720000,
  webPreferences: {
    partition: 'nopersist'
  }
});

// reject({ status: 404, message: 'Some kind of Error' });

function openPage(nightmareInstance) {
  console.log('Opening a page');
  return new Promise((resolve, reject) => {
    resolve(
      nightmareInstance.goto('https://www.finansportalen.no/forsikring/bilforsikring/').wait(10000)
    );
  })
}

function setBrand() {
  return new Promise((resolve, reject) => {
    console.log('Setting a brand value');
    let elem = document.querySelector(`select[name="brand"]`);
    angular.element(elem).scope().questions.brand.value = '1500';
    angular.element(elem).scope().questions.brand.onChange();
    resolve();
    // reject({ status: 404, message: 'Some kind of Error' });
  });
}

function setYear() {
  return new Promise((resolve, reject) => {
    let elem = document.querySelector(`select[name="registrationYear"]`);
    angular.element(elem).scope().questions.registrationYear.value = '1993';
    angular.element(elem).scope().questions.registrationYear.onChange();
    resolve();
  });
}

function setModel() {
  return new Promise((resolve, reject) => {
    let elem = document.querySelector(`select[name="model"]`);
    angular.element(elem).scope().questions.model.value = '1:1994';
    angular.element(elem).scope().questions.model.onChange();
    reject({ status: 404, message: 'Some kind of Error' });
  });
}

function setVariant() {
  return new Promise((resolve, reject) => {
    let elem = document.querySelector(`select[name="modelType"]`);
    angular.element(elem).scope().questions.modelType.value = '159';
    elem.value = 'string:159';
  });
}

openPage(nightmare)
  .then((res) => {
    return nightmare.evaluate(setBrand).wait(5000);
  })
  .catch(err => {
    console.log(`ERR #1`, err);
  })

  .then((res) => {
    return nightmare.evaluate(setYear).wait(5000);
  })
  .catch(err => {
    console.log(`ERR #2`, err);
  })

  .then((res) => {
    return nightmare.evaluate(setModel).wait(5000);
  })
  .catch(err => {
    
    nightmare.evaluate(() => {
      return new Promise((resolve, reject) => {
        let elem = document.querySelector(`select[name="registrationYear"]`);
        angular.element(elem).scope().questions.registrationYear.value = '1994';
        angular.element(elem).scope().questions.registrationYear.onChange();
        resolve();
      });
    }).wait(5000)
    .then(() => {
      return nightmare.evaluate(() => {
        let elem = document.querySelector(`select[name="model"]`);
        angular.element(elem).scope().questions.model.value = '1:1995';
        angular.element(elem).scope().questions.model.onChange();
      }).wait(5000)
    })


    console.log(`ERR #3`, err);
  })

  .then((res) => {
    console.log('HHHHHHHHHHHHHH')
    return nightmare.evaluate(setVariant).wait(5000);
  })

  .then((res) => {
    nightmare.end().then(() => {
      console.log(`ENDING OF CRAWLER`);
    });
  })
  .catch(err => {
    console.log('Error', err)
  });