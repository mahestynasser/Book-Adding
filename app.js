const axios = require('axios');
var xlsx = require('node-xlsx').default;
const workSheetsFromFile = xlsx.parse(`${__dirname}/books.xlsx`);
const _ = require('lodash');

// console.log(workSheetsFromFile[1].data);

var getCategoryByName = async (name) => {
  try {
    var response = await axios.get('http://localhost:3000/categories');
    var cat = _.find(response.data.data, {'name' : name});
    //console.log(cat);
    
    return cat ;
  }
  catch(e) {
    console.log(e);  
  }
}

var createCategories = async () => {
  var sheet1 = workSheetsFromFile[0].data;

  for(var i=1; i<sheet1.length; i++) {
    currCateg = sheet1[i][7];
    var isCurrentCategoryExist = await getCategoryByName(currCateg);
    if(isCurrentCategoryExist)
    continue;
    else {
          
    try {
        var response = await axios.post('http://localhost:3000/categories/create', {name : currCateg});
      }
      catch(e) {
        console.log(e);
        
      }
    }
    //console.log(currentCategory);

  }
}
createCategories().then(console.log);

//console.log(workSheetsFromFile[0].data[1][7]);

  // .then(function (response) {
  //   console.log(response.data.data);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

