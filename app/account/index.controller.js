(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            console.log(' initController starting ....');
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
                // for( var key in user ){
                //     if ( user.hasOwnProperty(key)){
                //     console.log('user[' + key + '] = '+user[key])
                //     }
                // }
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteUser() {
            // UserService.Delete(vm.user._id)
            Console.log('vm.userid = '+ vm.user[0]['_id']);
            UserService.Delete(vm.user[0]['CUSTM_USRID'])
                .then(function () {
                    // log user out
                    $window.location = '/login';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();