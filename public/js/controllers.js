'use strict';

angular.module('museum-events')
  .controller('UserController', UserController)
  .controller('EventController', EventController);

UserController.$inject = ['$http', '$state'];
EventController.$inject = ['$http', '$state'];

function UserController($http, $state){
  let self         = this;
  self.addUser     = addUser;
  // holder for newuser params
  self.newUser     = {};
  self.loginUser   = loginUser;
  // holder for login params
  self.userlogin   = {};
  self.getUser     = getUser;
  self.oneUser     = [];
  self.getOneEdit  = getOneEdit;
  self.userEdit    = [];
  self.updateUser  = updateUser;
  self.updatedUser = {};
  self.logoutUser  = logoutUser;
  self.deleteUser  = deleteUser;

  function addUser(){
    $http
      .post('https://kollections.herokuapp.com/user/signup', self.newUser)
      .then(function(res){
        console.log('user saved');
        $state.go('/');
      });
      // reset newUser to empty
      self.newUser = {};
  };

  function loginUser(){
    $http
      .post('https://kollections.herokuapp.com/user/auth', self.userLogin)
      .then(function(res){
        // save token to localStorage
        localStorage.setItem('userToken', res.data.token);
        $state.go('profile');
      });
  };

  function getUser(params){
    $http
      .get('https://kollections.herokuapp.com/user/show/' + params.username)
      .then(function(res){
        self.oneUser = res.data;
      });
  };

  function getOneEdit(params){
    $http
      .get('https://kollections.herokuapp.com/user/show/' + params.username)
      .then(function(res){
        self.userEdit = res.data;
        $state.go('editUser');
      })
  };

  function updateUser(params){
    $http
      .put('https://kollections.herokuapp.com/user/' + params.eventid, self.updatedUser)
      .then(function(res){
        $state.go('/');
      });
      self.updatedUser = {};
  };

  function logoutUser(){
    // remove token from localStorage
    localStorage.removeItem('userToken');
    $state.go('login');
  };

  function deleteUser(user){
    $http
      .delete('https://kollections.herokuapp.com/user/' + user._id)
      .then(function(res){
        $state.go('/');
      });
  };
};

function EventController($http, $state){
  // constructor(public authHttp:AuthHttp) {}
  let self          = this;
  self.getEvents    = getEvents;
  self.all          = [];
  self.addEvent     = addEvent;
  self.newEvent     = {};
  self.getOne       = getOne;
  self.showEvent    = [];
  self.getOneEdit   = getOneEdit;
  self.editEvent    = [];
  // new event params
  self.updateEvent  = updateEvent;
  self.updatedEvent = {};
  self.searchEvent  = searchEvent;
  self.term         = "";
  self.results      = [];
  // updated params
  self.deleteEvent  = deleteEvent;

  getEvents();

  function getEvents(){
    $http
      .get('https://kollections.herokuapp.com/events/showAll')
      .then(function(res){
        self.all = res.data;
      });
  };

  function addEvent(){
    // change tags from string into array of items of lowercase words
    self.newEvent.tags = self.newEvent.tags.toLowerCase().split(', ');

    $http
      .post('https://kollections.herokuapp.com/events/new', self.newEvent)
      .then(function(res){
        getEvents();
        $state.go('/');
      });
      self.newEvent = {};
  };

  function getOne(params){
    $http
      .get('https://kollections.herokuapp.com/events/show/' + params.eventid)
      .then(function(res){
        self.showEvent = res.data;
        $state.go('details');
      })
  };

  function getOneEdit(params){
    $http
      .get('https://kollections.herokuapp.com/events/show/' + params.eventid)
      .then(function(res){
        self.editEvent = res.data;
        $state.go('editEvent');
      })
  };

  function searchEvent(){
    $http
      .get('https://kollections.herokuapp.com/events/search/' + self.term)
      .then(function(res){
        self.results = res.data;
      });
  };

  function updateEvent(params){

    self.updatedEvent.tags = self.updatedEvent.tags.toLowerCase().split(', ');

    $http
      .put('https://kollections.herokuapp.com/events/edit/' + params.eventid, self.updatedEvent)
      .then(function(res){
        getEvents();
        $state.go('/');
      });
      self.updatedEvent = {};
  };

  function deleteEvent(event){
    $http
      .delete('https://kollections.herokuapp.com/events/edit' + event._id)
      .then(function(res){
        getEvents();
      });
  };
};
