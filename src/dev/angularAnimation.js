/**
 * Created by Computadora on 01-01-2017
 */

var animationModule = angular.module('angularAnimation', []);
animationModule.directive('animation',
    ['$timeout', 'AnimationService',
        function($timeout, AnimationService){
            return {
                restrict: 'A',
                scope: {
                    /*
                     * Type - Required
                     * 'auto', 'entrance' or 'static'
                     * */
                    type: '=?animation',

                    /*
                     * Type - Optional
                     * Bool
                     * */
                    animationDisabled: '=?', //Default = false

                    /*
                     * Type - Optional
                     * Adds event listeners to the DOM Element which allows you to modify any property within
                     * the animation
                     * */
                    dynamic: '=?', //Default = false

                    /*
                     * Trigger - Optional
                     * Usage: entrance & static
                     * Note: If no trigger is specified Angular Animate will automatically handle the animations.
                     * */
                    trigger: '=?', //Default = undefined || null
                    triggerType: '=?', //Default = 'default'

                    /*
                     * In Animation - Required
                     * Note: The duration & delay are measured in milliseconds, in angular-animation,
                     * 1 = 100ms and the limit is 20000ms.
                     * Note: the iterationCount cannot be 0 and should not exceed 20 iterations. In case this kind of
                     * behavior is required, consider using in-iteration-count='infinite' and set the trigger to false
                     * whenever it needs to be stopped
                     * */
                    in: '=?', //Required
                    inDuration: '=?', //Default = 10
                    inDelay: '=?', //Default = 0 - Currently Disabled
                    inIterationCount: '=?', //Default = 1


                    /*
                     * Out Animation - Optional
                     * Note: The duration & delay are measured in milliseconds, in angular-animation,
                     * 1 = 100ms and the limit is 20000ms.
                     * Note: the iterationCount cannot be 0 and should not exceed 20 iterations. In case this kind of
                     * behavior is required, consider using in-iteration-count='infinite' and set the trigger to false whenever
                     * it needs to be stopped
                     * */
                    out: '=?', //Default = 'fadeOut'
                    outDuration: '=?', //Default = 8
                    outDelay: '=?', //Default = 0 - Currently Disabled
                    outIterationCount: '=?' //Default = 1
                },
                link: function(scope, element, attrs) {
                    var self = this;

                    /*
                     * Animation Instance Creation
                     * */

                    self.buildAnimationObject = function(){
                        self.animationObject = {
                            //Directive Params
                            scope: scope,
                            element: element,

                            //Animation Params
                            type: scope.type,
                            dynamic: scope.dynamic,
                            trigger: scope.trigger,
                            triggerType: scope.triggerType,
                            in: scope.in,
                            inDuration: scope.inDuration,
                            inDelay: scope.inDelay,
                            inIterationCount: scope.inIterationCount,
                            out: scope.out,
                            outDuration: scope.outDuration,
                            outDelay: scope.outDelay,
                            outIterationCount: scope.outIterationCount
                        };
                    };



                    scope.$watch('animationDisabled', angular.bind(this, function(newValue, oldValue) {
                        if(newValue == undefined || newValue == null || newValue == false){
                            self.buildAnimationObject();
                            self.animationService = new AnimationService(self.animationObject);
                            self.animationService.initialize();
                        }else{
                            if(!newValue){
                                self.buildAnimationObject();
                                self.animationService = new AnimationService(self.animationObject);
                                self.animationService.initialize();
                            }
                        }
                    }), true);
                }
            }
        }]).factory('AnimationService',
    ['$timeout', '$q', '$rootScope',
        function($timeout, $q, $rootScope){

            /*
             * Initializers
             * */

            var AnimationService = function(animationConfig) {
                //Directive Params Related
                this.parentScope = animationConfig.scope;
                this.element = animationConfig.element;

                //Animation type Related
                this.type = animationConfig.type;
                this.dynamic = animationConfig.dynamic || false;

                //Trigger Related
                if(animationConfig.trigger == undefined || animationConfig.trigger == null){
                    this.hasTrigger = false;
                }else{
                    this.trigger = animationConfig.trigger;
                    this.hasTrigger = true;
                }
                this.triggerType = animationConfig.triggerType || 'default';

                //In & Out Related
                this.in = animationConfig.in;
                this.inDuration = animationConfig.inDuration || 10;
                this.inDelay = 0; //this.inDelay = animationConfig.inDelay || 0;
                this.inIterationCount = animationConfig.inIterationCount || 1;
                this.out = animationConfig.out || 'fadeOut';
                this.outDuration = animationConfig.outDuration || 8;
                this.outDelay = 0; //this.outDelay = animationConfig.outDelay || 0;
                this.outIterationCount = animationConfig.outIterationCount || 1;

                //Animation Progress Related
                this.itemDisplayed = false;
                this.animationFinished = false;
                this.itemAnimating = false;
            };


            AnimationService.prototype.initialize = function(){
                if(this.hasTrigger){
                    this.subscribeTrigger();
                }
                if(this.dynamic){
                    this.subscribeInAnimation();
                    this.subscribeOutAnimation();
                    this.subscribeStaticAnimation();
                }
                switch(this.type){
                    case 'auto':
                        if(this.itemDisplayed){
                            console.log('Err: Auto with itemDisplayed in Initialize. Note: Auto does not allow trigger. Use "entrance" instead.');
                        }else{
                            this.itemIn();
                        }
                        break;
                    case 'entrance':
                        if(this.hasTrigger){

                        }else{
                            this.itemIn();
                        }
                        break;
                    case 'static':
                        this.itemIn();
                        break;
                    default:
                        break;
                }
            };


            /*
             * Item Handlers (In & Out)
             * */

            AnimationService.prototype.itemIn = function(){
                var deferred = $q.defer();
                this.animationFinished = false;
                this.itemAnimating = true;
                this.element
                    .removeClass(this.buildCssClasses('out') + ' ' + this.in + '-passive visibility-hidden')
                    .addClass(this.buildCssClasses('in') + ' ' + this.out + '-passive');
                $timeout(angular.bind(this, function(){
                    this.animationFinished = true;
                    this.itemAnimating = false;
                    this.itemDisplayed = true;
                    deferred.resolve(true);
                }), this.absoluteDuration('in'));
                return deferred.promise;
            };

            AnimationService.prototype.itemOut = function(){
                var deferred = $q.defer();
                this.animationFinished = false;
                this.itemAnimating = true;
                if(this.type == 'static'){
                    this.element.addClass(this.buildCssClasses('in'));
                }else{
                    this.element
                        .removeClass(this.buildCssClasses('in') + ' ' + this.out + '-passive')
                        .addClass(this.buildCssClasses('out') + ' ' + this.in + '-passive');
                }
                $timeout(angular.bind(this, function(){
                    this.animationFinished = true;
                    this.itemAnimating = false;
                    this.itemDisplayed = false;
                    deferred.resolve(true);
                }), this.absoluteDuration('out'));
                return deferred.promise;
            };


            /*
             ** Absolute Duration in Milliseconds
             * */

            AnimationService.prototype.absoluteDuration = function(transitionType){
                var duration = this[transitionType + 'Duration'] * 100;
                var delay = this[transitionType + 'Delay'] * 100;
                var result = (delay + duration) * this[transitionType + 'IterationCount'];
                return result;
            };

            /*
             * CSS Classes Handlers
             * */

            //var transitionType = 'in' || 'out'
            AnimationService.prototype.buildCssClasses = function (transitionType) {
                var classes = '';
                classes += this[transitionType];
                classes += ' duration-' + this[transitionType + 'Duration'];
                classes += ' delay-' + this[transitionType + 'Delay'];
                classes += ' iteration-count-' + this[transitionType + 'IterationCount'];
                classes += ' animated';
                return classes;
            };


            /*
             * Subscribers
             * */


            //Trigger Subscriber
            AnimationService.prototype.subscribeTrigger = function(){
                this.parentScope.$watch('trigger', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.trigger = newValue;
                        if(this.trigger){
                            this.itemIn();
                        }else{
                            if(this.itemDisplayed){
                                this.itemOut();
                            }else{
                                this.element.addClass('visibility-hidden');
                            }
                        }
                    }
                }), true);
            };


            //In Animation Subscriber
            AnimationService.prototype.subscribeInAnimation = function() {
                this.parentScope.$watch('in', angular.bind(this, function (newValue, oldValue) {
                    if (newValue != undefined) {
                        this.in = newValue;
                        this.element.removeClass(oldValue + ' ' + newValue + '-passive')
                            .addClass(newValue + ' ' + newValue + '-passive');
                    }
                }), true);
                this.parentScope.$watch('inDuration', angular.bind(this, function (newValue, oldValue) {
                    if (newValue != undefined) {
                        this.inDuration = newValue;
                        this.element.removeClass('duration-' + oldValue)
                            .addClass('duration-' + newValue);
                    }
                }), true);
                this.parentScope.$watch('inDelay', angular.bind(this, function (newValue, oldValue) {
                    if (newValue != undefined) {
                        this.inDelay = newValue;
                        this.element.removeClass('delay-' + oldValue)
                            .addClass('delay-' + newValue);
                    }
                }), true);

                this.parentScope.$watch('inIterationCount', angular.bind(this, function (newValue, oldValue) {
                    if (newValue != undefined) {
                        this.inIterationCount = newValue;
                        this.element.removeClass('iteration-count-' + oldValue)
                            .addClass('iteration-count-' + newValue);
                    }
                }), true);
            };

            //Out Animation Subscriber
            AnimationService.prototype.subscribeOutAnimation = function(){
                this.parentScope.$watch('out', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.out = newValue;
                        this.element.removeClass(oldValue + ' ' + newValue + '-passive')
                            .addClass(newValue + ' ' + newValue + '-passive');
                    }
                }), true);
                this.parentScope.$watch('outDuration', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.outDuration = newValue;
                        this.element.removeClass('duration-' + oldValue)
                            .addClass('duration-' + newValue);
                    }
                }), true);
                this.parentScope.$watch('outDelay', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.outDelay = newValue;
                        this.element.removeClass('delay-' + oldValue)
                            .addClass('delay-' + newValue);
                    }
                }), true);

                this.parentScope.$watch('outIterationCount', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.outIterationCount = newValue;
                        this.element.removeClass('iteration-count-' + oldValue)
                            .addClass('iteration-count-' + newValue);
                    }
                }), true);
            };

            //Static Animation Subscriber
            AnimationService.prototype.subscribeStaticAnimation = function(){
                this.parentScope.$watch('static', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.static = newValue;
                        this.element.removeClass(oldValue + ' ' + newValue + '-passive')
                            .addClass(newValue + ' ' + newValue + '-passive');
                    }
                }), true);
                this.parentScope.$watch('staticDuration', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.staticDuration = newValue;
                        this.element.removeClass('duration-' + oldValue)
                            .addClass('duration-' + newValue);
                    }
                }), true);
                this.parentScope.$watch('staticDelay', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.staticDelay = newValue;
                        this.element.removeClass('delay-' + oldValue)
                            .addClass('delay-' + newValue);
                    }
                }), true);

                this.parentScope.$watch('staticIterationCount', angular.bind(this, function(newValue, oldValue) {
                    if(newValue != undefined){
                        this.staticIterationCount = newValue;
                        this.element.removeClass('iteration-count-' + oldValue)
                            .addClass('iteration-count-' + newValue);
                    }
                }), true);
            };

            return AnimationService;
        }]);