(function() {
    "use strict";
    angular.module("app-starWars", ["ngRoute", "ngMaterial"]).controller("starWarsController", starWarsController); 
	//Controller- add dependencies
    function starWarsController($http, $scope,$interval, $mdSidenav, $mdDialog, $window, $timeout, $cacheFactory, serverAddress) { 

        var vm = this;
			
        /*
        Initialize variable/view models
        */
        vm.peoples = [];
        vm.planets = [];
        vm.species = [];
        vm.starships = [];
        vm.vehicles = [];
        vm.films = [];
        vm.singleData = {};

        vm.viewPeoples = false;
        vm.viewPlanets = false;
        vm.viewSpecies = false;
        vm.viewFilms = false;
        vm.viewVehicles = false;
        vm.viewStarships = false;
		vm.viewMap = false;

        vm.errorMessage = "";
        
		vm.loadingScreen =false;
		
		/*
        Create cache for all requests
        */
        $scope.keys = [];
        $scope.cache = $cacheFactory(Math.round(Math.random()*10000));
		
        $scope.put = function(key, value) {
            if (angular.isUndefined($scope.cache.get(key))) {
                $scope.keys.push(key);
            }
            $scope.cache.put(key, angular.isUndefined(value) ? null : value);
        };
		
		//reset cache after every 10 minutes
		$interval(function(){ 
				$scope.cache.removeAll(); 
				$scope.keys = [];
				console.log("Cache reset ");
			}, 1000*60*10);

		vm.clearErrorMessage = function(){
			vm.errorMessage = "";
		};
		

        /*
        Method: get singlePerson's data
        */
        $scope.getSinglePeopleData = function(item) {
			
			vm.loadingScreen =true;

			//item has all person's information
			vm.singleData.url =item.url;
			vm.singleData.name =item.name;
			vm.singleData.gender= item.gender;
			vm.singleData.height= item.height;
			vm.singleData.mass= item.mass;
			vm.singleData.films= item.films;
			
			vm.loadingScreen =false;
			vm.checkDisplay("map"); 
			
        }
            
     
		/*
		Change PageView as per the navigation option
		*/
        vm.checkDisplay = function(arg) {
            vm.viewPeoples = false;
            vm.viewPlanets = false;
            vm.viewSpecies = false;
            vm.viewFilms = false;
            vm.viewVehicles = false;
            vm.viewStarships = false;
			vm.viewMap = false;
            console.log("Current View set to ->: Star Wars " + arg);
            switch (arg) {
                case "peoples":
                    vm.viewPeoples = true;
                    break;
                case "planets":
                    vm.viewPlanets = true;
                    break;
                case "vehicles":
                    vm.viewVehicles = true;
                    break;
                case "films":
                    vm.viewFilms = true;
                    break;
                case "species":
                    vm.viewSpecies = true;
                    break;
                case "starships":
                    vm.viewStarships = true;
                    break;
				case "map":
                    vm.viewMap = true;
                    break;
                default:
                    vm.errorMessage = "No argument matched in switch stmnt.";
                    break;
            }
        }
        /*
		Method: get all planets data
		*/
        vm.getPlanets = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getPlanets");
            vm.planets = [];
			//check cache first
			if (angular.isUndefined($scope.cache.get("planets"))) {
                console.log("cache miss");
                $http.get(serverAddress + "planets").
                then(function(response) {
					debugger;
                    console.log("getPlanets: Response success");
                    vm.errorMessage = "";
                    vm.checkDisplay("planets");
                    angular.copy(response.data.results, vm.planets);
					//put to cache
                    $scope.put("planets", vm.planets);
					
                }, function(error) {
					//check errors
                    console.log("getPlanets: Response error!"+ error.status);
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;

                }).finally(function() {
					vm.loadingScreen = false;
                });
				
            } else {
				//if cache data found
				vm.checkDisplay("planets");
                //get cache value
                vm.loadingScreen = false;
				vm.errorMessage = "";
                console.log("cache hit");
				//copy to viewModel
                angular.copy($scope.cache.get("planets"), vm.planets);
            }

        }
        /*
		Method: get all people data
		*/
        vm.getPeoples = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getPeoples");
            vm.peoples = [];
            if (angular.isUndefined($scope.cache.get("people"))) {
                console.log("cache miss");
                $http.get(serverAddress + "people").
                then(function(response) {
                    debugger;
                    console.log("getPeoples: Response success");
                    vm.errorMessage = "";
                    //vm.peoples = response.data.results;
                    angular.copy(response.data.results, vm.peoples);
                    //cache response data
                    $scope.put("people", vm.peoples);
					vm.checkDisplay("peoples");
                }, function(error) {
                    console.log("getPeoples: Response error!"+error.status);
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;

                }).finally(function() {
						vm.loadingScreen =false;
                });
            } else {
				
                //get cache value
                vm.loadingScreen =false;
				vm.errorMessage = "";
                console.log("cache hit");
				angular.copy($scope.cache.get("people"), vm.peoples);
				vm.checkDisplay("peoples");
                }

        }

        /*
		Method: get all vehicles data
		*/
        vm.getVehicles = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getVehicles");
			vm.vehicles =[];
            if (angular.isUndefined($scope.cache.get("vehicles"))) {
                console.log("cache miss");
                $http.get(serverAddress + "vehicles").
                then(function(response) {
                    debugger;
                    console.log("getVehicles: Response success");
                    vm.errorMessage = "";
                    vm.checkDisplay("vehicles");
                    angular.copy(response.data.results, vm.vehicles);
                    $scope.put("vehicles", vm.vehicles);

                }, function(error) {
                    console.log("getVehicles: Response error!"+error.status);
                  
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;

                }).finally(function() {
					vm.loadingScreen = false;
                });
            } else {
				vm.checkDisplay("vehicles");
                vm.loadingScreen = false;
				vm.errorMessage = "";
                console.log("cache hit");
                angular.copy($scope.cache.get("vehicles"), vm.vehicles);
            }

        }
        /*
		Method: get all films data
		*/
        vm.getFilms = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getFilms");
			vm.films = [];
            if (angular.isUndefined($scope.cache.get("films"))) {
                console.log("cache miss");
                $http.get(serverAddress + "films").
                then(function(response) {
                    debugger;
                    console.log("getFilms: Response success");
                    vm.errorMessage = "";
                    vm.checkDisplay("films");
                    angular.copy(response.data.results, vm.films);
                    $scope.put("films", vm.films);

                }, function(error) {
                    console.log("getFilms: Response error!"+error.status);
                   
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;

                }).finally(function() {
					vm.loadingScreen = false;
                });
            } else {
				vm.checkDisplay("films");
                vm.loadingScreen = false;
				vm.errorMessage = "";
                console.log("cache hit");
                angular.copy($scope.cache.get("films"), vm.films);
            }


        }

        /*
        Method: get all starships data
        */
        vm.getStarships = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getStarships");
			vm.starships = [];
            if (angular.isUndefined($scope.cache.get("starships"))) {
                console.log("cache miss");
                $http.get(serverAddress + "starships").
                then(function(response) {
                    debugger;
                    console.log("getStarships: Response success");
                    vm.errorMessage = "";
                    vm.checkDisplay("starships");
                    angular.copy(response.data.results, vm.starships);
                    $scope.put("starships", vm.starships);

                }, function(error) {
                    console.log("getStarships: Response error!"+error.status);
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;

                }).finally(function() {
					vm.loadingScreen = false;
                });
            } else {
				vm.checkDisplay("starships");
                vm.loadingScreen = false;
                vm.errorMessage = "";
				console.log("cache hit");
                angular.copy($scope.cache.get("starships"), vm.starships);
            }
        }
        /*
		Method: get all species data
		*/
        vm.getSpecies = function() {
			vm.loadingScreen = true;
            console.log("Calling function vm.getSpecies");
            vm.species  = [];
			if (angular.isUndefined($scope.cache.get("species"))) {
                console.log("cache miss");
                $http.get(serverAddress + "species").
                  then(function(response) {
                    debugger;
                    console.log("getSpecies:Response success");
                    vm.errorMessage = "";
                    vm.checkDisplay("species");
                    angular.copy(response.data.results, vm.species);
                    $scope.put("species", vm.species);

                }, function(error) {
                    console.log("getSpecies: Response error!"+error.status);
                 
                    vm.errorMessage = "Failed to load API data: " + error.status + " " + error.statusText;
					
                }).finally(function() {
					vm.loadingScreen = false;
                });
            } else {
				vm.checkDisplay("species");
                vm.loadingScreen = false;
				vm.errorMessage = "";
                console.log("cache hit");
                angular.copy($scope.cache.get("species"), vm.species);
            }
        }


        vm.onLoad = function() {
            //by Default- main page display
            vm.getPeoples();
        };
		//call onLoad() function on page load
        vm.onLoad();

    }
})();