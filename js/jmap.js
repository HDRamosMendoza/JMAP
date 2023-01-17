/* DENUNCIA */
const LYR_ID_DENUN = 16;
/* JURISDICCION */
const LYR_ID_JURID = 6;
/* GRAFICOS */
const LYR_ID_VISIT = 21;
const LYR_ID_RIESG = 20;
const LYR_ID_VIOLE = 19;
const LYR_ID_PROTE = 17;
/* LOCAL STORAGE */
const TOKEN       = Window.localStorage.getItem("token");
const USUARIO_NOMBRE = Window.localStorage.getItem("usuNombre");
const USUARIO_CIP = Window.localStorage.getItem("usuCipUsuario");
const USUARIO_COD = Window.localStorage.getItem("usuCodUnidad");
const USUARIO_ROL = Window.localStorage.getItem("usuRol");
const USUARIO_SID = Window.localStorage.getItem("usuCodSidPol");
const USUARIO_PNP = Window.localStorage.getItem("usuUnidadPNP");
let TB_DENUNCIAS;

let isSearching = false;

let _validateLocal = function() {
    try {
        if(TOKEN == "" || TOKEN === null || typeof TOKEN === undefined) {
            window.location.href = "./login.html";
        }
    } catch(error) {
        console.error(`_validateLocal: ${error.name} - ${error.message}`);
    }     
}
_validateLocal();

let _close = function() {
    TOKEN = "";
    localStorage.clear();
    _validateLocal();
}

let _zoomExtent = function(box){
    try {
        let [nex,ney,swx,swy] = box;
        JMap.Map.zoomToRect({ 
            ne:{ x:nex, y:ney },
            sw:{ x:swx, y:swy }
        });
    } catch(error) {
        console.error(`_zoomExtent: ${error.name} - ${error.message}`);
    }
}

/* Valida un ID */
let _elementById = function(paramId) {
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

let _zoomPoint = function(nex,ney){
    try {
        JMap.Map.panAndZoomTo({ x:nex, y:ney }, 19);
    } catch(error) {
        console.error(`_zoomExtent: ${error.name} - ${error.message}`);
    }
}

let _usuario = function(_data) {
    try {
        _elementById("ID_Usuario").innerText = _data || 'Error';	    
	} catch(error) {
  		console.error(`_usuario: ${error.name} - ${error.message}`);
	}
};
_usuario(USUARIO_NOMBRE);

let _jurisdiccion = function(_data) {
    try {
        _elementById("ID_CodigoJurisdiccion").innerText = _data || 'Error';
	} catch(error) {
  		console.error(`_jurisdiccion: ${error.name} - ${error.message}`);
	}
};
_jurisdiccion(USUARIO_SID);

let _comisaria = function(_data) {
    try {
        _elementById("ID_Comisaria").innerText = _data || 'Error';
	} catch(error) {
  		console.error(`_comisaria: ${error.name} - ${error.message}`);
	}
};
_comisaria(USUARIO_PNP);

window.medidasProteccion = (_cod) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_PROTE)) {
        JMap.Layer.setSelectabilityById(LYR_ID_PROTE, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_PROTE,
            attributeName: "COD_COMI_CPNP",
            attributeValue: _cod,
            showMapPopup: true
        })
        .then(features => {
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_PROTE]);
            } else {
                /*
                let _count = 0;
                features.forEach(elem => {
                    if(elem.properties["VW_01_GEO_MEDIDAS_PROTECCION.F_MEDIDAS_PROTECCION"] == 1){
                        _count = _count + 1;
                    }
                });
                let _porcentaje = Math.round((_count/features.length)*100);
                chartPie.data.datasets[0].data = [(100-_porcentaje),_porcentaje];
                chartPie.data.labels = ["Sin medidas","Con medidas"];
                chartPie.update();
                */
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_PROTE, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            console.error(`medidasProteccion: ${error.name} - ${error.message}`);
        });
};

window.tipoViolencia = (_cod) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_VIOLE)) {
        JMap.Layer.setSelectabilityById(LYR_ID_VIOLE, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_VIOLE,
            attributeName: "COD_COMI_CPNP",
            attributeValue: _cod,
            showMapPopup: true
        })
        .then(features => {
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_VIOLE]);
            } else {
                console.log(features);
                /*
                features.forEach((element,index) => {
                });
                */
                /*
                _data = [46,40,8,6];
                _labels = ["Fisica","Psicologica","Sexual","Economica / Pat"];

                chartPie.data.datasets[0].data = _data;
                chartPie.data.labels = _labels;
                chartPie.update();
                */
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_VIOLE, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            console.error(`tipoViolencia: ${error.name} - ${error.message}`);
        });
};

window.nivelRiesgo = (_cod) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_RIESG)) {
        JMap.Layer.setSelectabilityById(LYR_ID_RIESG, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_RIESG,
            attributeName: "cod_cpnp",
            attributeValue: _cod,
            showMapPopup: true
        })
        .then(features => {
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_RIESG]);
            } else {
                console.log(features);
                /*
                features.forEach((element,index) => {
                    
                });
                */
               /*
                _data = [51,40,9];            
                _labels = ["Bajo", "Leve", "Severo"];
                chartPie.data.datasets[0].data = _data;
                chartPie.data.labels = _labels;
                chartPie.update();*/
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_RIESG, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            console.error(`nivelRiesgo: ${error.name} - ${error.message}`);
        });
};

window.denuncias = (_cod) => {
    moment().format('DD/MM/yyyy');
    //isSearching = true;
    //console.log(JMap.Layer.isSelectableById(LYR_ID_DENUN));
    if (!JMap.Layer.isSelectableById(LYR_ID_DENUN)) {
        JMap.Layer.setSelectabilityById(LYR_ID_DENUN, true);
    }
    console.log(_cod);
    console.log(LYR_ID_DENUN);
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_DENUN,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: "16869",
            showMapPopup: false
        })
        .then(features => {
            isSearching = false;
            TB_DENUNCIAS.clear().draw();
            console.log(features.length);
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_DENUN]);
            } else {
                console.log(features);
                const _tbDen = "TM_DENUNCIAS_SIDPOL_L30364";
                features.forEach((element,index) => {
                    TB_DENUNCIAS.row.add([
                        (index + 1),
                        element.geometry.coordinates,
                        element.properties[`${_tbDen}.ID_DENUNCIA_SIDPOL_L30364`],
                        element.properties[`${_tbDen}.ID_DENUNCIA_SIDPOL_L30364`],
                      
                        element.properties[`${_tbDen}.COMISARIA`],                        
                        //element.properties["${_tbDen}.modalidad"],
                        //element.properties["${_tbDen}.sub_tipo"],
                        element.properties[`${_tbDen}.REGION`],
                        element.properties[`${_tbDen}.LIBRO`],

                        element.properties[`${_tbDen}.TIPO_DOC_DENUNCIA`],
                        element.properties[`${_tbDen}.DPTO_DENUNCIA`],
                        element.properties[`${_tbDen}.PROV_DENUNCIA`],
                        element.properties[`${_tbDen}.DIST_DENUNCIA`],
                        element.properties[`${_tbDen}.UBIGEO_DENUNCIA`],
                        element.properties[`${_tbDen}.DIRECCION_DENUNCIA`],
                        new Date(element.properties[`${_tbDen}.FECHA_REGISTRO_DENUNCIA`]).toLocaleDateString(),

                        element.properties[`${_tbDen}.ID_DENUNCIA_SIDPOL_L30364`],
                        element.properties[`${_tbDen}.DPTO_HECHO`],
                        element.properties[`${_tbDen}.PROV_HECHO`],
                        element.properties[`${_tbDen}.DIST_HECHO`],
                        element.properties[`${_tbDen}.UBIGEO_HECHO`],
                        new Date(element.properties[`${_tbDen}.FECHA_REGISTRO_HECHO`]).toLocaleDateString(),
                        
                        element.properties[`${_tbDen}.F_MEDIDAS_PROTECCION`], /* Ocultar */
                        element.properties[`${_tbDen}.F_GEOREFERENCIACION`], /* Ocultar */
                        element.properties[`${_tbDen}.CANT_VISITAS_PNP`], /* Ocultar */
                    ]).draw(false);
                });
                
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_DENUN, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            isSearching = false;
            TB_DENUNCIAS.clear().draw();
            console.error(`TB_DENUNCIAS: ${error.name} - ${error.message}`);
        });
};

window.visitas = (_cod) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_VISIT)) {
        JMap.Layer.setSelectabilityById(LYR_ID_VISIT, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_VISIT,
            attributeName: "ID_DENUNCIA_SIDPOL",
            attributeValue: _cod,
            showMapPopup: true
        })
        .then(features => {
            console.log("ENTRO");
            /* TB_VISITAS.clear().draw(); */
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_VISIT]);
            } 
            /*else {
                features.forEach((item,index) => {
                    TB_VISITAS.row.add([
                        index + 1,
                        [item.properties["TG_VISITAS_PNP.UBI_LONG_X"],item.properties["TG_VISITAS_PNP.UBI_LAT_Y"]],
                        item.properties["TG_VISITAS_PNP.FECHA_VISITA"],
                        item.properties["TG_VISITAS_PNP.DOC_REF_PNP"],
                        item.properties["TG_VISITAS_PNP.HECHOS_ADVERTIDOS"],
                        item.properties["TG_VISITAS_PNP.F_PRESENCIA_VICTIMA"],
                        item.properties["TG_VISITAS_PNP.F_PRESENCIA_MENORES"]
                    ]).draw(false);
                });
            }*/
            JMap.Map.Selection.setLayerSelection(LYR_ID_VISIT, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            isSearching = false;
            /* TB_VISITAS.clear().draw(); */
            console.error(`TB_VISITAS: ${error.name} - ${error.message}`);
        });
};
window.search = (_codigo) => {
    isSearching = true;
    if (!JMap.Layer.isSelectableById(LYR_ID_JURID)) {
        JMap.Layer.setSelectabilityById(LYR_ID_JURID, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_JURID,
            attributeName: "COD_CPNP",
            attributeValue: _codigo,
            showMapPopup: true
        })
        .then(features => {
            isSearching = false;
            if(features.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_JURID]);
            } else  {
                _zoomExtent(features[0].bbox);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_JURID, features);
            JMap.Map.fitFeatures(features);
            window.denuncias(_codigo);
        })
        .catch(error => {
            isSearching = false;
            console.error(`JURISDICCION: ${error.name} - ${error.message}`);
        });
};
window.JMAP_OPTIONS = {
    projectId: 7,
    restBaseUrl: "http://172.31.0.48/services/rest/v2.0",
    anonymous: true,
    map: {
      zoom: 4,
      center: {
        x: -76.0000000,
        y: -10.0000000
      },
      scaleControlVisible: true,
      scaleControlPosition: "bottom-left",
      onStartupMapReadyFn: map => {
        try {      
            window.search(USUARIO_SID);
        } catch(error) {
            console.error(`onStartupMapReadyFn: ${error.name} - ${error.message}`);
        }
      }
    },
    hideMainLayout: true,
    application: {
      containerId: "my-custom-app"
    }
}
/* 1541,1546,1012 */




/*

let _tabDesactive = function(node) {
	try {
    	for (let i = 0; i < node.length; i++) {
			_elementById(node[i].id + "_TAB").style.display = "none";
    	}
    } catch(error) {
  		console.error(`
  			_tabDesactive: ${error.name} - ${error.message}.
  		`);
	}
};

let _tabActive = function() {
	try {
    	const nodeCheckboxTabs = document.querySelectorAll(`
    		.scroll-menu input[name='tabs']
    	`);
    	for(let i = 0; i<nodeCheckboxTabs.length; i++){
    		nodeCheckboxTabs[i].addEventListener('click', function(){
    			_tabDesactive(nodeCheckboxTabs);
    			let id = this.id;
            	_elementById(id).click();
                _elementById(id + "_TAB").style.display = "block";
        	});
        }
    } catch(error) {
  		console.error(`
  			_tabActive: ${error.name} - ${error.message}.
  		`);
	}
};

_tabActive();
document.getElementById('Tab-1').click();

*/

TB_DENUNCIAS = $('#ID_TB_DENUNCIAS').DataTable({
    language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
    pageLength: 5,
    scrollX: true,
    search: { return: true },        
    columnDefs: [
        {
            render: function (data, type, row) {
                let _status = "";                    
                if(row[21] === null || row[21] === 0) {
                    _status = "disabled"; /* F_GEOREFENCIACION */                        
                }
                return "<button type='button' class='btn btn-xs btn-zoom btn-info' onclick=\"_zoomPoint(" + data.toString() + ")\" " + _status + "></button>";
            }, /* Zoom */
            orderable: false,
            className: 'dt-center',
            width: "25px",
            targets: 1
        },{
            render: function (data, type, row) {
                let _status = "";                    
                if(row[20] === null || row[20] === 0) {
                    _status = "disabled"; /* F_MEDIDAS_PROTECCION */
                }
                return "<button type='button' class='btn btn-xs btn-general btn-secondary' data-toggle='modal' data-target='#ID_Modal_Detalle' data-codigo='" + data + "' " + _status + "><i class='fa fa-bars'></i></button>";
            }, /* Detalle */
            orderable: false,
            className: 'dt-center',
            width: "25px",
            targets: 2
        },{
            render: function (data, type, row) {
                let _status = "";                    
                //if(row[22] === null || row[22] === 0) {
                    //_status = "disabled"; /* CANT_VISITAS_PNP */
                //}
                return `
                    <button type='button' class='btn btn-xs btn-visita btn-secondary' data-toggle='modal' data-target='#ID_Modal_Visitas' data-codigo='${data}' ${_status}></button>
                    <button type='button' class='btn btn-xs btn-general btn-secondary' data-toggle='modal' data-target='#ID_Modal_VisitasPunto' data-codigo='${data}' ${_status} title='Agregar Visita'><i class='fa fa-bullseye' aria-hidden='true'></i></button>
                `;
            },/* Visita */
            orderable: false,
            className: 'dt-center',
            width: "60px",
            targets: 14
        },{
            target: 20, /* F_MEDIDAS_PROTECCION */
            visible: false,
            searchable: false,
        },{
            target: 21, /* F_F_GEOREFERENCIACION */
            visible: false,
            searchable: false,
        },{
            target: 22, /* CANT_VISITAS_PNP */
            visible: false,
            searchable: false,
        }
    ]
   
}); 