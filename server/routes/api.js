const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/PredictGame');
mongoose.connect('mongodb://typeruser:typermocnehaslo2@ds016128.mlab.com:16128/typermssd');
mongoose.Promise = global.Promise;
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const promise = require('promise');
const mail = require('./activate');
const rand = require("random-key");
const hostname = 'typerms.atthost24.pl';

addUser = function (content) {
  return new promise(function(res, rej){
    User.findOne({$or: [{mail: content.mail}, {login: content.login}]}, function(err,obj){
      if(err) throw err;
      if(obj){
        if(obj.login === content.login){
            res({message: "Ten login jest zajęty."});
        }
        else if(obj.mail === content.mail){
            res({message: "Ten email jest zajęty."});
        }
      }
      else{
        content.password = bcrypt.hashSync(content.password, salt);
        content.activationToken = rand.generate(24);
        User.create(content).then(function(user){
          res(user);
        });
      }
    });
  });
};

findUser = function (content) {
  return new promise(function (res, rej) {
    User.findOne({login: content.login}, function(err,obj){
      if(err) throw err;
      if(obj) {
        bcrypt.compare(content.password, obj.password, function (err, resp) {
          if(err) throw err;
          if(resp) {
            if(obj.active === true && obj.resetPass === false){
              res(obj);
            }
            else if(obj.active === false) {
                res({message: "Aktywuj swoje konto lub dokończ proces odzyskiwania hasła."});
            }
            else if(obj.resetPass === true){
                res({message: "Dokończ proces odzyskiwania hasła."});
            }
          }
          else {
            res({message: "Podałeś nieprawidłowe hasło."});
          }
        });
      }
      else {
        res({message: "Nieznaleziono takiego użytkownika."});
      }
    });
  });
};

router.post('/login', function(req, resp){
  session = req.session;
  //if(!session.uniqueID){
    findUser(req.body).then(function (response) {
      if(response.message){
        resp.status(409).send(response.message);
        //resp.end(JSON.stringify(response.message));
      }
      else {
        session.uniqueID = req.body.login;
        resp.end(JSON.stringify(response));
      }
    });
});

router.post('/logout', function (req, resp) {
  req.session.destroy();
});

router.post('/register', function(req, resp){
  addUser(req.body).then(function(newUser){
    if(newUser.message){
        resp.status(409).send(newUser.message);
    }
    else {
        mail.sendMail({
            from: 'ntife17@gmail.com',
            to: newUser.mail,
            subject: 'Aktywuj swoje konto na typerms.unicloud.pl',
            text: 'Wejdz w poniższy link aby aktywować swoje konto: http://' + hostname + '/activate/' + newUser.activationToken
        }, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        resp.end(JSON.stringify(newUser));
    }
  });
});

router.post('/forgotPass', function (req, resp) {
    const token = rand.generate(24);
    User.findOne({mail: req.body.mail}, function(err,user){
        if(err) throw err;
        if(user) {
            if(!user.active){
                resp.status(409).end("Konto nie zostało aktywowane!");
            }
            else if(!user.resetPass){
                User.updateOne({ mail: req.body.mail},{ $set: {resetPass: true, resetToken: token}}, function (err, obj) {
                    if(err) throw err;
                        mail.sendMail({
                            from: 'ntife17@gmail.com',
                            to: req.body.mail,
                            subject: 'Resetowanie hasła na typerms.unicloud.pl',
                            text: 'Wejdz w poniższy link aby zresetować swoje hasło: http://' + hostname + '/resetPass' + token
                        }, function(error, info){
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        resp.end();
                    });
            }
            else {
                resp.status(409).end("Dokończ poprzedni proces odzyskiwania hasła.");
            }
        }
        else {
            resp.status(409).end("Nieznaleziono użytkownika o podanym adresie e-mail.");
        }
    });
});

router.post('/findUser', function (req, resp) {
    User.findOne({_id: req.body._id}, function (err, obj) {
        if(err) throw err;
        if(obj){
            resp.end(JSON.stringify(obj));
        }
    });
});

router.get('/activate/:token', function(req, resp){
    User.updateOne({activationToken: req.params.token},{ $set: {active: true, activationToken: ''}}, function (err, obj) {
        if(err) throw err;
        if(obj.n === 1) {
            resp.cookie('accActivated', true);
            resp.redirect('/login');
        }
        else {
            resp.cookie('wrongAccToken', true);
            resp.redirect('/');
        }
    });
});

router.get('/resetPass/:token', function(req, resp){
    User.findOne({resetToken: req.params.token}, function (err, obj) {
        if(err) throw err;
        if(obj){
            resp.cookie('resetPassToken', req.params.token);
            resp.redirect('/reset');
        }
        else {
            resp.cookie('wrongResetToken', false);
            resp.redirect('/');
        }
    });
});

router.post('/resetPass', function (req, resp) {
    const newPassword = bcrypt.hashSync(req.body.password, salt);
    User.updateOne({resetToken: req.body.token},{ $set: {resetPass: false, resetToken: '', password: newPassword}}, function (err, obj) {
        if(err) throw err;
        if(obj.n === 1) {
            resp.end();
        }
        else {
            resp.status(409).end('Niepoprawny Reset Token');
        }
    });
});
module.exports = router;
