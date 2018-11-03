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
  this.isAdmin = false;

  //---------Functions---------//

  //Function changes which section is currently being displayed
  //Function has been updated to clear out input boxes upon page change
  this.changeInclude = (path) => {
    this.clearRegInputs();
    this.includePath = 'partials/' + path + '.html';
  }

  //Function clears out the input boxes and returns the user to the 'home' section
  this.cancelCreateUser = () => {
    controller.clearRegInputs();
    controller.changeInclude('home');
  }

  //Function clears out the input boxes
  this.clearRegInputs = () => {
    controller.regUsername = "";
    controller.regPassword = "";
    controller.regAvatar = "";
  }

  //Function calls the back end to create a new user
  //Function then automatically logs the user in
  this.createUser = () => {
    // console.log("Creating user");
    if(this.regAvatar === ""){
      this.regAvatar = "https://publicdomainvectors.org/tn_img/1466989605.png";
    }
    $http({
      method: "POST",
      url: "/users",
      data: {
        username: this.regUsername,
        password: this.regPassword,
        avatar: this.regAvatar,
        admin: false
      }
    }).then(function(response){
      console.log("User Created");
      // console.log(response);
      controller.logIn();
    }, function(){
      console.log("Error Creating User");
    })
  }//end of create user

  //Function logs in the user by creating a session
  this.logIn = function(){
    $http({
      method: "POST",
      url: "/sessions",
      data: {
        username: this.regUsername,
        password: this.regPassword
      }
    }).then(function(response){
      console.log(response);
      controller.loggedIn = true;
      controller.getUser();
      controller.changeInclude('home');
    }, function(error) {
      console.log("Error Logging In");
      console.log(error);
    })
  }

  //Function pulls the user information from the backend framework to store in the frontend framework
  this.getUser = () => {
    $http({
      method: "GET",
      url: "/log"
    }).then( (response) => {
      //Save the user onto the controller
      controller.user = response.data
      controller.isAdmin = response.data.admin;
      console.log("Logging user in......");
      // console.log(response.data);
    }, (err) => {
      console.log("Error getting user");
    });
  };

  //Function destorys the current session and logs the user out
  this.logOut = () => {
    $http({
      method: "DELETE",
      url: "/sessions"
    }).then( (response) => {
      console.log(response);
      controller.loggedIn = false;
      controller.isAdmin = false;
      controller.changeInclude('home');
    }, (error) => {
      console.log("Failed to log user out");
    })
  }

}])
