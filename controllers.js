angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state,$ionicHistory,$ionicPlatform) {

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  ionic.Platform.ready(function(){
    
    $.ajax({
      url: serverbaseurl+"index.php/Session/Permisos",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){
        var obj = JSON.parse(datos);

        if ((obj == "SU") || (obj == "A") ) {
          $("#labmenu").remove();
          $("#matmenu").remove();
        }else if( (obj == "N") || (obj == "ND") ){
          $("#reportesmenu").remove();
        } 
      }
    });
  });

  $scope.LogOut = function(){
    $.ajax({
      url: serverbaseurl+"index.php/Session/logout",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){

        var isAndroid = ionic.Platform.isAndroid();
        var isIOS = ionic.Platform.isIOS();
        var currentPlatform = ionic.Platform.platform();

        if (isIOS==true) {
          $state.go("login");
        }else if(isAndroid==true){
          ionic.Platform.exitApp(); // stops the app
        }else if(currentPlatform == 'win32'){
          $state.go("login");
        }
        
        //$ionicHistory.clearCache().then(function(){ $state.go('login');});
      },error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
    });
  }
})

.controller('LoginCtrl', function($scope, $state,$cordovaCamera,$ionicHistory) {
  
  /*$scope.Camaras = function() {
    var options = { 
      quality : 100, 
      destinationType : Camera.DestinationType.DATA_URL, 
      sourceType : Camera.PictureSourceType.CAMERA, 
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
  
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function(err) {
      alert("no se puede tomar foto");
    });
  }*/

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  $scope.user = {};
  $scope.pass = {};

  $scope.LoginSigel = function(){

    var usuario = $scope.user.user;
    var password = $scope.pass.pass;

    if(usuario != undefined && password != undefined){

      $("#preloader").show();

      $.ajax({
        url: serverbaseurl+"index.php/Session/validatelogin",
        type:'POST',
        crossDomain: true,
        timeout: 60000,
        data:{usuario:usuario,password:password},
        async: true,
        success:function(datos){
          var obj = JSON.parse(datos);

          if (obj != "") {

            if (obj == 'OK-') {
              $state.go('app.calendario');
            }else if(obj == "IUOP"){
              $("#preloader").hide();
              swal("Error","Usuario o contraseña incorrecta","error");
            }else if (obj == "UWOA") {
              $("#preloader").hide();
              swal("Error","Usuario sin acceso a esta aplicacion","error");
            }else{
              $("#preloader").hide();
              swal("Error","Usuario ya cuenta con una sesion activa","error");
            }
          }
        },error:function(status){

          if (status.statusText=="timeout") {

            swal({   
              title: "Error",
              text: "Su dispositivo no cuenta con conexion a internet y/o su conexion es demasiado lenta.\n Intentelo de nuevo" ,   
              type: "error",   
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
              closeOnConfirm: true,   
              closeOnCancel: true 
            }, function(isConfirm){  
                if (isConfirm) {
                  $state.go($state.current, {}, {reload: true});

                } 
            });
          }else{
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
          }
  
        }
      });  

    }else{
     
      swal("Cuidado","Aun quedan campos vacios","warning");
    }
  }
})

.controller('CalendarioCtrl', function($scope,$ionicPlatform,$ionicSlideBoxDelegate) {

  $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      swal({   
        title: "Cuidado",
        text: "Esta seguro de salir?." ,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "OK",   
        cancelButtonText: "No, Cancelar",   
        closeOnConfirm: false,   
        closeOnCancel: true 
      }, function(isConfirm){  
          if (isConfirm) {
            $.ajax({
              url: serverbaseurl+"index.php/Session/logout",
              crossDomain: true,
              type:'GET',
              async: true,
              success:function(datos){
                ionic.Platform.exitApp();  
              }
            });
          } 
      });
      
  }, 1000);   

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  ionic.Platform.ready(function(){
    $("#preloadercalendario").hide();

    $.ajax({
      url: serverbaseurl+"index.php/Dashboard/Nombres",
      type:'GET',
      async: true,
      crossDomain: true,
      success:function(datos){
          obj = JSON.parse(datos);

        for (var i = 0; i < obj.length; i++) {
              
          var id = obj[i].id_laboratorio;
          var name = obj[i].nombre;

          $("#lab").append("<option value='"+id+"'>"+name+"</option>");
        }
      },error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
    });

    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  });

  $scope.RellenaHorario = function(){

    var id = $("#lab").val();
    $("#preloadercalendario").show();

    if( id != ""){

      $.ajax({
        url: serverbaseurl+"index.php/Dashboard/InfoCalendario",
        type:'POST',
        crossDomain: true,
        data:{id:id},
        async: true,
        success:function(datos){
          var obj = JSON.parse(datos);

          $("#infohorario").remove();
          $("#infohorariostabla").append("<tbody id='infohorario'></tbody>");

          for (var i = 0; i < obj.length; i++) {

            var docente = obj[i].docente;
            var mat_descripcion = obj[i].mat_descripcion;
            var grupo = obj[i].grupo;
            var fecha = obj[i].fecha_uso;
            

            if (fecha == null) {
                $("#infohorario").append('<tr><td>'+docente+'</td><td>'+mat_descripcion+' ('+grupo+')</td></tr>');
            }else{
                $("#infohorario").append('<tr><td>'+docente+'</td><td>'+mat_descripcion+' (TEMPO)</td></tr>');    
            }
          }
        },error:function(){
          swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
      });

      $.ajax({
        url: serverbaseurl+"index.php/Dashboard/Calendario",
        type:'POST',
        crossDomain: true,
        data:{id:id},
        async: true,
        success:function(datos){
          var obj = JSON.parse(datos);

          if(obj!=""){

            $("#l1").empty();
            $("#l2").empty();
            $("#l3").empty();
            $("#l4").empty();
            $("#l5").empty(); 
            $("#l6").empty();
            $("#l7").empty();
            $("#l8").empty();
            $("#l9").empty();
            $("#l10").empty();
            $("#l11").empty();
            $("#l12").empty();
            $("#l13").empty();

            $("#ma1").empty();
            $("#ma2").empty();
            $("#ma3").empty();
            $("#ma4").empty();
            $("#ma5").empty(); 
            $("#ma6").empty();
            $("#ma7").empty();
            $("#ma8").empty();
            $("#ma9").empty();
            $("#ma10").empty();
            $("#ma11").empty();
            $("#ma12").empty();
            $("#ma13").empty();

            $("#mi1").empty();
            $("#mi2").empty();
            $("#mi3").empty();
            $("#mi4").empty();
            $("#mi5").empty(); 
            $("#mi6").empty();
            $("#mi7").empty();
            $("#mi8").empty();
            $("#mi9").empty();
            $("#mi10").empty();
            $("#mi11").empty();
            $("#mi12").empty();
            $("#mi13").empty();

            $("#j1").empty();
            $("#j2").empty();
            $("#j3").empty();
            $("#j4").empty();
            $("#j5").empty(); 
            $("#j6").empty();
            $("#j7").empty();
            $("#j8").empty();
            $("#j9").empty();
            $("#j10").empty();
            $("#j11").empty();
            $("#j12").empty();
            $("#j13").empty();

            $("#v1").empty();
            $("#v2").empty();
            $("#v3").empty();
            $("#v4").empty();
            $("#v5").empty(); 
            $("#v6").empty();
            $("#v7").empty();
            $("#v8").empty();
            $("#v9").empty();
            $("#v10").empty();
            $("#v11").empty();
            $("#v12").empty();
            $("#v13").empty();

            $("#s1").empty();
            $("#s2").empty();
            $("#s3").empty();
            $("#s4").empty();
            $("#s5").empty(); 
            $("#s6").empty();
            $("#s7").empty();
            $("#s8").empty();
            $("#s9").empty();
            $("#s10").empty();
            $("#s11").empty();
            $("#s12").empty();
            $("#s13").empty();

            for (var i = 0; i < obj.length; i++) {

              var dias = obj[i].fecha;
              var horas = obj[i].duracion;
              var materia = obj[i].materia;
              var grupo = obj[i].grupo;

              switch(dias){
                case 'Lunes':
                  if (horas == '7a-8a') {
                      $("#l1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#l2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#l3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#l4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#l5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#l6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#l7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#l8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#l9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#l10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#l11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#l12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#l13").html(materia+'<br>'+grupo);
                  }
                break;
                case 'Martes':
                  if (horas == '7a-8a') {
                      $("#ma1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#ma2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#ma3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#ma4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#ma5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#ma6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#ma7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#ma8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#ma9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#ma10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#ma11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#ma12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#ma13").html(materia+'<br>'+grupo);
                  }  
                break;
                case 'Miercoles':
                  if (horas == '7a-8a') {
                      $("#mi1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#mi2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#mi3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#mi4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#mi5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#mi6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#mi7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#mi8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#mi9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#mi10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#mi11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#mi12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#mi13").html(materia+'<br>'+grupo);
                  }
                break;
                case 'Jueves':
                  if (horas == '7a-8a') {
                      $("#j1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#j2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#j3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#j4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#j5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#j6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#j7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#j8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#j9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#j10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#j11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#j12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#j13").html(materia+'<br>'+grupo);
                  }
                break;
                case 'Viernes':
                  if (horas == '7a-8a') {
                      $("#v1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#v2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#v3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#v4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#v5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#v6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#v7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#v8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#v9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#v10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#v11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#v12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#v13").html(materia+'<br>'+grupo);
                  }
                break;
                case 'Sabado':
                  if (horas == '7a-8a') {
                      $("#s1").html(materia+'<br>'+grupo);
                  }
                  if (horas == '8a-9a') {
                      $("#s2").html(materia+'<br>'+grupo);
                  }
                  if (horas == '9a-10a') {
                      $("#s3").html(materia+'<br>'+grupo);
                  }
                  if (horas == '10a-11a') {
                      $("#s4").html(materia+'<br>'+grupo);
                  }
                  if (horas == '11a-12p') {
                      $("#s5").html(materia+'<br>'+grupo);
                  }
                  if (horas == '12p-1p') {
                      $("#s6").html(materia+'<br>'+grupo);
                  }
                  if (horas == '1p-2p') {
                      $("#s7").html(materia+'<br>'+grupo);
                  }
                  if (horas == '2p-3p') {
                      $("#s8").html(materia+'<br>'+grupo);
                  }
                  if (horas == '3p-4p') {
                      $("#s9").html(materia+'<br>'+grupo);
                  }
                  if (horas == '4p-5p') {
                      $("#s10").html(materia+'<br>'+grupo);
                  }
                  if (horas == '5p-6p') {
                      $("#s11").html(materia+'<br>'+grupo);
                  }
                  if (horas == '6p-7p') {
                      $("#s12").html(materia+'<br>'+grupo);
                  }
                  if (horas == '7p-8p') {
                      $("#s13").html(materia+'<br>'+grupo);
                  }
                break;
              }
            }
              $ionicSlideBoxDelegate.update();
              $("#preloadercalendario").hide();
              $("#calendario").show(); 

          }else{
              swal("Error","Este laboratorio aun no cuenta con un horario","error");
              $("#preloadercalendario").hide();
              $("#calendario").hide();
          }           
        },error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
        
      });
    }else{
        swal("Cuidado","Aun quedan campos vacios","warning");
        $("#preloadercalendario").hide();
    }
  }
})

.controller('LaboratorioCtrl', function($scope, $stateParams,$state,$ionicHistory,$window,$ionicPlatform) {

  $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      swal({   
        title: "Cuidado",
        text: "Esta seguro de salir?." ,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "OK",   
        cancelButtonText: "No, Cancelar",   
        closeOnConfirm: false,   
        closeOnCancel: true 
      }, function(isConfirm){  
          if (isConfirm) {
            $.ajax({
              url: serverbaseurl+"index.php/Session/logout",
              type:'GET',
              crossDomain: true,
              async: true,
              success:function(datos){
                ionic.Platform.exitApp();  
              }
            });
          } 
      });
      
  }, 1000);  

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  ionic.Platform.ready(function(){

    $("#txtDescripcion").select2();

    $('#fecha').datepicker({
      autoclose: true,
      todayHighlight: true,
      format: 'yyyy/mm/dd'
    });
     
    $('#fecha1').datepicker({
      autoclose: true,
      todayHighlight: true,
      format: 'yyyy/mm/dd'
    });

    $.ajax({
      url: serverbaseurl+"index.php/Laboratorio/GetInfoLabs",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){
        obj = JSON.parse(datos);
        var largo = obj.labs.length;
        var largo1 = obj.res.length;
        var mats = obj.mats;

        $("#matricula").val(mats);
        
        for (var i = 0; i < largo1; i++) {

          var n = obj.res[i].nombre;
          var ap = obj.res[i].ap_paterno;
          var am = obj.res[i].ap_materno;
          var final = n+' '+ap+' '+am;
          $("#persona").val(final);
        }

        for (var j = 0; j < largo; j++) {
          
          var id = obj.labs[j].id_laboratorio;
          var name = obj.labs[j].nombre;
          $("#txtLaboratorio").append("<option value='"+name+"'>"+name+"</option>");
        }
      },error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
    });
  });

  $scope.datoslab = {};

  $scope.AddPrestamoLab = function(){
    
    var matricula = $("#matricula").val();
    var laboratorio = $("#txtLaboratorio").val();
    var asignatura = $("#asignatura").val();
    var grupo = $("#grupo").val();
    var practica = $("#practica").val();
    var dia = $("#dia").val();
    var data=[];
    var $el=$("#txtDescripcion");
    $el.find('option:selected').each(function(){
    data.push($(this).val());
    });
    var id = $("#id").val();
    var fecha = $("#fecha").val();
    var fecha1 = $("#fecha1").val();
    var admin = $("#persona").val();
    var notificacion = '1';
    
    if ((matricula != "")  && (laboratorio != "") && (asignatura != "") && (grupo != "") && (practica != "") && (dia != "") && (data != "") && (id != "") && (fecha != "") && (fecha1 != "") && (admin != "")){

      $.ajax({
        url:serverbaseurl+"index.php/Laboratorio/GuardaPrestamoLab",
        type:'POST',
        crossDomain: true,
        data:{matricula:matricula,laboratorio:laboratorio,asignatura:asignatura,grupo:grupo,practica:practica,dia:dia,data:data,id:id,fecha:fecha,fecha1:fecha1,admin:admin,notificacion:notificacion},
        async: true,
        success:function(datos){
          swal({   
            title: "Guardado",
            text: "Se han guardado exitosamente los datos." ,   
            type: "success",   
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
            closeOnConfirm: true,   
            closeOnCancel: false 
          }, function(isConfirm){   

              //$ionicHistory.clearCache().then(function(){ $state.go('app.laboratorio');});  
              //$state.go('app.laboratorio');
              //$window.location.reload(true);
              //$state.go($state.current, {}, {reload: true});
              //$state.go('app.calendario');
              
              $scope.datoslab = {};
              $("#txtDescripcion option:selected").removeAttr("selected");
              $("#txtDescripcion").select2();

              //$ionicHistory.clearCache();
              
          });
        },
        error:function(){
            swal("Error","Ha ocurrido un error intentelo de nuevo","error");
        }
      });
    }else{

      swal("Cuidado", "Aun quedan campos vacios", "warning")
    } 
  }
  
})

.controller('MaterialCtrl', function($scope, $stateParams,$window,$ionicPlatform,$state) {

  $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      swal({   
        title: "Cuidado",
        text: "Esta seguro de salir?." ,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "OK",   
        cancelButtonText: "No, Cancelar",   
        closeOnConfirm: false,   
        closeOnCancel: true 
      }, function(isConfirm){  
          if (isConfirm) {
            $.ajax({
              url: serverbaseurl+"index.php/Session/logout",
              type:'GET',
              crossDomain: true,
              async: true,
              success:function(datos){
                ionic.Platform.exitApp();  
              }
            });
          } 
      });
      
  }, 1000);  

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  ionic.Platform.ready(function(){

    $('#fecha2').datepicker({
      autoclose: true,
      todayHighlight: true,
       format: 'yyyy/mm/dd'
    });

    $("#txtDescripciones").select2();

    $.ajax({
      url: serverbaseurl+"index.php/Materiales/GetInfoMats",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){
        obj = JSON.parse(datos);

        var mats = obj.mats;
        $("#matricula").val(mats);

        for (var i = 0; i < obj.materiales.length; i++) {

          var material = obj.materiales[i].nombre_material; 
          $("#txtDescripciones").append("<option value='"+material+"'>"+material+"</option>");
        }
      }
    });
  });

  $scope.datosmat = {};

  $scope.GuardaSolicitudUser = function(){

    var matricula = $("#matricula").val();
    var data =[];
    var $el=$("#txtDescripciones");
    $el.find('option:selected').each(function(){
    data.push($(this).val());
    });
    var hora1 = $("#horaInicio").val();
    var hora2 = $("#horaFin").val();
    var id = $("#identificacion").val();
    var fecha = $("#fecha2").val();
    var observacion = '--';
    var notificacion = '1';

    if(matricula!="" && data!="" && hora1!="" && hora2!="" && id!="" && fecha!="" ){

      $.ajax({
          url:serverbaseurl+"index.php/Materiales/PideMaterial",
          type:'POST',
          crossDomain: true,
          data:{matricula:matricula,data:data,hora1:hora1,hora2:hora2,id:id,fecha:fecha,observacion:observacion,notificacion:notificacion},
          async: true,
          success:function(datos){
            swal({   
              title: "Guardado",
              text: "Se han guardado exitosamente los datos." ,   
              type: "success",   
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
              closeOnConfirm: true,   
              closeOnCancel: false 
            }, function(isConfirm){   

                //$ionicHistory.clearCache().then(function(){ $state.go('app.laboratorio');});  
                //$state.go('app.laboratorio');
                //$window.location.reload(true);
                //$state.go('app.calendario');
                
                $scope.datosmat = {};
                $("#txtDescripciones option:selected").removeAttr("selected");
                $("#txtDescripciones").select2();

                //$state.go($state.current, {}, {reload: true});
                
            });
          },
          error:function(){
              swal("Error","Ha ocurrido un error intentelo de nuevo","error");
          }
      });
    }else{
      swal("Cuidado","Cuidado aun quedan campos vacios","warning");
    }
  } 
 
      
})

.controller('InventarioCtrl', function($scope,$ionicPlatform) {

  $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      swal({   
        title: "Cuidado",
        text: "Esta seguro de salir?." ,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "OK",   
        cancelButtonText: "No, Cancelar",   
        closeOnConfirm: false,   
        closeOnCancel: true 
      }, function(isConfirm){  
          if (isConfirm) {
            $.ajax({
              url: serverbaseurl+"index.php/Session/logout",
              type:'GET',
              crossDomain: true,
              async: true,
              success:function(datos){
                ionic.Platform.exitApp();  
              }
            });
          } 
      });
      
  }, 1000);  

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  ionic.Platform.ready(function(){
      
    $.ajax({
      url: serverbaseurl+"index.php/Materiales/Inventario",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){
        var obj  = JSON.parse(datos);
        
        for (var i = 0; i < obj.length; i++) {

          var nombre = obj[i].nombre_material;
          var tipo = obj[i].tipo_material;
          var descripcion = obj[i].descripcion;
          var marca = obj[i].marca;
          var modelo = obj[i].modelo;
          var cantidad = obj[i].cantidad;
          var unidades = obj[i].tipo;
          var final = cantidad+' '+unidades;

          $("#contenido").append("<tr role='row'><td>"+nombre+"</td><td>"+tipo+"</td><td>"+descripcion+"</td><td>"+marca+"</td><td>"+modelo+"</td><td>"+final+"</td></tr>");

        }

        $('#tableinventario').DataTable( {

          "language": {
          "url": "js/Spanish.json"
          }
        });
        $("#preloaderinventario").hide();
        $("#inventariofull").show();

      },error:function(){
        swal("Error","Ha ocurrido un error intentelo de nuevo","error");
      }
    });

  });
})

.controller('ReportesCtrl', function($scope, $stateParams,$ionicPlatform) {

  $ionicPlatform.registerBackButtonAction(function(e) {
      e.preventDefault();
      swal({   
        title: "Cuidado",
        text: "Esta seguro de salir?." ,   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "OK",   
        cancelButtonText: "No, Cancelar",   
        closeOnConfirm: false,   
        closeOnCancel: true 
      }, function(isConfirm){  
          if (isConfirm) {
            $.ajax({
              url: serverbaseurl+"index.php/Session/logout",
              type:'GET',
              crossDomain: true,
              async: true,
              success:function(datos){
                ionic.Platform.exitApp();  
              }
            });
          } 
      });
      
  }, 1000);  

  var localbaseurl = "http://localhost:8080/BACKEND/";
  var serverbaseurl = "http://www.innovativesoftware.com.mx/BACKEND/";

  ionic.Platform.ready(function(){

    $.ajax({
      url: serverbaseurl+"index.php/Dashboard/Deudores",
      type:'GET',
      crossDomain: true,
      async: true,
      success:function(datos){
        var obj  = JSON.parse(datos);
        
        for (var i = 0; i < obj.length; i++) {

          var nombre = obj[i].nombre;
          var ap = obj[i].ap_paterno;
          var am = obj[i].ap_materno;
          var final = nombre+' '+ap+' '+am;
          var matricula = obj[i].matricula;
          var orden = obj[i].consecutivo;
          var material = obj[i].descripcion;
          var fecha = obj[i].fecha_uso;
          var responsable = obj[i].responsable;

          $("#contenidodeudores").append("<tr role='row'><td>"+final+"</td><td>"+matricula+"</td><td>"+orden+"</td><td>"+material+"</td><td>"+fecha+"</td><td>"+responsable+"</td></tr>");

        } 

        $("#preloaderreportes").hide();
        $("#reportesfull").show();

      },error:function(){
        swal("Error","Ha ocurrido un error intentelo de nuevo","error");
      }
    });

  });
});




