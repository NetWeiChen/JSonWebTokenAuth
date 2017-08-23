(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;
        vm.grouplist = null;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
            UserService.GetGroupList().then(function(grouplist){
                vm.grouplist = grouplist;
            });
        }
    }

})();