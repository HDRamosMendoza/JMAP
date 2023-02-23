$(document).ready(function () {
    /* LOCAL STORAGE */
    let TOKEN_PNP        = JSON.parse(localStorage.getItem("token_pnp"));
    const USUARIO_NOMBRE = localStorage.getItem("usuNombre");
    const USUARIO_CIP    = localStorage.getItem("usuCipUsuario");
    const USUARIO_COD    = localStorage.getItem("usuCodUnidad");
    const USUARIO_ROL    = JSON.parse(localStorage.getItem("usuRol"));
    const USUARIO_IP     = localStorage.getItem("usuIP");
    const USUARIO_SID    = localStorage.getItem("usuCodComi");
    const USUARIO_PNP    = localStorage.getItem("usuUnidadPNP");
    const USUARIO_ARR    = USUARIO_ROL!== null? USUARIO_ROL.map(item=>item.rolNombre) : "";  
    const USUARIO_PC     = "";
    
    const ALERT_USU_NUEVO  = "#ID_ALERTA_USUARIO";
    const ALERT_USU_EDITAR = "#ID_ALERTA_EDI_USUARIO";
    let TB_USUARIOS = null;
    /* let TB_ROL = null; */
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
    /* Valida número entero */
    let _number = function(e) {
        try {
            var key = e.charCode;
            return key >= 48 && key <= 57;
        } catch(error) {
            console.error(`_number: ${error.name} - ${error.message}`);
        }
    };
    /* Captura los valores a filtrar */
    _elementById("ID_USU_CIP").addEventListener('keypress', (e) => {
        try {
            if (!_number(event)) {e.preventDefault(); }
        } catch(error) {
            console.error(`ID_USU_CIP: ${error.name} - ${error.message}`);
        }
    });
     /* Captura los valores a filtrar */
     _elementById("ID_USU_UNIDAD").addEventListener('keypress', (e) => {
        try {
            if (!_number(event)) {e.preventDefault(); }
        } catch(error) {
            console.error(`ID_USU_UNIDAD: ${error.name} - ${error.message}`);
        }
    });
    /* Captura los valores a filtrar */
    _elementById("ID_USU_EDI_UNIDAD").addEventListener('keypress', (e) => {
        try {
            if (!_number(event)) {e.preventDefault(); }
        } catch(error) {
            console.error(`ID_USU_EDI_UNIDAD: ${error.name} - ${error.message}`);
        }
    });
    /* Mostrar u ocultar contraseña */
    _elementById("ID_PASS_HIDE").addEventListener('click', (e) => {
        try {
            let _id = _elementById("ID_USU_CLAVE");
            let _class = e.target.classList;
            if (_class.contains('fa-eye-slash') ) {
                _class.remove('fa-eye-slash');
                _class.add('fa-eye');
                _id.type = "text";
            } else {
                _class.remove('fa-eye');
                _class.add('fa-eye-slash');
                _id.type = "password";
            }
        } catch(error) {
            console.error(`ID_PASS_HIDE: ${error.name} - ${error.message}`);
        }
    });
    /* Valida EMAIL */
    let _validateEmail = function(_emailField) {
        let validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;        
        if( validEmail.test(_emailField.value) ){
            return true;
        } else {
            return false;
        }
    }
    /* Valida correo */
    _elementById("ID_USU_CORREO").addEventListener('keypress', function() {
        let emailField = _elementById('ID_USU_CORREO');
        _validateEmail(emailField);
    });
    /* Usuario */
    let _usuario = function(_data) {
        try {
            _elementById("ID_Usuario").innerText = _data || 'Error';	    
        } catch(error) {
            console.error(`_usuario: ${error.name} - ${error.message}`);
        }
    };
    _usuario(USUARIO_NOMBRE);

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
    
    /* Tabla - USUARIO */
    let _datatableUsuarios = function() {
        try {
            TB_USUARIOS = $('#ID_TB_USUARIOS').DataTable({
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
                pageLength: 5,
                paging: true,
                searching: false,
                columnDefs: [
                    { 
                        className: 'dt-right', targets: 0
                    },{ 
                        width:"180px", targets: 2
                    },{
                        render: function (data, type, row) {
                            return `<button type='button' class='btn btn-xs btn-outline-warning my-2 my-sm-0' 
                                data-toggle='modal' data-id='${data}' data-target='#ID_Modal_EDI_USUARIO' role="tab" style="padding:0 8px;font-size:14px;">
                                <i class="fa fa-edit"></i> Editar
                            </button>
                            <button type='button' class='btn btn-xs btn-outline-danger my-2 my-sm-0' 
                                data-toggle='modal' data-id='${data}' data-target='#ID_Modal_DEL_USUARIO' role="tab" style="padding:0 8px;font-size:14px;">
                                <i class="fa fa-times"></i> Eliminar
                            </button>`;
                        },
                        orderable: false,
                        className: 'dt-center',
                        width: "200px",
                        targets: 8
                    }
                ]
            });
            /*
            <button type="button" class="btn btn-xs btn-outline-danger my-2 my-sm-0" style="padding:0 5px;font-size:14px;">
                <i class="fa fa-close"></i> Eliminar
            </button>
            */
            
        } catch(error) {
            console.error(`_datatableUsuarios: ${error.name} - ${error.message}`);
        } 
    };
    _datatableUsuarios();
    
    /* Listar USUARIO */
    let _listarUsuario = function() {
        try {
            TB_USUARIOS.clear().draw();
            const ALERT_ERROR = `
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                    <strong>Error</strong> al listar los USUARIOS
                </div>`;
            /* TABLA */
            $.ajax({
                "url": "http://localhost:8099/auth/lista",
                "method": "GET",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            })
            .done(function (response) {
                try {
                    response.forEach((item,index) => {
                        let _rolNombre = item["roles"].map(item=>item.rolNombre).toString();
                        TB_USUARIOS.row.add([
                            index + 1,
                            item["cipUsuario"],
                            item["nombre"],
                            item["codUnidad"],
                            _rolNombre,
                            item["nombreUsuario"],
                            item["email"],
                            item["password"] || "********",
                            item["idUsuario"],
                        ]).draw(false);
                    });
                } catch(error) {
                    $("#ID_SEND_USUARIO").show();
                    $("#ID_SEND_USUARIO").html(ALERT_ERROR);
                    console.error(`_listarUsuario .done: ${error.name} - ${error.message}`);
                }
            })
            .fail(function(msg) {
                $("#ID_SEND_USUARIO").html(ALERT_ERROR);
            })
            .always(function(jqXHR, textStatus) {
                _medidasProteccion_CTRL('', "Listo Usuario");
                setTimeout(function() {
                    $("#ID_SEND_USUARIO").hide();
                }, 3000);

                //_medidasProteccion_CTRL(_codigoDenuncia, "Consulta");
            });
        } catch(error) {
            console.error(`_listarUsuario: ${error.name} - ${error.message}`);
        }
    };
    _listarUsuario();

    _elementById("ID_LIST_USUARIO").addEventListener("click", function() {
        try {
            _listarUsuario();
        } catch(error) {
            console.error(`ID_LIST_USUARIO: ${error.name} - ${error.message}`);
        }
    });
    /* Valida campo */
    let _validateField = function(_url,_index,_codigo) {
        try {
            let _return = "";
            $.ajax({
                "url": `${_url}/${_index}/${_codigo}`,
                "async": false,
                "method": "GET",
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            }).done(function (response) {
                try {        
                    let _eval = eval(`([${response}])`);
                    _return =_eval[0].existe;
                } catch(error) {
                    console.error(`_validateField AJAX: ${error.name} - ${error.message}`);
                }
            });
            return _return;
        } catch(error) {
            console.error(`_validateField: ${error.name} - ${error.message}`);
        }
    };
   
    /* Guardar USUARIO */
    _elementById("ID_USU_NUE_GUARDAR").addEventListener("click", function() {
        try {
            const ALERT_WARNING = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                    <strong>(*)ADVERTENCIA</strong>. Campo obligatorio.
                </div>`;
            const ALERT_CIP = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. CIP existente.</div>`;
            const ALERT_USER = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Usuario existente.</div>`;
            const ALERT_EMAIL = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Correo existente.</div>`;
            const ALERT_EMAIL_VAL = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Correo inválido.</div>`;
            const ALERT_SUCCESS = `<hr>
                <div class="alert alert-success" role="alert">
                    <strong>USUARIO REGISTRADO</strong>. Proceso finalizado.
                </div>`;
            let _cip = $("#ID_USU_CIP").val();
            let _nombre = $("#ID_USU_NOMBRE").val();
            let _unidad = $("#ID_USU_UNIDAD").val();
            let _rol    = $("#ID_USU_TIPO").val();
            let _usuario= $("#ID_USU_USUARIO").val();
            let _correo = $("#ID_USU_CORREO").val();
            let _clave  = $("#ID_USU_CLAVE").val();

            if(_cip == "" || _nombre == "" || _unidad == "" || _rol == "" || _usuario == "" || _correo == "" || _clave == "") {
                $(ALERT_USU_NUEVO).html(ALERT_WARNING);
                $(ALERT_USU_NUEVO).show();
                return false;
            } else {
                $(ALERT_USU_NUEVO).hide();
            }
            /* Valida CIP */
            if(_validateField("http://localhost:8099/auth/existeCip","0",_cip)) {
                $("#ID_ALERTA_USUARIO").html(ALERT_CIP).show(); return false;
            }
            /* Valida NOMBRE DE USUARIO */
            if(_validateField("http://localhost:8099/auth/existeNombreUsuario","0",_usuario)) {
                $("#ID_ALERTA_USUARIO").html(ALERT_USER).show(); return false;
            }
            /* Validar formato */
            if(!_validateEmail(_elementById('ID_USU_CORREO'))) {
                console.log();
                $("#ID_ALERTA_USUARIO").html(ALERT_EMAIL_VAL).show(); return false;
            }
            /* Valida CORREO */
            if(_validateField("http://localhost:8099/auth/existeEmail","0",_correo)) {
                $("#ID_ALERTA_USUARIO").html(ALERT_EMAIL).show(); return false;
            }
            
            $(ALERT_USU_NUEVO).html();            
            $.ajax({
                "url": "http://localhost:8099/auth/nuevo",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "nombre": _nombre,
                    "nombreUsuario": _usuario,
                    "cipUsuario": _cip,
                    "codUnidad": _unidad,
                    "email": _correo,
                    "password": _clave,
                    "fLdap":"0",
                    "roles": [_rol]
                })
            })
            .done(function (response) { 
                let _response = JSON.stringify(response);
                let abc = JSON.parse(_response);
                $("#ID_SEND_USUARIO").html(ALERT_SUCCESS);
                $("#ID_SEND_USUARIO").show();
                $('#ID_Modal_USUARIO').modal('hide');
                _listarUsuario();
            })
            .fail(function(msg) {
                $("#ID_SEND_USUARIO").html(ALERT_ERROR);
            })
            .always(function(jqXHR,textStatus) {
                _medidasProteccion_CTRL(_cip, "Nuevo Usuario");
                setTimeout(function() {
                    $("#ID_SEND_USUARIO").hide();
                }, 3000);

            });            
        } catch(error) {
            console.error(`ID_USU_NUE_GUARDAR: ${error.name} - ${error.message}`);
        }
    });

    /* Guarda la medidas de progteccion accedidas */
    let _medidasProteccion_CTRL = function(_codigoDenuncia,_accion) {
        try { 
            const OPTIONS = {
                year:'numeric',month:'numeric',day:'numeric',
                hour:'2-digit',hour12:false,minute:'2-digit',second:'2-digit'
            };
            let nowDate = new Date();
            nowDate = nowDate.toLocaleDateString("es-PE", OPTIONS).replace(",","");
            $.ajax({
                "url": "http://localhost:8099/ctrlAcceso/create",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "usuario": USUARIO_CIP,
                    "jurisdiccionAsig": USUARIO_SID,
                    "audfecacc": nowDate,
                    "audfecout": nowDate,
                    "audip": USUARIO_IP,
                    "audnompc": USUARIO_PC,
                    "audaccion": _accion,
                    "audqrydenuncia": _codigoDenuncia
                }),
            }).done(function (response) {
                try {
                    
                } catch(error) {
                    console.error(`_medidasProteccion_CTRL .donde: ${error.name} - ${error.message}`);
                }
            }).fail(function(msg) {
                console.error(`ERROR: ${msg}`);
            });
        } catch (error) {
            console.error(`_medidasProteccion_CTRL: ${error.name} - ${error.message}`);
        }
    };
    
    /* Guardar USUARIO */
    /* Ramos */
    _elementById("ID_USU_EDI_GUARDAR").addEventListener('click', function() {
        try {
            const ALERT_WARNING = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>(*)ADVERTENCIA</strong>. Campo obligatorio.</div>`;
            const ALERT_ERROR = `<hr>
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong> al actualizar.</div>`;
            const ALERT_CIP = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. CIP existente.</div>`;
            const ALERT_USER = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Usuario existente.</div>`;
            const ALERT_EMAIL = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Correo existente.</div>`;
            const ALERT_EMAIL_VAL = `<hr>
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong>. Correo inválido.</div>`;
            const ALERT_SUCCESS = `<hr>
                <div class="alert alert-success" role="alert">
                <strong>USUARIO ACTUALIZADO</strong>. Proceso finalizado.</div>`;

            let _cip    = $("#ID_USU_EDI_CIP").val();
            let _nombre = $("#ID_USU_EDI_NOMBRE").val();
            let _unidad = $("#ID_USU_EDI_UNIDAD").val();
            let _rol    = $("#ID_USU_EDI_TIPO").val();
            let _usuario= $("#ID_USU_EDI_USUARIO").val();
            let _correo = $("#ID_USU_EDI_CORREO").val();
            let _clave  = $("#ID_USU_EDI_CLAVE").val();
            let _fldap  = ".";

            if(_cip == "" || _nombre == "" || _unidad == "" || _rol == "" || _usuario == "" || _correo == "") {
                $(ALERT_USU_EDITAR).html(ALERT_WARNING);
                $(ALERT_USU_EDITAR).show();
                return false;
            } else {
                $(ALERT_USU_EDITAR).hide();
            }
            
            let _id = $("#ID_USU_EDI_ID").val();

            /* Valida CIP */
            if(_validateField("http://localhost:8099/auth/existeCip",_id,_cip)) {
                $("#ID_ALERTA_EDI_USUARIO").html(ALERT_CIP).show(); return false;
            }
            /* Valida NOMBRE DE USUARIO */
            if(_validateField("http://localhost:8099/auth/existeNombreUsuario",_id,_usuario)) {
                $("#ID_ALERTA_EDI_USUARIO").html(ALERT_USER).show(); return false;
            }
            /* Validar formato */
            if(!_validateEmail(_elementById('ID_USU_EDI_CORREO'))) {
                $("#ID_ALERTA_EDI_USUARIO").html(ALERT_EMAIL_VAL).show(); return false;
            }
            /* Valida CORREO */
            if(_validateField("http://localhost:8099/auth/existeEmail",_id,_correo)) {
                $("#ID_ALERTA_EDI_USUARIO").html(ALERT_EMAIL).show(); return false;
            }

            _clave =_clave.trim();
            _clave = _clave?_clave: ".";
            
            $("#ID_ALERTA_EDI_USUARIO").html();
            $.ajax({
                "url": `http://localhost:8099/auth/actualiza/${_id}`,
                "method": "PUT",
                "timeout": 0,
                "headers": { "Content-Type": "application/json" },
                "data": JSON.stringify({
                    "nombre":_nombre,
                    "nombreUsuario":_usuario,
                    "cipUsuario":_cip,
                    "codUnidad":_unidad,
                    "email":_correo,
                    "password": _clave,
                    "roles":[_rol],
                    "fLdap":_fldap
                }),
            })
            .done(function (response) {
                $("#ID_SEND_USUARIO").html(ALERT_SUCCESS);
                $("#ID_SEND_USUARIO").show();
                $('#ID_Modal_EDI_USUARIO').modal('hide');
                _listarUsuario();
            })
            .fail(function(msg) {
                $("#ID_SEND_USUARIO").html(ALERT_ERROR);
                $("#ID_SEND_USUARIO").show();
            })
            .always(function(jqXHR,textStatus) {
                _medidasProteccion_CTRL(_cip, "Editar Usuario");
                setTimeout(function() { $("#ID_SEND_USUARIO").hide(); }, 5000);
            });
        } catch(error) {
            console.error(`ID_USU_EDI_GUARDAR: ${error.name} - ${error.message}`);
        }
    });
   
    let _formUsuario = function () {
        try {
            $(ALERT_USU_NUEVO).html('');
            $("#ID_USU_CIP").val('');
            $("#ID_USU_NOMBRE").val('');
            $("#ID_USU_UNIDAD").val('');
            $("#ID_USU_ROL").val('');
            $("#ID_USU_USUARIO").val('');
            $("#ID_USU_CORREO").val('');
            $("#ID_USU_CLAVE").val('');
        } catch(error) {
            console.error(`_formUsuario - show.bs.modal: ${error.name} - ${error.message}`);
        }
    };

    _elementById("ID_USU_NUE_LIMPIAR").addEventListener('click', function() {
        try {
            _formUsuario();
        } catch(error) {
            console.error(`ID_USU_NUE_LIMPIAR: ${error.name} - ${error.message}`);
        }
    });

    $('#ID_Modal_USUARIO').on('show.bs.modal', function() {
        _formUsuario();
    });

    let _formEdiUsuario = function () {
        try {
            $(ALERT_USU_EDITAR).html('');
            $("#ID_USU_EDI_CIP").val('');
            $("#ID_USU_EDI_NOMBRE").val('');
            $("#ID_USU_EDI_UNIDAD").val('');
            $("#ID_USU_EDI_ROL").val('');
            $("#ID_USU_EDI_USUARIO").val('');
            $("#ID_USU_EDI_CORREO").val('');
            $("#ID_USU_EDI_CLAVE").val('');
        } catch(error) {
            console.error(`_formEdiUsuario - show.bs.modal: ${error.name} - ${error.message}`);
        }
    };

    /*
    _elementById("ID_USU_EDI_LIMPIAR").addEventListener('click', function() {
        try {
            _formEdiUsuario();
        } catch(error) {
            console.error(`ID_USU_EDI_LIMPIAR: ${error.name} - ${error.message}`);
        }
    });
    */

    $('#ID_Modal_EDI_USUARIO').on('show.bs.modal', function(_this) {
        try {
            _formEdiUsuario();
            let _id = $(_this.relatedTarget).data().id;
            $("#ID_USU_EDI_ID").val(_id);
            var settings = {
                "url": `http://localhost:8099/auth/buscaxId/${_id}`,
                "method": "GET",
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            };
            
            $.ajax(settings).done(function (response) {
                let _eval = eval(`([${response}])`);
                let _data = _eval[0].data;
                let _rol = _data["roles"].length > 1?"admin": "user";
                $("#ID_USU_EDI_CIP").val(_data["cipUsuario"]);
                $("#ID_USU_EDI_NOMBRE").val(_data["nombre"]);
                $("#ID_USU_EDI_UNIDAD").val(_data["codUnidad"]);
                $("#ID_USU_EDI_TIPO").val(_rol);
                $("#ID_USU_EDI_USUARIO").val(_data["nombreUsuario"]);
                $("#ID_USU_EDI_CORREO").val(_data["email"]);
                $("#ID_USU_EDI_CLAVE").val(_data["password"]);
                $("#ID_USU_EDI_FLDAP").val(_data["fLdap"]);
            });
        } catch(error) {
            console.error(`ID_Modal_EDI_USUARIO: ${error.name} - ${error.message}`);
        } 
    });

    $('#ID_Modal_DEL_USUARIO').on('show.bs.modal', function(_this) {
        try {
            $("#ID_USU_DEL_ID").val('');
            let _id = $(_this.relatedTarget).data().id;
            $("#ID_USU_DEL_ID").val(_id);
        } catch(error) {
            console.error(`ID_Modal_DEL_USUARIO: ${error.name} - ${error.message}`);
        } 
    });

    _elementById("ID_USU_DEL_GUARDAR").addEventListener('click', function() {
        try {
            let _idUsuario = $("#ID_USU_DEL_ID").val();
            $.ajax({
                "url": `http://localhost:8099/auth/elimina/${_idUsuario}`,
                "method": "PUT",
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            }).done(function (response) {
                _medidasProteccion_CTRL(_idUsuario, "Eliminar Usuario");
                /*let _eval = eval(`([${response}])`);
                let _data = _eval[0].data;*/
                $("#ID_Modal_DEL_USUARIO").modal('hide');
                _listarUsuario();
            });            
        } catch(error) {
            console.error(`ID_USU_DEL_GUARDAR: ${error.name} - ${error.message}`);
        }
    });

    /* Tabla - ROL
    let _datatableRoles = function() {
        try {
            TB_ROL = $('#ID_TB_ROL').DataTable({
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
                pageLength: 5,
                paging: false,
                searching: false,
                columnDefs: [
                    {
                        render: function (data, type, row) {
                            return `
                                <button type='button' class='btn btn-xs btn-primary' data-toggle='modal' data-target='#ID_Modal_EDI_ROL' role="tab">
                                    <i class="fa fa-edit"></i> Editar
                                </button>`;
                        },
                        orderable: false,
                        className: 'dt-center',
                        width: "95px",
                        targets: 3
                    }
                ],    
            });
        } catch(error) {
            console.error(`_datatableRoles: ${error.name} - ${error.message}`);
        } 
    }
    _datatableRoles();
    */

    /* Listar ROL
    let _listarRol = function() {
        try {
            TB_ROL.clear().draw();
            const ALERT_ERROR = `
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                    <strong>Error</strong> al registrar
                </div>`;
            $.ajax({
                "url": "",
                "method": "GET",
                "timeout": 0,
                "headers": { "Content-Type": "application/json" }
            })
            .done(function (response) {
                try {
                    response.forEach((item,index) => {
                        TB_ROL.row.add([
                            index + 1,
                            '',
                            '',
                            'ID'
                        ]).draw(false);
                    });
                } catch(error) {
                    $("#ID_SEND_ROL").html(ALERT_ERROR);
                    $("#ID_SEND_ROL").show();
                    console.error(`_listarRol .done : ${error.name} - ${error.message}`);
                }
            })
            .fail(function(msg) {
                $("#ID_SEND_ROL").html(ALERT_ERROR);
                $("#ID_SEND_ROL").show();
            })
            .always(function(jqXHR, textStatus) {
                setTimeout(function() {
                    $("#ID_SEND_ROL").hide();
                }, 3000);
            });
        } catch(error) {
            console.error(`_listarRol: ${error.name} - ${error.message}`);
        }
    };
    _listarRol();
    */

    /*
    _elementById("ID_LIST_ROL").addEventListener("click", function() {
        try {
            _listarRol();
        } catch(error) {
            console.error(`ID_LIST_ROL: ${error.name} - ${error.message}`);
        }
    });
    */
    
    /* Guardar ROL */
    let _guardarRol= function() {
        try {
            const ALERT_WARNING = `
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                    <strong>(*)</strong> campo obligatorio.
                </div>`;
            const ALERT_ERROR = `
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                    <strong>Error</strong> al registrar
                </div>`;
            const ALERT_SUCCESS = `
                <div class="alert alert-success" role="alert">
                    This is a success alert—check it out!
                </div>`;
            let _nombre = $("#ID_ROL_NOMBRE").val();
            let _tipo = $("#ID_ROL_TIPO").val();

            if(_nombre == "" || _tipo == "") {
                $("#ID_ALERTA_ROL").html(ALERT_WARNING);
                $("#ID_ALERTA_ROL").show();
                return false;
            } else {
                $("#ID_ALERTA_ROL").hide();
            }

            $("#ID_ALERTA_ROL").html("");            
            /* TABLA */
            $.ajax({
                "url": "",
                "method": "POST",
                "timeout": 0,
                "headers": { "Content-Type": "application/json" },
                "data": JSON.stringify({
                    "nombre": _nombre,
                    "tipo": _tipo,
                }),
            }).done(function (response) {
                /* FALTA VALIDAR CODIGO DE REGRESO */
                if(response == "1") {
                    $("#ID_SEND_ROL").html(ALERT_SUCCESS);
                    _listarUsuario();
                } else {
                    $("#ID_SEND_ROL").html(ALERT_ERROR);
                }
            }).fail(function(msg) {
                $("#ID_SEND_ROL").html(ALERT_ERROR);
            }).always(function(jqXHR,textStatus) {
                setTimeout(function() { $("#ID_SEND_ROL").hide(); }, 3000);
            });
        } catch(error) {
            console.error(`_guardarRol: ${error.name} - ${error.message}`);
        }
    };

    /* Editar ROL */
    let _guardarEditarRol= function() {
        try {
            const ALERT_WARNING = `
                <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                    <strong>(*)</strong> campo obligatorio.
                </div>`;
            const ALERT_ERROR = `
                <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                    <strong>Error</strong> al registrar
                </div>`;
            const ALERT_SUCCESS = `
                <div class="alert alert-success" role="alert">
                    This is a success alert—check it out!
                </div>`;
            let _nombre = $("#ID_ROL_NOMBRE").val();
            let _tipo = $("#ID_ROL_TIPO").val();

            if(_nombre == "" || _tipo == "") {
                $("#ID_ALERTA_EDI_ROL").html(ALERT_WARNING);
                $("#ID_ALERTA_EDI_ROL").show();
                return false;
            } else {
                $("#ID_ALERTA_EDI_ROL").hide();
            }

            $("#ID_ALERTA_EDI_ROL").html("");            
            /* TABLA */
            $.ajax({
                "url": "",
                "method": "POST",
                "timeout": 0,
                "headers": { "Content-Type": "application/json" },
                "data": JSON.stringify({
                    "nombre": _nombre,
                    "tipo": _tipo,
                }),
            })
            .done(function (response) {
                console.log(response);
                /* FALTA VALIDAR CODIGO DE REGRESO */
                if(response == "1") {
                    $("#ID_SEND_ROL").html(ALERT_SUCCESS);
                    _listarUsuario();
                } else {
                    $("#ID_SEND_ROL").html(ALERT_ERROR);
                }
            })
            .fail(function(msg) {
                $("#ID_SEND_ROL").html(ALERT_ERROR);
            })
            .always(function(jqXHR,textStatus) {
                setTimeout(function() { $("#ID_SEND_ROL").hide(); }, 3000);
            });
        } catch(error) {
            console.error(`_guardarRol: ${error.name} - ${error.message}`);
        }
    };

    let _formRol = function () {
        try {
            $("#ID_ALERTA_ROL").html("");
            $("#ID_ROL_NOMBRE").val("");
            $("#ID_ROL_TIPO").val("");
        } catch(error) {
            console.error(`_formRol - show.bs.modal: ${error.name} - ${error.message}`);
        }
    };
    let _limpiarRol = function() { 
        _formRol();
    }
    $('#ID_Modal_ROL').on('show.bs.modal', function() {
        _formRol();
    });

    let _formEdiRol = function () {
        try {
            $("#ID_ALERTA_EDI_ROL").html("");
            $("#ID_ROL_EDI_NOMBRE").val("");
            $("#ID_ROL_EDI_TIPO").val("");
        } catch(error) {
            console.error(`_formEdiRol - show.bs.modal: ${error.name} - ${error.message}`);
        }
    };
    let _limpiarEditarRol = function() { _formEdiRol(); }
    $('#ID_Modal_EDI_ROL').on('show.bs.modal', function() {
        _formEdiRol();
    });
});