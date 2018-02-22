(function () {
    'use strict';

    angular
        .module('app')
        .factory('CarService', CarService);

    CarService.$inject = ['$http'];

    function CarService($http) {
        var service = {
            getYears: getYears,
            getMakes: getMakes,
            getModels: getModels,
            getTrims: getTrims,
            getCar: getCar
        }

        return service;

        function getYears() {
            return $http.get('/api/Cars/Years')
                .then(function (response) {
                    return response.data
                });
        }

        function getMakes(year) {
            var options = { params: { _year: year } };
            return $http.get('/api/Cars/Makes', options)
                .then(function (response) {
                    return response.data;
                });
        }

        function getModels(year, make) {
            var options = { params: { _year: year, _make: make } };
            return $http.get('/api/Cars/Models', options)
                .then(function (response) {
                    return response.data;
                });
        }

        function getTrims(year, make, model) {
            var options = { params: { _year: year, _make: make, _model: model } };
            return $http.get('/api/Cars/Trims', options)
                .then(function (response) {
                    return response.data;
                });
        }

        function getCar(year, make, model, trim) {
            var options = { params: { year: year, make: make, model: model, trim: trim } };
            return $http.get('/api/Cars/getCar', options)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();