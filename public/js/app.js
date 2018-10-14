const app = angular.module("Css2Go_App", []);

app.controller("MainController", ['$http', function($http){

  //Variables
  const controller = this;
  this.includePath = 'partials/home.html';

  //Functions
  this.changeInclude = (path) => {
    this.includePath = 'partials/' + path + '.html';
  }

  
}])
