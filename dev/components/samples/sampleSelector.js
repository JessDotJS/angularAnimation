
app.component('sampleSelector', {
    templateUrl: '/components/samples/sampleSelector.html',
    controller: ['$scope', '$timeout', '$interval', '$state',
        function($scope, $timeout, $interval, $state){
            var self = this;
            $scope.inOutShow = true;
            $scope.staticTrigger = true;

            var intervalIterationCount = 0;



            $scope.loadSection = function(section){
                $state.go('samples.section', {sectionName: section});
            };


            /*
            * Init InOut
            * */
            $interval(function(){
                $scope.inOutShow = !$scope.inOutShow;

                intervalIterationCount += 1;
            }, 2000);


        }]
});
