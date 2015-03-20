
var loadCrawlers = ['$http', '$q', '$route', function($http, $q, $route) {
  var dfd = $q.defer();
  $http.get('/api/1/crawlers').then(function(res) {
    dfd.resolve(res.data);
  });
  return dfd.promise;
}];


var loadUsers = ['$http', '$q', '$route', 'Session', function($http, $q, $route, Session) {
  var dfd = $q.defer();
  Session.get(function(session) {
    $http.get('/api/1/users', {params: {'_uid': session.cbq}}).then(function(res) {
      dfd.resolve(res.data);
    });
  });
  return dfd.promise;
}];


var loadSource = ['$http', '$q', '$route', 'Session', function($http, $q, $route, Session) {
  var dfd = $q.defer(),
      url = '/api/1/sources/' + $route.current.params.slug;
  Session.get(function(session) {
    $http.get(url, {params: {'_uid': session.cbq}}).then(function(res) {
      dfd.resolve(res.data);
    });
  });
  return dfd.promise;
}];


aleph.directive('sourcesFrame', ['$http', 'QueryContext', function($http, QueryContext) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'source': '='
    },
    templateUrl: 'sources_frame.html',
    link: function (scope, element, attrs, model) {
      scope.sources = {};
      QueryContext.get().then(function(data) {
        scope.sources = data.sources;
      });
    }
  };
}]);


aleph.controller('SourcesIndexCtrl', ['$scope', '$location', '$http',
  function($scope, $location, $http) {

}]);


aleph.controller('SourcesEditCtrl', ['$scope', '$location', '$http', '$routeParams', 'Flash',
                                     'Validation', 'QueryContext', 'users', 'crawlers', 'source',
  function($scope, $location, $http, $routeParams, Flash, Validation, QueryContext, users, crawlers, source) {
  
  var apiUrl = '/api/1/sources/' + $routeParams.slug;
  $scope.source = source;
  $scope.users = users;
  $scope.crawlers = crawlers;

  $scope.canSave = function() {
    return $scope.source.can_write;
  };

  $scope.hasUser = function(id) {
    var users = $scope.source.users || [];
    return users.indexOf(id) != -1;
  };

  $scope.toggleUser = function(id) {
    var idx = $scope.source.users.indexOf(id);
    if (idx != -1) {
      $scope.source.users.splice(idx, 1);
    } else {
      $scope.source.users.push(id);
    }
  };

  $scope.save = function(form) {
      var res = $http.post(apiUrl, $scope.source);
      res.success(function(data) {
        QueryContext.reset();
        Flash.message('Your changes have been saved.', 'success');
      });
      res.error(Validation.handle(form));
  };

}]);