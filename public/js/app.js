const app = angular.module("Css2Go_App", []);

app.controller("MainController", ['$http', function($http){

  //-----Variables-----//
  const controller = this;

  //Path used for displaying content
  this.includePath = 'partials/home.html';

  //User information
  this.user = null;
  this.loggedIn = false;

  //Functions
  this.changeInclude = (path) => {
    this.includePath = 'partials/' + path + '.html';
  }

  this.cancelCreateUser = () => {
    controller.regUsername = "";
    controller.regPassword = "";
    controller.regAvatar = "";
    controller.changeInclude('home');
  }


}])
