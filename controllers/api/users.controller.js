var config = require('../../config.json');
var express = require('express');
var router = express.Router();
var userService = require('../../services/user.service');
var sqlDbService = require('../../services/db.service');


// var jwt = require('jsonwebtoken');


// router.use(function (req, res, next) {
       
//        var token = req.body.token || req.headers['token'] || req.query.token || req.headers['x-access-token'] || req.session.token ;
//        console.log('users.controllers has been invoked! and token = ' +token + ' ' + req.sessionID +' ' +  req.session.token );
//        if (token) {
//            jwt.verify(token,"SP_|Tool|_Key", function (err, decode) {
//                if (err) {
//                    res.status(500).send("invalid token");
//                } else {
//                    console.log('req.decode = ' + JSON.stringify(decode));
//                    req.decode = decode;
//                    //req.sub = decode.sub
//                    next(JSON.stringify(req.decode));
//                }
//            })
//        } else {
//            res.send("please send a token to further process your request");
//        }
//     })

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.get('/group',getGroupList);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getGroupList(req, res){
    userService.getGroupList()
    .then(function(group){
        if (group){
            res.send(group);
        }else {
            res.sendStatus(404);
        };
    })
    .catch(function(err){
        res.status(400).send(err);
    });
}

function getCurrentUser(req, res) {
    var userid = req.user.sub;
    userService.getById(userid).then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    console.log('userid = req.user.sub and userid is ' + userId);
    console.log('req.params._id is ' + req.params._id);
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
