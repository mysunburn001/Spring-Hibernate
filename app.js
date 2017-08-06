
angular.module('starter', ['ionic', 'starter.controllers','ngCordova'])

.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {

        swal({   
          title: "Error",
          text: "Su dispositivo no esta conectado a internet." ,   
          type: "error",   
          showCancelButton: false,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "OK",   
          cancelButtonText: "No, Cancelar",   
          closeOnConfirm: false,   
          closeOnCancel: true 
        },function(isConfirm){  
            if (isConfirm) {

              var isAndroid = ionic.Platform.isAndroid();
              var isIOS = ionic.Platform.isIOS();

              if (isAndroid==true) {
                ionic.Platform.exitApp();
              }else if(isIOS==true){
                $("#botonlogin").attr('disabled',true);

              }
                
            } 
        });
      }
    }

    document.addEventListener("pause", function() {

      setTimeout(function(){ 
        $.ajax({
          url: serverbaseurl+"index.php/Session/logout",
          type:'GET',
          crossDomain: true,
          async: true,
          success:function(datos){
            ionic.Platform.exitApp(); // stops the app
          },error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
          }
        });
      }, 60000);
    }, false);
  
    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token){
      console.log("Token:",token.token);
      push.saveToken(token);
    });

    document.addEventListener("deviceready", function(){

      /*var networkState = navigator.network.connection.type;

      var states = {};
      states[Connection.UNKNOWN]  = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI]     = 'WiFi connection';
      states[Connection.CELL_2G]  = 'Cell 2G connection';
      states[Connection.CELL_3G]  = 'Cell 3G connection';
      states[Connection.CELL_4G]  = 'Cell 4G connection';
      states[Connection.NONE]     = 'No network connection';

      alert('Connection type: ' + states[networkState]);*/
     
      FingerprintAuth.isAvailable(isAvailableSuccess, isAvailableError);

      function isAvailableSuccess(result) {

          if (result.isAvailable) {
              var encryptConfig = {}; // See config object for required parameters
              FingerprintAuth.encrypt(encryptConfig, encryptSuccessCallback, encryptErrorCallback);
          }
      }

      function isAvailableError(message) {
          swal("Error","Ha ocurrido un error intentelo de nuevo","error");
      }

      var encryptConfig = {
        clientId: "myAppName",
        username: "currentUser",
        password: "currentUserPassword",
        locale: "es"
      };


      FingerprintAuth.encrypt(encryptConfig, successCallback, errorCallback);

      function successCallback(result) {
  
          if (result.withFingerprint) {
              $state.go('app.calendario');
              
          } else if (result.withBackup) {
              $state.go('app.calendario');
          }
      }

      function errorCallback(error) {
          if (error === "Cancelled") {
              //alert("FingerprintAuth Dialog Cancelled!");
          } else {
              //swal("Error","Su dispositivo no cuenta con sensor de huellas digitales y/o no soporta esta caracteristica","error");
          }
      }

    }, false);

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    cache: false,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('login',{
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

  .state('app.calendario', {
    url: '/calendario',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendario.html',
        controller: 'CalendarioCtrl'
      }
    }
  })

  .state('app.laboratorio', {
      url: '/laboratorio',
      views: {
        'menuContent': {
          templateUrl: 'templates/laboratorio.html',
          controller: 'LaboratorioCtrl'
        }
      }
    })
    .state('app.material', {
      url: '/material',
      views: {
        'menuContent': {
          templateUrl: 'templates/material.html',
          controller: 'MaterialCtrl'
        }
      }
    })

  .state('app.inventario', {
    url: '/inventario',
    views: {
      'menuContent': {
        templateUrl: 'templates/inventario.html',
        controller: 'InventarioCtrl'
      }
    }
  })

  .state('app.reportes', {
    url: '/reportes',
    views: {
      'menuContent': {
        templateUrl: 'templates/reportes.html',
        controller: 'ReportesCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

var localbaseurl = "http://localhost:8080/BACKEND/";
var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

function ReiniciaDia(){
    $("#dia").val("");
  }

function GetHorasDisponibles(){

var lab = $("#txtLaboratorio").val();
var dia = $("#dia").val();
$("#txtDescripcion option").remove();

if(lab!=""){

  $.ajax({
    url:serverbaseurl+"index.php/Laboratorio/HorasPorDia",
    type:'POST',
    data:{lab:lab,dia:dia},
    crossDomain: true,
    async: true,
    success:function(datos){
        var obj = JSON.parse(datos);
        var arrayhoras = ['7a-8a','8a-9a','9a-10a','10a-11a','11a-12p','12p-1p','1p-2p','2p-3p','3p-4p','4p-5p','5p-6p','6p-7p','7p-8p'];
           
        for (var i = 0; i < obj.length; i++) {
        
            var horas = obj[i].duracion;

            for (var k = 0; k < arrayhoras.length; k++) {

                var definido = arrayhoras[k];

                if (horas == definido) {
                    var index = arrayhoras.indexOf(definido);
                    arrayhoras.splice(index,1);
                }
            }

        }

        for (var j = 0; j < arrayhoras.length; j++) {

            final = arrayhoras[j];
           
            if(final == '7a-8a'){
                $("#txtDescripcion").append('<option value="7a-8a">7:00 a.m. - 8:00 a.m.');
            }
            if(final == '8a-9a'){
                $("#txtDescripcion").append('<option value="8a-9a">8:00 a.m. - 9:00 a.m.');
            }
            if(final == '9a-10a'){
                $("#txtDescripcion").append('<option value="9a-10a">9:00 a.m. - 10:00 a.m.');
            }
            if(final == '10a-11a'){
                $("#txtDescripcion").append('<option value="10a-11a">10:00 a.m. - 11:00 a.m.');
            }
            if(final == '11a-12p'){
                $("#txtDescripcion").append('<option value="11a-12p">11:00 a.m. - 12:00 p.m.');
            }
            if(final == '12p-1p'){
                $("#txtDescripcion").append('<option value="12p-1p">12:00 p.m. - 1:00 p.m.');
            }
            if(final == '1p-2p'){
                $("#txtDescripcion").append('<option value="1p-2p">1:00 p.m. - 2:00 p.m.');
            }
            if(final == '2p-3p'){
                $("#txtDescripcion").append('<option value="2p-3p">2:00 p.m. - 3:00 p.m.');
            }
            if(final == '3p-4p'){
                $("#txtDescripcion").append('<option value="3p-4p">3:00 p.m. - 4:00 p.m.');
            }
            if(final == '4p-5p'){
                $("#txtDescripcion").append('<option value="4p-5p">4:00 p.m. - 5:00 p.m.');
            }
            if(final == '5p-6p'){
                $("#txtDescripcion").append('<option value="5p-6p">5:00 p.m. - 6:00 p.m.');
            }
            if(final == '6p-7p'){
                $("#txtDescripcion").append('<option value="6p-7p">6:00 p.m. - 7:00 p.m.');
            }
            if(final == '7p-8p'){
                $("#txtDescripcion").append('<option value="7p-8p">7:00 p.m. - 8:30 p.m.');
            }  
        }
    },error:function(){
          swal("Error","Ha ocurrido un error intentelo de nuevo","error");
      }
    }); 

  }else{
      swal("Error","Para continuar debe seleccionar un laboratorio","error");
      $("#dia").val('');
  }
}

function MuestraCantidad(){
  
  var data=[];
  var $el=$("#txtDescripciones");
  $el.find('option:selected').each(function(){
  data.push($(this).val());
  });

  $("#numeros").empty();

  $.ajax({
      url: serverbaseurl+"index.php/Materiales/Cantidad",
      type: "POST",
      data: {data:data},
      crossDomain: true,
      async: true,
      success: function(datos) {
          var obj = JSON.parse(datos);
          

          for (var i = 0; i < data.length; i++) {
              var largo = obj[i].cantidad;

              $("#numeros").append('<label value="'+largo+'">Cantidad: '+' '+data[i]+' en inventario '+largo+'</label>\n');

          }
      },
      error:function(){
          swal("Error","Ha ocurrido un error intentelo de nuevo","error");
      }
  });  
}
