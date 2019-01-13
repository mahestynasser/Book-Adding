const axios = require('axios');
var xlsx = require('node-xlsx').default;
const workSheetsFromFile = xlsx.parse(`${__dirname}/books.xlsx`);
const _ = require('lodash');


var getCategoryByName = async (name) => {
  try {
    var response = await axios.get('http://localhost:3000/categories');
    var cat = _.find(response.data.data, {'name' : name});
    // console.log(cat);
    if(cat)
    return cat.id;
    else return cat;
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
    
    if(!isCurrentCategoryExist)
    {
      try {
        var response = await axios.post('http://localhost:3000/categories/create', {name : currCateg});
        return response;
      }
      catch(e) {
        return e.response.data;    
      }
    }
  }
}

var getAuthorByName = async (name) => {
  try {
    var response = await axios.get('http://localhost:3000/authors');
    var auth = _.find(response.data.data, {'name' : name});
    if(auth)
    return auth.id;
    else return auth;
  }
  catch(e) {
    console.log(e);  
  }
}

var createAuthors = async () => {
  var sheet1 = workSheetsFromFile[0].data;
  var sheet2 = workSheetsFromFile[1].data;

  for(var i=1; i<sheet1.length; i++) {
    currAuth = sheet1[i][1];
    // console.log(currAuth);
    
    var isCurrentAuthorExist = await getAuthorByName(currAuth);
    if(!isCurrentAuthorExist)
    {
      try {
        var isNotfoundInSheet2 = true;
        for(var j=1; j<sheet2.length; j++) {
          currAuthor = sheet2[j][0];
          if(currAuth === currAuthor) {
            isNotfoundInSheet2 = false;
            var response = await axios.post('http://localhost:3000/authors/create', {name:currAuth, jobTitle: sheet2[j][1],
            bio: sheet2[j][2]});
            return response;
          }
        }
        if(isNotfoundInSheet2)
        var response = await axios.post('http://localhost:3000/authors/create', {name : currAuth});
        return response;
      }
      catch(e) {
        return e.response.data;    
      }
    }
  }
}

var getBookByTitle = async (title) => {
  try {
    var response = await axios.get('http://localhost:3000/books');
    var book = _.find(response.data.data, {'title' : title});
    
    return book ;
  }
  catch(e) {
    console.log(e);  
  }
}

var createBooks = async () => {
  var sheet1 = workSheetsFromFile[0].data;

  for(let i=1; i<sheet1.length; i++) {
    currbookTitle = sheet1[i][0];
    // console.log(currbookTitle);
    
    var isCurrentBookExist = await getBookByTitle(currbookTitle);
    if(!isCurrentBookExist)
    {
      try {
        var authorName = sheet1[i][1];
        var categoryName = sheet1[i][7];
        var category = await getCategoryByName(categoryName);
        var author = await getAuthorByName(authorName);
        var publishYear = undefined;
        var pagesNumber = undefined;

        if(sheet1[i][4]!==null)
        publishYear = sheet1[i][4];

        if(sheet1[i][5]!==null)
        pagesNumber = sheet1[i][5];

        var response = await axios.post('http://localhost:3000/books/create', {
          title: currbookTitle,
          author: author,
          description: sheet1[i][2],
          isbn: sheet1[i][3],
          publishYear: publishYear,
          pagesNumber: pagesNumber,
          image: sheet1[i][6],
          category: category
        });
        
      }
      catch(e) {
        // console.log(e);      
        return {resp: e.response.data, record: i+1, data: sheet1[i]};       
      }
    }
  }
  return {resp: {status : 'success'}}
}

var getBooksNumber = async() => {
  var respnse = await axios.get('http://localhost:3000/books');
  return respnse.data.data.length;
}

// createCategories().then(console.log);
// createAuthors().then(console.log);
// createBooks().then(console.log);
// getBooksNumber().then(console.log);

//console.log(workSheetsFromFile[0].data[1][7]);

  // .then(function (response) {
  //   console.log(response.data.data);
  // })
  // .catch(function (error) {
  //   console.log(error);
  // });

  module.exports = {
    createCategories,
    createAuthors,
    createBooks,
    getBooksNumber
}

