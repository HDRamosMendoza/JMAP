
$("#ID_ALERTA").hide();
let _map = function(_cip, _pass) {
    var settings = {
        "url": "http://localhost:8099/general/acceso/token?",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "cip": _cip,
            "password": _pass
        }),
    };
        
    $.ajax(settings).done(function (response) {
        if(response.mensaje = "CORRECTO") {
            window.location.href = "./map.html";
        } else {
            window.location.href = "./logueo.html";
        }
    });
}

let _credenciales = function() {
    let _cip = $("#ID_CIP").val();
    let _clave = $("#ID_CLAVE").val();
    
    if(_cip == "124578" && _clave == "123456"){
        _map(_cip,_clave);
        $("#ID_ALERTA").hide();
    } else {
        $("#ID_ALERTA").show();
    }

    if(_cip == "235689" && _clave == "123456"){
        _map(_cip,_clave);
        $("#ID_ALERTA").hide();
    } else {
        $("#ID_ALERTA").show();
    }
}