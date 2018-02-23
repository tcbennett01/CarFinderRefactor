(function () {
    'use strict';

    angular
        .module('app')
        .controller('CarController', CarController);

    CarController.$inject = ['$location', '$uibModal', '$scope', '$timeout', 'CarService'];

    function CarController($location, $uibModal, $scope, $timeout, CarService) {
        /* jshint validthis:true */
        var vm = this;

        vm.imageAlert = '';
        vm.recallAlert = ''
        vm.selectedYear = '';
        vm.selectedMake = '';
        vm.selectedModel = '';
        vm.selectedTrim = '';
        vm.years = [];
        vm.makes = [];
        vm.models = [];
        vm.trims = [];
        vm.car = {};
        vm.getYears = getYears;
        vm.getMakes = getMakes;
        vm.getModels = getModels;
        vm.getTrims = getTrims;
        vm.getCar = getCar;
        vm.isValidSearch = isValidSearch;
        vm.validSearch = false;
        vm.car = getCar;
        var recalls = [];
        vm.reset = reset;
        vm.showSpinner = false;
        vm.openModal = openModal;
        vm.cancel = cancel;

        //vm.gridOptions = {
        //    columnDefs: [
        //        { name: 'Component', field: 'Component' },
        //        { name: 'Manufacturer', field: 'Manufacturer' },
        //        { name: 'Summary',      field: 'Summary'}
        //    ]
        //};

        activate();

        function activate() {
            getYears();
        };

        function getYears() {
            CarService.getYears()
                .then(function (data) {
                    vm.years = data;
                });
        };

        function getMakes() {
            CarService.getMakes(vm.selectedYear)
                .then(function (data) {
                    vm.makes = data.map(function (m) {
                        return m.toUpperCase();
                    });                  
                });
        };

        function getModels() {
            CarService.getModels(vm.selectedYear, vm.selectedMake)
                .then(function (data) {
                    vm.models = data.map(function (m) {
                        return m.toUpperCase();
                    });
                });
        };

        function getTrims() {
            CarService.getTrims(vm.selectedYear, vm.selectedMake, vm.selectedModel)
                .then(function (data) {
                    vm.trims = data;
                    isValidSearch();
                });
        };

        function getCar() {
            CarService.getCar(vm.selectedYear, vm.selectedMake, vm.selectedModel, vm.selectedTrim)
                .then(function (data) {
                    vm.car = data;
                    //vm.gridOptions.data = data.Recalls.Results;

                    if (data.Image === '') vm.imageAlert = 'Image unavailable';
                    if (data.Recalls.Count === 0) vm.recallAlert = data.Recalls.Message;
                });
            vm.showSpinner = true;
            $timeout(openModal, 2000);
        };

        function isValidSearch() {
            vm.validSearch = (vm.selectedModel);
        };

        function reset() {
            window.location.reload();
        }

        function openModal() {
            vm.showSpinner = false;
            vm.$modalInstance = $uibModal.open({
                templateUrl: '~/../../App_Ng/carmodal.html',
                scope: $scope,
                size: 'lg',
                backdrop: 'static'
            })
        }

        function cancel() {
            vm.$modalInstance.close();
            vm.imageAlert = '';
            vm.recallAlert = '';
           }
    }
})();
