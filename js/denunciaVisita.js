$(document).ready(function () {
    /* Validad si nulo o vacio */
    let _validateInput = function(_data) {
        try {
            _data = _data.trim();
            let _dataBoolean = true;
            if(_data === "" || _data.length > 0) {
                return _dataBoolean = false;
            } 
            return _dataBoolean;
        } catch(error) {
            console.error(`valdInput: ${error.name} - ${error.message}`);
        }
    };

    /* GUARDAR */
    $("#ID_VIS_BTN_GUARDAR").on("click", function() {
        try {
            //ERROR DE CARGA
            /* Registrar Visita */
            let _dato01 = $("#ID_VIS_DATO01").text();
            let _dato02 = $("#ID_VIS_DATO02").val();
            let _dato03 = $("#ID_VIS_DATO03").val();
            let _dato04 = $("#ID_VIS_DATO04").val();
            let _dato05 = $("#ID_VIS_DATO05").val();
            
            console.log(_validateInput(_dato01));
            console.log(_dato01);
            if(_validateInput(_dato01) || (_dato01 == "ERROR DE CARGA")) {
                $("#ID_VIS_ALERT_DATO01").show();
            } else {
                $("#ID_VIS_ALERT_DATO01").hide();
            }

            console.log(_dato02);
            if(_validateInput(_dato02)) {
                $("#ID_VIS_ALERT_DATO02").show();
            } else {
                $("#ID_VIS_ALERT_DATO02").hide();
            }

            console.log(_dato03);
            if(_validateInput(_dato03)) {
                $("#ID_VIS_ALERT_DATO03").show();
            } else {
                $("#ID_VIS_ALERT_DATO03").hide();
            }

            console.log();
            if(_validateInput(_dato04)) {
                $("#ID_VIS_ALERT_DATO04").show();
            } else {
                $("#ID_VIS_ALERT_DATO04").hide();
            }

            console.log();
            if(_validateInput(_dato04)) {
                $("#ID_VIS_ALERT_DATO04").show();
            } else {
                $("#ID_VIS_ALERT_DATO04").hide();
            }

            console.log();
            if(_validateInput(_dato05)) {
                $("#ID_VIS_ALERT_DATO05").show();
            } else {
                $("#ID_VIS_ALERT_DATO05").hide();
            }

            /*
            let settings = {
                "url": "http://localhost/GuardarVisita",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "_dato01": _dato01,
                    "_dato02": _dato02,
                    "_dato03": _dato03,
                    "_dato04": _dato04,
                    "_dato05": _dato05                    
                }),
            };
                
            $.ajax(settings)
                .done(function (response) {
                    console.log(response);
                    console.log(response.mensaje);
                    if(response) {
                        // Ventana de confirmación
                    } else {
                        // Ventana de error
                    }
                })
                .fail(function(msg) {
                    
                })
                .always(function(jqXHR,textStatus) {
                    
                });
                */
        } catch(error) {
            console.error(`ID_VIS_BTN_GUARDAR: ${error.name} - ${error.message}`);
        }
    });
    
    /* LIMPIAR */
    $("#ID_VIS_BTN_LIMPIAR").on("click", function() {
        try {
            $("#ID_VIS_DATO01").val("");
            $("#ID_VIS_DATO02").val("");
            $("#ID_VIS_DATO03").val("");
            $("#ID_VIS_DATO04").val("");
            $("#ID_VIS_DATO05").val("");
            $("#ID_VIS_DATO01").hide();
            $("#ID_VIS_DATO02").hide();
            $("#ID_VIS_DATO03").hide();
            $("#ID_VIS_DATO04").hide();
            $("#ID_VIS_DATO05").hide();
        } catch(error) {
            console.error(`ID_VIS_BTN_LIMPIAR: ${error.name} - ${error.message}`);
        }
    });
});