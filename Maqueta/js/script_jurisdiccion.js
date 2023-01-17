$(document).ready(function () {
    /* LOCAL STORAGE */
    const TOKEN_PNP      = JSON.parse(localStorage.getItem("token_pnp"));
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
            if(id !== null && id !== undefined) {
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

});