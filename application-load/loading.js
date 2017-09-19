let interval =setInterval(() => {
  let condition = document.getElementsByClassName('col-md-9 calculator-loader')[0].style.display === 'none';
  console.log(
    document.getElementsByClassName('col-md-9 calculator-loader')[0].style.display === 'none'
  );
  
  if (condition) {
    clearInterval(interval);
    setTimeout(() => {
      alert('NOT BLOCKING');
    }, 3000);
  }
  
}, 500);