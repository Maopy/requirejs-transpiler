import $ from "jquery";
import angular from "angular";
import moment from "moment";
import "raven";
import validatorRules from "public/noah/src/mods/validator-rules/validator-rules";
import "angular-resource";
import "angular-http-loader";
import "angular-dialog-service";
import "angular-bootstrap";
import "es5-shim";
import "ng-table";
import "public/noah/src/widgets/ht-form-validition/src/validator";
import "public/noah/src/widgets/ht-form-validition/src/jquery.validator";
import "public/noah/src/pages/actManagement/models/actStats-model";

angular.module('actList', ['ngTable', 'ngResource', 'ng.httpLoader', 'ui.bootstrap', 'actStatsModel']).config(['$httpProvider', 'httpMethodInterceptorProvider', function ($httpProvider, httpMethodInterceptorProvider) {
  httpMethodInterceptorProvider.whitelistDomain('meituan.com');
  httpMethodInterceptorProvider.whitelistDomain('sankuai.com');
  httpMethodInterceptorProvider.whitelistDomain('/api/v1/');
}]).controller('listController', ['$scope', 'ngTableParams', '$modal', 'actStatsAPIFactory', '$timeout', 'dialogs', function ($scope, TableParams, $modal, actStatsAPIFactory, $timeout, dialogs) {
  // 默认值 不传则默认查询全部
  $scope.query = {
    id: window.actId,
    startTime: '',
    endTime: ''
  };
  $scope.$watch('startTime', function (newValue) {
    if (!angular.isUndefined(newValue)) {
      $scope.query.startTime = newValue && moment(newValue).format('YYYYMMDD') || '';
      $scope.searchList();
    }
  }, true);
  $scope.$watch('endTime', function (newValue) {
    if (!angular.isUndefined(newValue)) {
      $scope.query.endTime = newValue && moment(newValue).format('YYYYMMDD') || '';
      $scope.searchList();
    }
  }, true);

  actStatsAPIFactory.searchAct({ id: window.actId }).then(function () {
    $scope.actInfo = actStatsAPIFactory.actBaseInfo;
  });

  $scope.tableParams = new TableParams({
    page: 1,
    count: 10
  }, {
    counts: [10, 20, 30, 50],
    data: actStatsAPIFactory.statsList
  });
  // 200ms内只执行一次
  var timer = null;
  $scope.searchList = function () {
    if (timer) {
      $timeout.cancel(timer);
    }
    timer = $timeout(function () {
      actStatsAPIFactory.getStats($scope.query).then(function () {
        $scope.tableParams.settings({
          data: actStatsAPIFactory.statsList
        });
        $scope.tableParams.page(1);
        $scope.tableParams.reload();
      });
    }, 200);
  };
  $scope.searchList();
  $scope.goBack = function () {
    window.history.back();
  };
}]);
export default {
  init: function () {
    angular.bootstrap(document, ['actList']);
  }
};