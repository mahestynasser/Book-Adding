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
        var response = await funcs.createBooks();
        var currentNumberOfBooks = await funcs.getBooksNumber();
        // console.log(currentNumberOfBooks);
        // console.log(response);
        
        var enteredBooks = currentNumberOfBooks-initialNumberOfBooks;
        if(response.res.status==='success') {
            res.send({
                data : enteredBooks,
                status : 'success'
            });
        }
        else {
            logger.log({
                level: 'error',
                message: `${response.res.data} at record ${response.res.record}`,
                time: new Date()
              });
             res.status(400).send({
                data : `${response.res.data} at record ${response.res.record}`,
                status : 'fail'
            }); 
             return;
        }
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