(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetGroupList =GetGroupList;

        return service;

        function GetCurrent() {
            return $http.get('/api/users/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/api/users').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            console.log('GetById for pareameter _id is ' + _id);
            return $http.get('/api/users/' + _id).then(handleSuccess, handleError);
        }
        function GetGroupList(){
            return $http.get('/api/users/group').then(handleSuccess, handleError);
        }
        function GetByUsername(username) {
            return $http.get('/api/users/' + username).then(handleSuccess, handleError);
        }

        function Create(user) {
            return $http.post('/api/users', user).then(handleSuccess, handleError);
        }

        function Update(user) {
            console.log('update user and user._id = '+ user._id);
            // return $http.put('/api/users/' + user._id, user).then(handleSuccess, handleError);
            return $http.put('/api/users/' + user.username, user).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            console.log('in user.service.js, delete id and id is '+ _id);
            return $http.delete('/api/users/' + _id).then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
