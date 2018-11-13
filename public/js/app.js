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
  this.toggleEditUserInputs = false;

  //Sites information
  this.sites = [];
  this.postDescription = "";
  this.editPostDescription = "";
  this.selectedPost = {};
  this.toggleCommentBox = false;
  this.toggleSubmitCommentBox = false;
  this.postComment = "";

  //---------Functions---------//

  //Function clears the input boxes for creating a new post
  this.clearPostInputs = () => {
    this.postTitle = "";
    this.postAddress = "";
    this.postImage = "";
    this.postDescription = "";
    this.postReadme = "";
    this.postComment = "";
  }

  //Function clears out the input boxes
  this.clearRegInputs = () => {
    controller.regUsername = "";
    controller.regPassword = "";
    controller.regAvatar = "";
  }

  //Function changes which section is currently being displayed
  //Function has been updated to clear out input boxes upon page change
  this.changeInclude = (path) => {
    this.clearRegInputs();
    this.clearPostInputs();
    this.toggleCommentBox = false;
    this.toggleSubmitCommentBox = false;
    this.includePath = 'partials/' + path + '.html';
  }

  //Function is used to toggle the edit fields on the user show page
  this.toggleEditUser = () => {
    this.toggleEditUserInputs = !this.toggleEditUserInputs;
  }

  //Function clears out the input boxes and returns the user to the 'home' section
  this.cancelCreateUser = () => {
    controller.clearRegInputs();
    controller.changeInclude('home');
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
      // console.log(response);
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
      controller.editUsername = response.data.username;
      controller.editAvatar = response.data.avatar;
      // console.log("Logging user in......");
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
      // console.log(response);
      controller.loggedIn = false;
      controller.isAdmin = false;
      controller.user = null;
      controller.changeInclude('home');
    }, (error) => {
      console.log("Failed to log user out");
    })
  }

  //Function is used to edit user information (username and avatar).
  //If the user does not provide a input for their avatar, they are given a default one
  //User information is then updated in the database
  //The user is then logged off to ensure that the data refreshes correctly
  this.editUser = () => {
    if(this.editAvatar === ""){
      this.editAvatar = "https://publicdomainvectors.org/tn_img/1466989605.png";
    }
    // console.log(this.user);
    $http({
      method: "PUT",
      url: "/users/" + this.user._id,
      data: {
        username: controller.editUsername,
        avatar: controller.editAvatar
      }
    }).then(function(response){
      // console.log("User Updated");
      // console.log(response);
      controller.logOut();
    }, function(){
      console.log("Error Updating User");
    })
  }

  //Function is used to load the saved sites from the backend
  this.getSites = () => {
    $http({
      method: "GET",
      url: "/sites"
    }).then( (response) => {
      controller.sites = response.data;
    }, (error) => {
      console.log("Error loading Sites");
    })
  }

  //Function is used to cancel creating a new post
  this.cancelCreatePost = () => {
    // console.log("You canceled the post");
    this.clearPostInputs();
    this.changeInclude("postList");
  }

  //Function is used to create a new post
  this.createPost = () => {
    $http({
      method: "POST",
      url: "/sites",
      data:
      {
        title: this.postTitle,
        description: this.postDescription,
        address: this.postAddress,
        image: this.postImage,
        readme: this.postReadme
      }
    }).then( (response) => {
      // console.log("Created new post!");
      // console.log(response);
      controller.getSites();
      controller.cancelCreatePost();
    }, (error) => {
      console.log("Error creating post");
    })
  }

  //Function changes the view from the postList page to the postShow page
  //Function is used to select a post from the postList page
  //Function then preloads the edit post fields from the selected post
  this.selectPost = (selectedSite) => {
    this.selectedPost = selectedSite;
    this.editPostTitle = selectedSite.title;
    this.editPostAddress = selectedSite.address;
    this.editPostImage = selectedSite.image;
    this.editPostDescription = selectedSite.description;
    this.editPostReadme = selectedSite.readme;
    this.changeInclude("postShow");
    // console.log("Selected Site!");
    // console.log(selectedSite);
  }

  //Function is used to delete a site from the database
  //Only users with ADMIN can delete posts
  this.deleteSite = () => {
    // console.log(this.selectedPost._id);
    $http({
      method: "DELETE",
      url: "/sites/" + this.selectedPost._id
    }).then( (response) => {
      console.log("Post Deleted");
      controller.getSites();
      controller.changeInclude("postList");
    }, (error) => {
      console.log("Error deleting post");
    })
  }

  //Function is used to switch the page from the postShow page to the postEdit page
  this.editSite = () => {
    this.changeInclude("editPost");
  }

  //Function is used to update a site in the backend
  //Function then redirects user to the postShow page to reload everything properly
  this.editPost = () => {
    $http({
      method: "PUT",
      url: "/sites/" + this.selectedPost._id,
      data:
      {
        title: this.editPostTitle,
        address: this.editPostAddress,
        image: this.editPostImage,
        description: this.editPostDescription,
        readme: this.editPostReadme,
        comments: this.selectedPost.comments
      }
    }).then( (response) => {
      // console.log("Post Editted");
      controller.getSites();
      controller.changeInclude("postList");
    }, (error) => {
      console.log("Error editing Post");
    })
  }

  //Function is used to cancel editing a post and redirects the user back to the postShow page
  this.cancelEditPost = () => {
    this.changeInclude("postShow");
  }

  //Function is used to seed a user into the database
  this.seedUser = () => {
    console.log("Seeding User");
    $http({
      method: "POST",
      url: "/users",
      data: {
        username: "zzt",
        password: "123",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUZaa8EZtWOUQhXMOF7GHo00FXFHUJy-p-_SGreS2Or0BiOf_f",
        admin: true
      }
    }).then(function(response){
      console.log("User Seeded");
      // console.log(response);
    }, function(){
      console.log("Error Creating User");
    })
  }

  //Function is used to seed a post into the database
  this.seedPost = () => {
    console.log("Seeding Post");
    $http({
      method: "POST",
      url: "/sites",
      data:
      {
        title: "Test Post",
        description: "Initial Post",
        address: "http://www.google.com",
        image: "https://beta-static.photobucket.com/images/vv181/johnzxcvbnm/0/6a73a449-4712-467f-882b-a2271e4eb6b1-original.png?width=1920&height=1080&fit=bounds"
      }
    }).then( (response) => {
      console.log("Post Seeded");
    }, (error) => {
      console.log("Error creating post");
    })
  }

  //Adds basic seed data to prevent possible errors
  this.seedData = () => {
    this.seedUser();
    this.seedPost();
  }

  //Function toggles whether comments are displayed or not
  this.openComment = () => {
    this.toggleCommentBox = !this.toggleCommentBox;
  }

  //Function toggles the add comment fields
  this.openSubmitComment = () => {
    if(this.toggleCommentBox){
      this.postComment = "";
      this.toggleSubmitCommentBox = !this.toggleSubmitCommentBox;
    }
  }

  //Function is used to add a comment to the selected post
  //Function creates a new comment object then updates it in the selectedPost
  //SelectedPost is then updated in the backend
  this.submitComment = () => {
    //Pull data from the comment and create a new comment object
    newComment =
    {
      userId: this.user._id,
      userAvatar: this.user.avatar,
      username: this.user.username,
      comment: this.postComment
    }

    this.selectedPost.comments.push(newComment);
    // console.log(newComment);
    $http({
      method: "PUT",
      url: "/sites/" + this.selectedPost._id,
      data:
      {
        title: this.selectedPost.title,
        description: this.selectedPost.description,
        address: this.selectedPost.address,
        image: this.selectedPost.image,
        readme: this.selectedPost.readme,
        comments: this.selectedPost.comments
      }
    }).then( (response) => {
      // console.log("Comment Added");
      controller.postComment = "";
      controller.openSubmitComment();
    }, (error) => {
      console.log("Error adding comment");
    })
  }

  //Function is used to update a comment
  this.editComment = (index) => {
    console.log("Editing Comment at " + index);
  }

  //Function is used to delete a comment from a post
  //Only the users who own the comment or an admin can delete a comment
  //Function updates selectedPost which is then updated in the back end
  this.deleteComment = (index) => {
    // console.log("Deleting Comment at " + index);
    this.selectedPost.comments.splice(index, 1);
    $http({
      method: "PUT",
      url: "/sites/" + this.selectedPost._id,
      data:
      {
        title: this.selectedPost.title,
        description: this.selectedPost.description,
        address: this.selectedPost.address,
        image: this.selectedPost.image,
        readme: this.selectedPost.readme,
        comments: this.selectedPost.comments
      }
    }).then( (response) => {
      // console.log("Comment Deleted");
    }, (error) => {
      console.log("Error deleting comment");
    })
  }

  //Initial call to load all the sites from the database
  this.getSites();

}])
