mavikentApp.controller("DeskCtrl", function($scope, $state, $http, $localStorage, $rootScope, $filter) {

    var token = $rootScope.mkb.token;
    $scope.IsEdit = false;
    $scope.listIndex;
    $scope.editId;
    $scope.list = [];
    $scope.offices = [];
    $scope.floors = [];

    function initialize() {
        $scope.office = {
            selected: ""
        };
        $scope.floor = {
            selected: ""
        };

        $scope.obj = {
            name: "",
            floor_id: "",
            room_id: "",
            desk_order: "",
            updated_by: $rootScope.mkb.current_user.name
        };
    }
    initialize();
    //list all office
    $http.get(host + "/api/floor?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.floors = resp.data;

    }).error(function(err) {
        console.error(JSON.stringify(err));
    });
    
    ////////////////////////////
    $http.get(host + "/api/office?token=" + token).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                $scope.offices = resp.data;


            }).error(function(err) {
                console.error(JSON.stringify(err));
            });
    ////////////////////////////
    
    $scope.degKat = function() {
            $scope.offices =[]
            console.log($scope.floor.selected._id);
            $http.get(host + "/api/office/get_by_floor/" + $scope.floor.selected._id + "?token=" + token).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                $scope.offices = resp.data;


            }).error(function(err) {
                console.error(JSON.stringify(err));
            });

        }
        //list all office

    $http.get(host + "/api/desk?token=" + token).success(function(resp) {
        if (resp.status == false) {
            console.log("error : ", JSON.stringify(resp));
            return;
        }
        $scope.list = resp.data;


    }).error(function(err) {
        console.error(JSON.stringify(err));
    });

    //add function
    $scope.save = function() {
        
        $scope.obj.room_id = $scope.office.selected._id;
        $scope.obj.floor_id = $scope.floor.selected._id;
        console.log($scope.obj);
        if ($scope.IsEdit) {
            console.log("here 1");
            $http.put(host + "/api/desk?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                console.log(JSON.stringify(resp.data));
                $scope.IsEdit = false;
                $scope.list[$scope.listIndex] = resp.data;
                initialize();
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });

        } else {
            //console.log(JSON.stringify($scope.obj));
            $http.post(host + "/api/desk?token=" + token, $scope.obj).success(function(resp) {
                if (resp.status == false) {
                    console.log("error : ", JSON.stringify(resp));
                    return;
                }
                $scope.list.push(resp.data);
                initialize();
            }).error(function(err) {
                console.error(JSON.stringify(err));
            });
        }

    }

    //delete function

    $scope.delete = function(id, index) {
        $http.delete(host + "/api/desk/" + id + "?token=" + token).success(function(resp) {
            if (resp.status == false) {
                console.log("error : ", JSON.stringify(resp));
                return;
            }
            $scope.list.splice(index, 1);
        }).error(function(err) {
            console.error(JSON.stringify(err));
        });
    }

    //edit function

    $scope.edit = function(id, index) {
        $scope.IsEdit = true;
        $scope.listIndex = index;
        $scope.editId = id;
        $scope.obj.name = $scope.list[index].name;
        $scope.obj.desk_order = $scope.list[index].desk_order;
        $scope.obj.updated_by = $rootScope.mkb.current_user.name;
        $scope.obj._id = id;
        $scope.office = {
            selected: $filter('getById')($scope.offices, $scope.list[index].room_id._id)
        }
        $scope.floor = {
            selected: $filter('getById')($scope.floors, $scope.list[index].floor_id._id)
        }
        console.log($scope.offices);
    }
});