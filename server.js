var express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const funcs = require('./app');
var {logger} = require('./logger');



app.get('/', async(req, res) => {
    try {
        var initialNumberOfBooks = await funcs.getBooksNumber();
        
        await funcs.createCategories();
        await funcs.createAuthors();
        await funcs.createBooks();
        var currentNumberOfBooks = await funcs.getBooksNumber();
        console.log(currentNumberOfBooks);
        
        var enteredBooks = currentNumberOfBooks-initialNumberOfBooks;
        res.send({
            data : enteredBooks,
            status : 'success'
        });
    }
    catch(err) {
        console.log(err);
        logger.log({
            level: 'error',
            message: err,
            time: new Date()
          });
        res.status(500).send({
            data : err,
            status : 'fail'
        });
    }
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});