/**
 * Carousel
 * Created by rahulp<rahul.pal105@outlook.com> on 17-07-2015.
 */

'use strict';

(function (angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            factory(angular);
        });
    } else {
        factory(angular);
    }
})(angular || null, function (angular) {
    'use strict';

    angular.module('rahpal.carousel', []).directive('rpCarousel', function ($templateCache) {

        return {
            restrict: 'EA',
            template: $templateCache.get('carousel-tmpl.html'),
            replace: true,
            scope: {
                options: '='
            },
            controller: ['$scope', '$interval', function ($scope, $interval) {
                $scope.items = null;

                var index = undefined,
                    endIndex = undefined,
                    timer = undefined,
                    objParams = {
                    dir: 'next',
                    currIndex: 0
                },
                    init = function init() {
                    $scope.items = angular.copy($scope.options);
                    // Add "active" prop to each item.
                    angular.forEach($scope.items, function (item, index, array) {
                        item['active'] = false;
                    });
                    // On initialization of the widget
                    $scope.items[objParams.currIndex].active = true;
                    endIndex = $scope.items.length - 1; // ArrayLength - 1
                },
                    changeToPrev = function changeToPrev(params) {
                    if (params.currIndex <= 0) {
                        $scope.items[params.currIndex].active = false;
                        params.currIndex = endIndex;
                        $scope.items[params.currIndex].active = true;
                        return;
                    }
                    $scope.items[params.currIndex].active = false;
                    $scope.items[params.currIndex - 1].active = true;
                    params.currIndex -= 1;
                },
                    changeToNext = function changeToNext(params) {
                    if (params.currIndex >= endIndex) {
                        $scope.items[params.currIndex].active = false;
                        params.currIndex = 0;
                        $scope.items[params.currIndex].active = true;
                        return;
                    }

                    $scope.items[params.currIndex].active = false;
                    $scope.items[params.currIndex + 1].active = true;
                    params.currIndex += 1;
                },
                    resetTimer = function resetTimer(params) {

                    if (angular.isDefined(timer)) {
                        $interval.cancel(timer);
                        timer = undefined;
                    };

                    timer = $interval(function () {
                        switch (params.dir) {
                            case 'prev':
                                changeToPrev(params);
                                break;
                            case 'next':
                                changeToNext(params);
                                break;
                            default:
                                throw new Error('Carousel direction is undefined!!!');
                        }
                    }, 5000);
                },
                    updateCarousel = function updateCarousel(params) {
                    var forFirstTime = arguments[1] === undefined ? false : arguments[1];

                    if (forFirstTime) {
                        $scope.items[objParams.currIndex].active = true;
                        resetTimer(params);
                        return;
                    }

                    // Initialize Carousel
                    switch (params.dir) {
                        case 'prev':
                            changeToPrev(params);
                            break;
                        case 'next':
                            changeToNext(params);
                            break;
                    }

                    resetTimer(params);
                };

                init();

                $scope.prevClick = function () {
                    // Update params
                    objParams.dir = 'prev';
                    updateCarousel(objParams);
                };

                $scope.nextClick = function () {
                    objParams.dir = 'next';
                    updateCarousel(objParams);
                };

                $scope.imageHandler = function (indexer) {
                    $scope.items[objParams.currIndex].active = false;
                    objParams.currIndex = indexer;
                    $scope.items[objParams.currIndex].active = true;
                    // Reset Timer
                    resetTimer(objParams);
                };

                updateCarousel(objParams, true);
            }]
        };
    }).run(['$templateCache', function ($templateCache) {
        $templateCache.put('carousel-tmpl.html', '<section>            <div class="rp-carousel">                <div class="image-handler">                    <a href="javascript:void 0;" ng-repeat="item in items" ng-click="imageHandler($index)"></a>                </div>                <div class="carousel-inner">                <div class="item" ng-animate="\'animate\'" ng-repeat="item in items | filter:{ active: true }">                    <a href="javascript:void 0;">                        <img src={{item.imgUrl}} alt="Image Missing"/>                    </a>            </div>            </div>            <a href="javascript:void 0;" class="left-arrow-carousel handle" ng-click="prevClick()">            <div></div>            <div>            <img src="../images/left-arrow-white.png" alt="left arrow">            </div>            <div></div>            </a>            <a href="javascript:void 0;" class="right-arrow-carousel handle" ng-click="nextClick()">            <div></div>            <div>            <img src="../images/right-arrow-white.png" alt="right arrow">            </div>            <div></div>            </a>            <div class="clearfix"></div>            </div>        </section>');
    }]);
});

//# sourceMappingURL=component-compiled.js.map