/*
 * Created by weihanqing on 15/9/14.
 * Updated by chenzhuo04 on 16/1/25
 */
define(
    [
        'jquery',
        'angular',
        'moment',
        'raven',
        'public/noah/src/mods/validator-rules/validator-rules',
        'angular-resource',
        'angular-http-loader',
        'angular-dialog-service',
        'angular-bootstrap',
        'es5-shim',
        'ng-table',
        'public/noah/src/widgets/ht-form-validition/src/validator',
        'public/noah/src/widgets/ht-form-validition/src/jquery.validator',
        'public/noah/src/pages/actManagement/models/actStats-model'
    ],
    function ($, angular, moment, validatorRules) {
        angular.module('actList', [
            'ngTable',
            'ngResource',
            'ng.httpLoader',
            'ui.bootstrap',
            'actStatsModel'
        ])
            .config([
                '$httpProvider',
                'httpMethodInterceptorProvider',
                function ($httpProvider, httpMethodInterceptorProvider) {
                    httpMethodInterceptorProvider.whitelistDomain('meituan.com');
                    httpMethodInterceptorProvider.whitelistDomain('sankuai.com');
                    httpMethodInterceptorProvider.whitelistDomain('/api/v1/');
                }
            ])
            .controller('listController', [
                '$scope',
                'ngTableParams',
                '$modal',
                'actStatsAPIFactory',
                '$timeout',
                'dialogs',
                function ($scope, TableParams, $modal, actStatsAPIFactory, $timeout, dialogs) {
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

                    actStatsAPIFactory.searchAct({id: window.actId}).then(function () {
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
                }
            ]);
        return {
            init: function () {
                angular.bootstrap(document, ['actList']);
            }
        };
    }
);
