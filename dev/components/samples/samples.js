
app.component('samples', {
    templateUrl: '/components/samples/samples.html',
    controller: ['$scope', '$interval', '$stateParams', '$timeout',
        function($scope, $interval, $stateParams, $timeout){
            var self = this;

            $scope.sample = {};
            $scope.sectionName = $stateParams.sectionName;
            $scope.isAnimating = false;



            /*
            * Entrance Related
            * */
            $scope.show = true;
            $scope.entranceDisabled = true;

            $scope.startEntrance = function(){
                $scope.entranceDisabled = false;
                $scope.isAnimating = true;
                $scope.show = false;
                $timeout(function(){
                    $scope.show = true;
                    $timeout(function(){
                        $scope.show = false;
                        $timeout(function(){
                            $scope.show = true;
                            $timeout(function(){
                                $scope.show = false;
                                $timeout(function(){
                                    $scope.show = true;
                                    $timeout(function(){
                                        $scope.entranceDisabled = true;
                                        $scope.isAnimating = false;
                                    }, self.absoluteAnimationDuration('in'));
                                }, self.absoluteAnimationDuration('out'));
                            }, self.absoluteAnimationDuration('in'));
                        }, self.absoluteAnimationDuration('out'));
                    }, self.absoluteAnimationDuration('in'));
                }, self.absoluteAnimationDuration('out'));
            };

            $scope.isDisabled = function(){
                if($scope.sample.animation.entrance.in.prefix.length && $scope.sample.animation.entrance.out.prefix.length){
                    return false;
                }else{
                    return true;
                }
            };






            /*
             * Static Related
             * */
            $scope.staticAnimate = true;
            $scope.staticIn = '';

            $scope.startStatic = function(){
                $scope.sample.animation.static.prefix = $scope.staticIn;
                $scope.staticAnimate = true;
                $scope.isAnimating = true;
            };

            $scope.stopStatic = function(){
                $scope.staticAnimate = false;
                $scope.isAnimating = false;
            };

            self.absoluteAnimationDuration = function(prefix){
                return $scope.sample.animation.entrance[prefix].duration * 100;
            };



            $scope.$watch('sample', function(newSample, previousSample) {
                if(newSample != undefined){
                    self.handleSampleChange(newSample, $scope.sectionName);
                }
            }, true);





            /*
            * Change Handler
            * */

            self.handleSampleChange = function(sample, section){
                self.setDefaults();
                $scope.sample.animation = sample.animation;
            };






            /*
            * Set Defaults
            * */
            self.setDefaults = function(){
                $scope.sample = {
                    animation: {
                        auto: {
                            prefix: '',
                            duration: 10,
                            iterationCount: 1
                        },
                        entrance: {
                            in: {
                                prefix: '',
                                duration: 10,
                            },
                            out: {
                                prefix: '',
                                duration: 8,
                            }
                        },
                        static: {
                            prefix: '',
                            duration: 10,
                            iterationCount: 'infinite'
                        }
                    },

                    animationList: {
                        'entrances': [
                            'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp',
                            'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight',
                            'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'flipInX', 'flipInY',
                            'lightSpeedIn', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft',
                            'rotateInUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
                            'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'rollIn'],
                        'exits': [
                            'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp',
                            'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight',
                            'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flipOutX', 'flipOutY',
                            'lightSpeedOut', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft',
                            'rotateOutUpRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight',
                            'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'rollOut'],
                        'statics': [
                            'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'flip']
                    }

                };
            };




            /*
            * Init
            * */

            self.setDefaults();

            hljs.initHighlightingOnLoad();


        }]
});
