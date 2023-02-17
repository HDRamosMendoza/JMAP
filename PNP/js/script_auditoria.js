$(document).ready(function () {
    let TB_AUDITORIA     = null;
    let TOKEN_PNP        = JSON.parse(localStorage.getItem("token_pnp"));
    const USUARIO_NOMBRE = localStorage.getItem("usuNombre");
    const USUARIO_CIP    = localStorage.getItem("usuCipUsuario");
    const USUARIO_COD    = localStorage.getItem("usuCodUnidad");
    const USUARIO_ROL    = JSON.parse(localStorage.getItem("usuRol"));
    const USUARIO_IP     = localStorage.getItem("usuIP");
    const USUARIO_SID    = localStorage.getItem("usuCodComi");
    const USUARIO_PNP    = localStorage.getItem("usuUnidadPNP");
    const USUARIO_ARR    = USUARIO_ROL!== null? USUARIO_ROL.map(item=>item.rolNombre) : "";
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
    _validateLocal();
    /* Usuario */
    let _usuario = function(_data) {
        try {
            _elementById("ID_Usuario").innerText = _data || 'Error';	    
        } catch(error) {
            console.error(`_usuario: ${error.name} - ${error.message}`);
        }
    };
    _usuario(USUARIO_NOMBRE);
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
    _users();;
    
    $('#ID_FECHA_INICIO, #ID_FECHA_FIN').datetimepicker({ locale: 'es', format: 'DD/MM/YYYY', useCurrent: true });    
    $("#ID_FECHA_INICIO").on("dp.change", function (e) { $('#ID_FECHA_FIN').data("DateTimePicker").minDate(e.date); });
    $("#ID_FECHA_FIN").on("dp.change", function (e) { $('#ID_FECHA_INICIO').data("DateTimePicker").maxDate(e.date); });

    /* Tabla - ROL */
    let _datatableAuditoria = function() {
        try {
            TB_AUDITORIA = $('#ID_TB_AUDITORIA').DataTable({
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
                pageLength: 5,
                paging: true,
                searching: false,
                /*
                columnDefs: [
                    {
                        render: function (data, type, row) {
                            return `
                                <button type='button' class='btn btn-xs btn-primary' data-toggle='modal' data-target='#ID_Modal_AUDITORIA' role="tab">
                                    <i class="fa fa-edit"></i> Editar
                                </button>`;
                        },
                        orderable: false,
                        className: 'dt-center',
                        width: "95px",
                        targets: 9
                    }
                ]  */   
            });
        } catch(error) {
            console.error(`_datatableAuditoria: ${error.name} - ${error.message}`);
        } 
    };
    _datatableAuditoria();

    /* Elimina acentos */
    let _removeAccents = function(_text) {
        try {
            _text = String(_text);
            const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U','ñ':'ni'};
            return _text.split('').map( letra => acentos[letra] || letra).join('').toString();
        } catch(error) {
            console.error(`_removeAccents: ${error.name} - ${error.message}`);
        }
    };

    /* HTML Export */
    let _contentExport = function(_response) {
        try {
            _elementById(`ID_TB_AUDITORIA_HIDE`).innerHTML = "";
            let _fields = [
                {"alias":"Usuario","field":"usuario"},
                {"alias":"Jurisdicción","field":"jurisdiccionAsig"},
                {"alias":"Acceso","field":"audfecacc"},
                {"alias":"IP","field":"audip"},
                /*{"alias":"PC","field":"audnompc"},*/
                {"alias":"Acción","field":"audaccion"},
                {"alias":"Query","field":"audqrydenuncia"}
            ];
            let fragment = document.createDocumentFragment();
            let rowHeader = document.createElement("tr"); 
            _fields.map((item, index) => {
                let rowCol = document.createElement("td");
                rowCol.innerText = _removeAccents(item.alias);
                rowHeader.appendChild(rowCol);
            });
            fragment.appendChild(rowHeader);            
            _response.forEach((item,index) => {
                let row = document.createElement("tr");
                _fields.map((_item,_index) => {
                    let rowCol = document.createElement("td");
                    rowCol.innerText = _removeAccents(item[_item.field]) ?? "";
                    row.appendChild(rowCol);
                });
                fragment.appendChild(row);    
            });
            _elementById(`ID_TB_AUDITORIA_HIDE`).appendChild(fragment);
        } catch (error) {
            console.error(`_contentExport: ${error.name} - ${error.message}`);
        }
    };

    /*
    _elementById("ID_LIST_AUDITORIA").addEventListener("click", function() {
        try {
            _listarAuditoria();
        } catch(error) {
            console.error(`ID_LIST_AUDITORIA: ${error.name} - ${error.message}`);
        }
    });
    */

    _formatDate = function(_date) {
        try {
            let date = new Date(_date);
            let getYear = date.toLocaleString("default", {year: "numeric"});
            let getMonth = date.toLocaleString("default", {month: "2-digit"});
            let getDay = date.toLocaleString("default", {day: "2-digit"});
            let dateFormat = getYear + "-" + getMonth + "-" + getDay; 
            return dateFormat + " 00:00";
        } catch(error) {
            console.error(`_formatDate: ${error.name} - ${error.message}`);
        }
    };

    /* Buscar AUDITORIA */
    _elementById("ID_AUD_BUSCAR").addEventListener("click", function() {
        try {
            TB_AUDITORIA.clear().draw();
            console.log("dio clic");
            const ALERT_ERROR = `<hr><div class="alert alert-danger" role="alert" style="margin-top: 20px;"><strong>Error</strong> al listar auditoría.</div>`;
            const ID_SEARCH   = "#ID_SEARCH_AUDITORIA";
            const ALERT_DATO  = `<div class="alert alert-warning" role="alert" style="margin-top: 20px;"><strong>(*) Completar</strong> dato de búsqueda.</div>`;
            const ALERT_FECHA = `<div class="alert alert-warning" role="alert" style="margin-top: 20px;"><strong>(*) Completar</strong> rango de fecha.</div>`;
            const ALERT_RANGO_FECHA = `<div class="alert alert-warning" role="alert" style="margin-top: 20px;"><strong>(*) Rango</strong> de fecha inadecuado. Fecha de inicio o fin como máximo hoy.</div>`;
            let _fechaInicio= $("#ID_FECHA_INICIO").val().trim();
            let _fechaFin   = $("#ID_FECHA_FIN").val().trim();
            let _campo      = $("#ID_FC_CAMPO").val().trim(); _campo = _campo.trim();
            let _activeTab  = $('.nav-tabs a.active').text().trim();
            let _field = "";            
            if(_activeTab == "Otros criterios") {
                if(_campo !== "" && _campo.length > 0) {
                    _field = _campo;
                    $(ID_SEARCH).hide();
                } else {
                    $(ID_SEARCH).html(ALERT_DATO);
                    $(ID_SEARCH).show();
                    setTimeout(function() { $(ID_SEARCH).hide(); }, 3000);
                    return false;
                }                      
                /* TABLA */
                $.ajax({
                    "url": `http://localhost:8099/ctrlAcceso/listaByLike/${_field}`,
                    "method": "GET",
                    "headers": {
                        "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                        "Content-Type": "application/json"
                    }
                })
                .done(function(response) {
                    try {
                        if(response.length > 0) {
                            response.forEach((item,index) => {
                                TB_AUDITORIA.row.add([
                                    index + 1,
                                    item["usuario"] || "",
                                    item["jurisdiccionAsig"] || "",
                                    item["audfecacc"] || "",
                                    item["audip"] || "",
                                    /*item["audnompc"] || "",*/
                                    item["audaccion"] || "",
                                    item["audqrydenuncia"] || "",
                                    item["idCtrlAcceso"] || "",
                                ]).draw(false);
                            });
                            _contentExport(response);
                        } else {
                            TB_AUDITORIA.clear().draw();
                        }
                    } catch(error) {
                        $("#ID_SEND_AUDITORIA").html(ALERT_ERROR);
                        $("#ID_SEND_AUDITORIA").show();
                        console.error(`_listarAuditoria .done: ${error.name} - ${error.message}`);
                    }
                })
                .fail(function(msg) {
                    $("#ID_SEND_AUDITORIA").html(ALERT_ERROR);
                    $("#ID_SEND_AUDITORIA").show();
                })
                .always(function(jqXHR, textStatus) {
                    setTimeout(function() {
                        $("#ID_SEND_AUDITORIA").hide();
                    }, 3000);
                }); 
            } else {
                let RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
                if ((_fechaInicio.match(RegExPattern)) && (_fechaInicio!='') && (_fechaFin.match(RegExPattern)) && (_fechaFin!='')) {
                    $(ID_SEARCH).hide();
                } else {
                    $(ID_SEARCH).html(ALERT_FECHA);
                    $(ID_SEARCH).show();
                    setTimeout(function() { $(ID_SEARCH).hide(); }, 3000);
                    return false;
                }
                let _inicio = _formatDate(_fechaInicio);
                let _fin = _formatDate(_fechaFin);

                console.log(_inicio);
                console.log(_fin);

                if(_inicio.length> 17 || _fin.length > 17) {
                    
                    $(ID_SEARCH).html(ALERT_RANGO_FECHA);
                    $(ID_SEARCH).show();
                    setTimeout(function() { $(ID_SEARCH).hide(); }, 3000);
                    return false;
                }


                /* TABLA */
                $.ajax({
                    "url": `http://localhost:8099/ctrlAcceso/listaByDate/${_inicio}/${_fin}`,
                    "method": "GET",
                    "headers": {
                        "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                        "Content-Type": "application/json"
                    }
                })
                .done(function(response) {
                    try {
                        if(response.length > 0) {
                            response.forEach((item,index) => {
                                TB_AUDITORIA.row.add([
                                    index + 1,
                                    item["usuario"] || "",
                                    item["jurisdiccionAsig"] || "",
                                    item["audfecacc"] || "",
                                    item["audip"] || "",
                                    /*item["audnompc"] || "",*/
                                    item["audaccion"] || "",
                                    item["audqrydenuncia"] || "",
                                    item["idCtrlAcceso"] || ""
                                ]).draw(false);
                            });
                            _contentExport(response);
                        } else {
                            TB_AUDITORIA.clear().draw();
                        }
                    } catch(error) {
                        $("#ID_SEND_AUDITORIA").html(ALERT_ERROR);
                        $("#ID_SEND_AUDITORIA").show();
                        console.error(`_listarAuditoria .done: ${error.name} - ${error.message}`);
                    }
                })
                .fail(function(msg) {
                    $("#ID_SEND_AUDITORIA").html(ALERT_ERROR);
                    $("#ID_SEND_AUDITORIA").show();
                })
                .always(function(jqXHR, textStatus) {
                    setTimeout(function() {
                        $("#ID_SEND_AUDITORIA").hide();
                    }, 3000);
                }); 
            }            
        } catch(error) {
            console.error(`ID_AUD_BUSCAR: ${error.name} - ${error.message}`);
        }
    });

    _elementById("ID_AUD_LIMPIAR").addEventListener("click", function() {
        try {
           $("#ID_FECHA_INICIO").val('');
           $("#ID_FECHA_FIN").val('');
           $("#ID_FC_CAMPO").val('');
           $("#ID_SEARCH_AUDITORIA").hide();
           TB_AUDITORIA.clear().draw();
        } catch(error) {
            console.error(`ID_AUD_LIMPIAR: ${error.name} - ${error.message}`);
        }
    });
    /* Exportar EXCEL */
    _elementById("ID_AUD_EXCEL").addEventListener("click", function() {
        try {
            let filename = "AUDITORIA_";
            let d = new Date();
            let downloadLink;
            let dataType = 'application/vnd.ms-excel';
            let tableSelect = document.getElementById("ID_TB_AUDITORIA_HIDE");
            let tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
            filename = filename?`${filename}_${d.getDate()}${d.getMonth()+1}${d.getFullYear()}_${d.getHours()}${d.getMinutes()}${d.getSeconds()}.xls`:'excel_data.xls';
            downloadLink = document.createElement("a");        
            document.body.appendChild(downloadLink);
            if(navigator.msSaveOrOpenBlob) {
                var blob = new Blob(['ufeff', tableHTML], {
                    type: dataType
                });
                navigator.msSaveOrOpenBlob( blob, filename);
            } else {
                downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
                downloadLink.download = filename;
                downloadLink.click();
            } 
        } catch(error) {
            console.error(`ID_AUD_EXCEL: ${error.name} - ${error.message}`);
        }
    });
});