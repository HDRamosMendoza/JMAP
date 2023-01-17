$(document).ready(function () {
    /* LOCAL STORAGE */
    let TOKEN_PNP          = JSON.parse(localStorage.getItem("token_pnp"));
    const USUARIO_NOMBRE = localStorage.getItem("usuNombre");
    const USUARIO_CIP    = localStorage.getItem("usuCipUsuario");
    const USUARIO_COD    = localStorage.getItem("usuCodUnidad");
    const USUARIO_ROL    = JSON.parse(localStorage.getItem("usuRol"));
    const USUARIO_IP     = localStorage.getItem("usuIP");
    const USUARIO_SID    = localStorage.getItem("usuCodComi");
    const USUARIO_PNP    = localStorage.getItem("usuUnidadPNP");
    const USUARIO_ARR    = USUARIO_ROL!== null? USUARIO_ROL.map(item=>item.rolNombre) : "";
    let TB_SITUACION_ACTUAL = null;
    let CHART_PIE = null;
    Chart.defaults.set('plugins.datalabels',{color:'#000000'});
    
    let _validateJurisdiccion = function () {
        try {
            let _boolJurisdiccion = true;
            if(USUARIO_SID !== "null" && USUARIO_SID !== "" && USUARIO_SID !== null) {
                _boolJurisdiccion = false;
            }
            return _boolJurisdiccion;
        } catch(error) {
            console.error(`_validateJurisdiccion: ${error.name} - ${error.message}`);
        }
    }
    _validateJurisdiccion();
    /* Valida un ID */
    let _elementById = function (paramId) {
        try {
            let id = document.getElementById(paramId);
            if(id !== null && id !== undefined){
                return id;
            } else {
                console.log(`Error: ID(${paramId}) => null || undefined`);
            }
        } catch(error) {
            console.error(`_elementById: ${error.name} - ${error.message}`);
        }
    };
    /* Valida TOKEN */
    let _validateLocal = function() {
        try {
            let _TOKEN = localStorage.getItem("token_pnp");
            if(_TOKEN == "" || _TOKEN == null) {
                window.location.href = "./login.html";
            }
        } catch(error) {
            console.error(`_validateLocal: ${error.name} - ${error.message}`);
        }     
    }
    /* Usuario */
    let _usuario = function(_data) {
        try {
            _elementById("ID_Usuario").innerText = _data || 'Error';	    
        } catch(error) {
            console.error(`_usuario: ${error.name} - ${error.message}`);
        }
    };
    _usuario(USUARIO_NOMBRE);
    /* Jurisdicción */
    _elementById("ID_CODIGO").innerText = _validateJurisdiccion() ? "NO ASIGNADA" : USUARIO_SID;
    /* Valida */
    _validateLocal();    
    /* Control de Paneles y secciones */
    let _users = function() {
        try {            
            if(USUARIO_ARR.some((element) => element === 'ROLE_ADMIN')) {
                /* ADMIN - Sin restricciones*/
            } else if(USUARIO_ARR.some((element) => element === 'ROLE_USER')) {
                /* USUARIO */
                $("#ID_TAB_USUARIOS").remove();
                $("#ID_TAB_AUDITORIA").remove();
            } else {
                /* SIN ROL */
                $("#ID_TAB_INICIO").remove();
                $("#ID_TAB_USUARIOS").remove();
                $("#ID_TAB_JURISDICCION").remove();
                $("#ID_TAB_AUDITORIA").remove();
            }
        } catch(error) {
            console.error(`_users: ${error.name} - ${error.message}`);
        }
    }
    _users();
    /* SALIR */
    _elementById("ID_SALIR").addEventListener("click", function(){
        try {
            /* Elimina el TOKEN */
            localStorage.removeItem("token_pnp");
            _validateLocal();
        } catch(error) {
            console.error(`ID_SALIR: ${error.name} - ${error.message}`);
        }
    });

    /* GRAFICA */
    let _chartPie = function() {
        try {
            if(_validateJurisdiccion()) { 
                $("#ID_TB_SITUACION_ACTUAL,#ID_LIST_SITUACION_ACTUAL").hide();
                return false;
            }

            CHART_PIE = new Chart(document.getElementById('ID_CHART_SITUACION_ACTUAL'), {
                plugins: [ChartDataLabels],
                type: 'pie',
                data: {
                    labels: ['Sin medidas', 'Con medidas'],
                    datasets: [{
                        label: 'Cantidad',
                        /*data: [12, 19], */
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.9)',
                            'rgba(54, 162, 235, 0.9)',
                            'rgba(255, 205, 86, 0.9)',
                            'rgba(75, 192, 192, 0.9)',
                            'rgba(54, 162, 235, 0.9)',
                            'rgba(153, 102, 255, 0.9)',
                            'rgba(201, 203, 207, 0.9)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'TOTAL DENUNCIAS LEY N°30364',
                            color: 'rgb(0,0,0)',
                            fontSize: 20,
                        },
                        legend: {
                            display: true,
                            position: "bottom",
                            labels: { color: 'rgb(0,0,0)' }
                        },
                        datalabels: {
                            color: '#FFFFFF',
                            textStrokeColor: "#000000",
                            textStrokeWidth: 0.8,
                            textShadowBlur: 4,
                            textShadowColor: '#000000',
                            anchor: 'center',
                            clamp: true,
                            formatter: function formatter(value, context) {
                                value = value.toString();
                                return value + "%";
                            }
                        }            
                    }
                }
            });
            
        } catch(error) {
            console.error(`_chartPie: ${error.name} - ${error.message}`);
        }
    }
    _chartPie();
    

    /* Tabla - SITUACION ACTUAL */
    let _datatableSituacionActual = function() {
        try {
            if(_validateJurisdiccion()) { return false;}

            TB_SITUACION_ACTUAL = $('#ID_TB_SITUACION_ACTUAL').DataTable({
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
                pageLength: 5,
                paging: false,
                searching: false,
                columnDefs: [
                    {
                        className: 'dt-right',
                        targets: 0
                    },{
                        render: function (data, type, row) {
                            return data.toUpperCase();
                        },
                        targets: 1
                    },{
                        className: 'dt-right',
                        targets: 2
                    }
                ],
            });
        } catch(error) {
            //console.error(`_datatableSituacionActual: ${error.name} - ${error.message}`);
        } 
    }    
    _datatableSituacionActual();

    //_graficos(`http://localhost:8099/denuncia/violencia/${USUARIO_SID}`,"02");
    /* Listar SITUACION ACTUAL */
    let _listarSituaciónActual = function() {
        try {
            if(_validateJurisdiccion()) { return false;}

            TB_SITUACION_ACTUAL.clear().draw();
            const ALERT_ERROR = `
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                    <strong>Error</strong> al listar la SITUACIÓN ACTUAL.
                </div>`;                       

            $.ajax({
                "url": `http://localhost:8099/denuncia/violencia/${USUARIO_SID}`,
                "async": true,
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            })
            .done(function(response) {
                try {
                    let _leng = response.length;
                    let _data = [], _label = [];
                    for(let i = 0; i< _leng; i++) {
                        _label.push(response[i].tipoViolencia.toUpperCase());
                        _data.push(response[i].total);
                    }
                    let _total = _data.reduce((a, b) => a + b, 0);
                    let _data_0 = Math.round((_data[0]/_total)*100); /* Violencia fisica */
                    let _data_1 = Math.round((_data[1]/_total)*100); /* Violencia psicologica */
                    let _data_2 = Math.round((_data[2]/_total)*100); /* Violencia sexual */
                    let _data_3 = Math.round((_data[3]/_total)*100); /* Violencia economica o patrimonial */
                    let _data_4 = Math.round((_data[4]/_total)*100); /* Sin tipo */
                    CHART_PIE.data.datasets[0].data = [_data_0,_data_1,_data_2,_data_3,_data_4];
                    CHART_PIE.data.labels = _label;
                    CHART_PIE.update();
                    
                    response.forEach((item,index) => {
                        TB_SITUACION_ACTUAL.row.add([
                            index + 1,
                            item["tipoViolencia"] || "",
                            item["total"] || ""
                        ]).draw(false);
                    });
                    _elementById("ID_TOTAL").innerText = _total;
                    _elementById("ID_TOTAL").style.fontWeight = "800";
                } catch(error) {
                    $("#ID_SEND_SITUACION_ACTUAL").html(ALERT_ERROR);
                    $("#ID_SEND_SITUACION_ACTUAL").show();
                    //console.error(`_listarSituaciónActual .done: ${error.name} - ${error.message}`);
                }
            })
            .fail(function(msg) {
                $("#ID_SEND_SITUACION_ACTUAL").html(ALERT_ERROR);
                $("#ID_SEND_SITUACION_ACTUAL").show();
            })
            .always(function(jqXHR, textStatus) {
                setTimeout(function() {
                    $("#ID_SEND_SITUACION_ACTUAL").hide();
                }, 3000);
            });
        } catch(error) {
            //console.error(`_listarSituaciónActual: ${error.name} - ${error.message}`);
        }
    };
    _listarSituaciónActual();
    
    _elementById("ID_LIST_SITUACION_ACTUAL").addEventListener("click", function() {
        try {
            _listarSituaciónActual();
        } catch(error) {
            //console.error(`ID_LIST_SITUACION_ACTUAL: ${error.name} - ${error.message}`);
        }
    });
});