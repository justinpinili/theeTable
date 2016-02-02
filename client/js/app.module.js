angular
  .module('theeTable', [
    'ui.router',
    'theeTable.controllers',
    'LocalStorageModule',
    'theeTable.services',
    'theeTable.directives',
    'ui.bootstrap',
    'ui.sortable',
    'dbaq.emoji',
    'ngSanitize',
    'rzModule',
    'theeTable.routes'
  ]);

angular.module('theeTable.controllers', []);
angular.module('theeTable.services', []);
angular.module('theeTable.directives', []);
