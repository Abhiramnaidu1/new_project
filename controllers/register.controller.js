var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.json');
const nodemailer = require('nodemailer');
router.get('/', function (req, res) {
    res.render('register');
});

router.post('/', function (req, res) {

    // register using api to maintain clean separation between layers
    req.body.state="inactive";
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
      console.log(response);
      console.log("========================================================================================================");
      console.log(body);
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }

        if (response.statusCode !== 200) {
            return res.render('register', {
                error: response.body,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username
            });

            console.log("email sent");
        }

        // return to login page with success message
        req.session.success = 'User Registered, Check your mail';
        var smtpTrans = nodemailer.createTransport({
           service: 'Gmail',
           auth: {
            user: 'webprogram1234@gmail.com',
            pass: 'Abc@1234'
          }
        });
        console.log("email");
        smtpTrans.sendMail({
          from: 'webprogram1234@gmail.com',
          to: req.body.username,
          subject:'Account confirmation',
          text:'Hi '+req.body.firstName+'\n\n'+'To confirm email press below link :\n\n' +
            'http://localhost:8000/api/users/verifytoken/' +body.insertedIds[0] + '\n\n',

        });
        return res.redirect('/login');
    });
});

module.exports = router;
