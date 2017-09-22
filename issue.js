let problemCarNumbers = [
  { 'KH42466': 'no car in model type that equals or contains', 'solution': {'#1': 'set year + 1'} },
  { 'BS14585': 'same issue no car for specified year', 'solution': {'#1': 'set year + 1'} },
  { 'JV11763': 'same issue no car for specified year', 'solution': {'#1': 'set year + 1'} },
  { 'FT27520': 'same issue no car for specified year', 'solution': {'#1': 'set year + 1'} },
  { 'EL80426': 'no car type in response for all bmw i3', 'solution': { '#1': 'handle'} },
  { 'AS15240': 'carModel is carModel is C-Max2', 'solution': {'#1': 'need to remove a last digit to normalize C-Max2->C-Max'}},
  { 'YU39890': 'same issue no car for specified year AND NEED TO SET CAR MODEL' },

  { 'PD39740': 'NO FIND CAR IN LIST OF CARS' },
  { 'DN87044': 'NO FIND CAR IN LIST OF CARS' }, // CF65866
  { 'CF65866': 'NO FIND CAR IN LIST OF CARS' } 

];

// KH84029 no car in list

let cars = [
  'JD59786', // Audi
  'DJ79020', // Bmw
  'NV62907', // Citroen
  'SU40640', // Ford
  'BP79058', // Honda
  'PP73046', // Hyundai
  'CV70223', // Kia
  'DP53940', // Mazda
  'RJ50298', // Mercedes-Benz
  'PP73240', // Mitsubishi
  'LJ25765', // Nissan
  'BS31658', // Opel
  'NF53243', // Peugeot
  'SD56388', // Renault
  'LH97880', // Skoda
  'CF46703', // Subaru
  'SU33617', // Suzuki
  'DK88234', // Toyota
  'DL46337', // Volkswagen
  'BR30939', // Volvo
];
