// https://cdn.thinglink.me/api/image/RGguko3kKKN56KBMeKEpx4VEMhw2DzZVmZm7wTmAh1BDHLn4P9GKsHuXeF35LWdxmiUfe7fTZCTnXHdBjdA2i598WHwiFfcjvgGo7HJg1NgKMqcAkFxU3jVd9UfcPaW/320/320/scaledown
const app = angular.module("Css2Go_App", []);

app.controller("MainController", ['$http', function($http){

  //-----Variables-----//
  const controller = this;

  //Path used for displaying content
  this.includePath = 'partials/home.html';

  //User information
  this.user = null;
  this.loggedIn = false;

  //---------Functions---------//

  //Function changes which section is currently being displayed
  this.changeInclude = (path) => {
    this.clearRegInputs();
    this.includePath = 'partials/' + path + '.html';
  }

  //Function clears out the input boxes and returns the user to the 'home' section
  this.cancelCreateUser = () => {
    controller.clearRegInputs();
    controller.changeInclude('home');
  }

  this.clearRegInputs = () => {
    controller.regUsername = "";
    controller.regPassword = "";
    controller.regAvatar = "";
  }

  //Function calls the back end to create a new user
  this.createUser = () => {
    // console.log("Creating user");
    $http({
      method: "POST",
      url: "/users",
      data: {
        username: this.regUsername,
        password: this.regPassword,
        avatar: this.regAvatar,
        admin: true
      }
    }).then(function(response){
      console.log(response);
      //Log in User
      //Clear input boxes
      controller.cancelCreateUser();
    }, function(){
      console.log("Error Creating User");
    })
  }//end of create user

  //Function pulls the user information from the backend framework to store in the frontend framework
  this.getUser = () => {
    $http({
      method: "GET",
      url: "/log"
    }).then( (response) => {
      //Save the suer onto the controller
      controller.user = response.data
      console.log("Logging user in......");
      console.log(response.data);
    }, (err) => {
      console.log("Error getting user");
    });
  };

}])
