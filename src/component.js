/**
 * Carousel
 * Created by rahulp<rahul.pal105@outlook.com> on 17-07-2015.
 */

((angular, factory) => {
    "use strict";

    if(typeof define === 'function' && define.amd){
        define(['angular'], (angular)=>{
            factory(angular);
        });
    }else{
        factory(angular);
    }

})(angular || null, (angular)=>{
    "use strict";

    angular.module('rahpal.carousel', [])
        .directive('rpCarousel', ()=>{

            return{
                restrict: 'EA',
                templateUrl: "http://localhost:63342/drapal-carousel/src/carousel-tmpl.html",
                replace: true,
                scope:{
                    options: '='
                },
                compile: (tElem,attrs)=>{

                    return (scope, elem, attrs)=>{

                    }
                },
                controller: ['$scope', '$interval',($scope, $interval)=>{
                    $scope.items = null;

                    let index,
                        endIndex,
                        timer,
                        objParams = {
                            dir: 'next',
                            currIndex: 0
                        },
                        init = ()=>{
                            $scope.items = angular.copy($scope.options);
                                // Add "active" prop to each item.
                                angular.forEach($scope.items, (item, index, array)=>{
                                    item["active"] = false;
                                });
                                // On initialization of the widget
                                $scope.items[objParams.currIndex].active = true;
                                endIndex = $scope.items.length - 1;  // ArrayLength - 1
                            },
                        changeToPrev = (params)=>{
                            if(params.currIndex <= 0){
                                $scope.items[params.currIndex].active = false;
                                params.currIndex = endIndex;
                                $scope.items[params.currIndex].active = true;
                                return;
                            }
                            $scope.items[params.currIndex].active = false;
                            $scope.items[params.currIndex - 1].active = true;
                            params.currIndex -= 1;
                        },
                        changeToNext = (params)=>{
                            if(params.currIndex >= endIndex){
                                $scope.items[params.currIndex].active = false;
                                params.currIndex = 0;
                                $scope.items[params.currIndex].active = true;
                                return;
                            }

                            $scope.items[params.currIndex].active = false;
                            $scope.items[params.currIndex + 1].active = true;
                            params.currIndex += 1;
                        },
                        updateCarousel = (params)=>{
                            // Initialize Carousel
                            switch (params.dir){
                                case 'prev':
                                    changeToPrev(params);
                                    break;
                                case 'next':
                                    changeToNext(params);
                                    break;
                            }

                            if(angular.isDefined(timer)){
                                $interval.cancel(timer);
                                timer = undefined;
                            };

                            timer = $interval(function(){
                                switch(params.dir){
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
                        };

                    init();

                    $scope.prevClick = ()=>{
                        // Update params
                        objParams.dir = 'prev';
                        updateCarousel(objParams);
                    };

                    $scope.nextClick = ()=>{
                        objParams.dir = 'next';
                        updateCarousel(objParams);
                    };

                    updateCarousel(objParams);
                }]
            }

        })
});