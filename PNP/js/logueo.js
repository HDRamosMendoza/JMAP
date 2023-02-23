const ALERT_WARNING = "<strong>Error</strong>. Credenciales incorrectas !!!";
const ALERT_ERROR = "<strong>ERROR</strong>. Servicio caído";
let IP_PC = null;
$("#ID_LOAD").hide();
$("#ID_ALERTA").hide();
$("#ID_ALERTA").html(ALERT_WARNING);

let _getIP = function() {
    try {
        $.get('https://ipapi.co/json/', function(data) {
            IP_PC = eval(data).ip;
        });
    } catch(error) {
        console.error(`_getIP: ${error.name} - ${error.message}`);
    }
};
_getIP();

let _map = function(_cip, _pass) {
    try {
        let settings = {
            "url": "http://localhost:8099/auth/login?",
            "method": "POST",
            "timeout": 0,
            "headers": { "Content-Type": "application/json" },
            "data": JSON.stringify({
                "cipUsuario": _cip,
                "password": _pass
            }),
        };            
        $.ajax(settings)
            .done(function(response) {
                console.log(response);
                $("#ID_LOAD").hide();
                if(response.mensaje = "CORRECTO") {
                    localStorage.setItem("token_pnp",JSON.stringify(response.token));
                    localStorage.setItem("usuNombre",response.usuario.nombre);
                    localStorage.setItem("usuCipUsuario",response.usuario.cipUsuario);
                    localStorage.setItem("usuCodUnidad",response.usuario.codUnidad);
                    localStorage.setItem("usuRol",JSON.stringify(response.usuario.roles));
                    localStorage.setItem("usuIP",IP_PC);
                    localStorage.setItem("usuCodComi",response.comisariaPnp.codcomi); 
                    localStorage.setItem("usuUnidadPNP",response.comisariaPnp.unidad);
                    window.location.href = "./inicio.html";
                } else {
                    localStorage.setItem("token_pnp",'');
                    localStorage.setItem("usuNombre",'');
                    localStorage.setItem("usuCipUsuario",'');
                    localStorage.setItem("usuCodUnidad",'');
                    localStorage.setItem("usuRol",'');
                    localStorage.setItem("usuIP",'');
                    localStorage.setItem("usuCodSidPol",'');
                    localStorage.setItem("usuUnidadPNP",'');
                    window.location.href = "./login.html";
                }                
            })
            .fail(function(msg) {
                $("#ID_LOAD").hide();   
                $("#ID_ALERTA").html(ALERT_WARNING);
                $("#ID_ALERTA").show();
                setTimeout(() => {
                    $("#ID_ALERTA").hide();
                }, 5000);
            })
            .always(function(jqXHR,textStatus) {
                $("#ID_LOAD").hide();
            });
    } catch(error) {
        console.error(`_map: ${error.name} - ${error.message}`);
    }
}

let _credenciales = function() {
    try {        
        let _cip = $("#ID_CIP").val();
        let _cla = $("#ID_CLAVE").val();        
        $("#ID_ALERTA").html(ALERT_WARNING);
        if(_cip == "" || _cla == ""){            
            $("#ID_ALERTA").show(); return false;
        } else {
            $("#ID_ALERTA").hide(); 
        }

        $("#ID_LOAD").show();
        _map(_cip,_cla);
    } catch(error) {
        console.error(`_credenciales: ${error.name} - ${error.message}`);
    }
}