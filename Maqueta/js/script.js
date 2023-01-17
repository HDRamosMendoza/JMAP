const LYR_ID_DEPAR = 1;  /* LÍMITE Departamento */
const LYR_ID_PROVI = 2;  /* LÍMITE Provincia */
const LYR_ID_DISTR = 3;  /* LÍMITE Distrito */
const LYR_ID_JURID = 6;  /* Jurisdiccion PNP */
const LYR_ID_DENUN = 16; /* Denuncia */
const LYR_ID_CONCE = 18; /* Concentración de Denuncias */
const LYR_ID_PROTE = 17; /* GRAFICO Otorgamiento de Medidas de Proteccion */
const LYR_ID_VIOLE = 19; /* GRAFICO Tipificacion de Violencia */
const LYR_ID_RIESG = 20; /* GRAFICO Niveles de Riesgo */
const LYR_ID_VISIT = 21; /* GRAFICO Número de Visistas PNP */
const LYR_ID_VICTI = 7;  /* Visitas de Victimas por PNP */
const LYR_ID_COMIS = 22; /* Comisarias PNP */
const LYR = [1,2,3,6,7,16,17,18,19,20,21,22]; /* All Layer */
/* LOCAL STORAGE */
let TOKEN_PNP            = JSON.parse(localStorage.getItem("token_pnp"));
const USUARIO_NOMBRE = localStorage.getItem("usuNombre");
const USUARIO_CIP    = localStorage.getItem("usuCipUsuario");
const USUARIO_COD    = localStorage.getItem("usuCodUnidad");
const USUARIO_ROL    = JSON.parse(localStorage.getItem("usuRol"));
const USUARIO_IP     = localStorage.getItem("usuIP");
const USUARIO_PC     = "";
const USUARIO_SID    = localStorage.getItem("usuCodComi");
const USUARIO_PNP    = localStorage.getItem("usuUnidadPNP");
const USUARIO_ARR    = USUARIO_ROL!== null? USUARIO_ROL.map(item=>item.rolNombre) : "";
let TB_DENUNCIAS = null, TB_VISITAS = null;
let _bbox = null;

$('#ID_TB_BUSCAR').on('click', function() {
    try {
        let _data = $('#ID_BTN_DATO').val();
        TB_DENUNCIAS.search(_data).draw(false);
    } catch(error) {
        console.error(`ID_TB_BUSCAR': ${error.name} - ${error.message}`);
    }
});

$('#ID_TB_LIMPIAR').on('click', function() {
    try {
        $('#ID_BTN_DATO').val("");
        TB_DENUNCIAS.search("").draw(false);
    } catch(error) {
        console.error(`ID_TB_LIMPIAR: ${error.name} - ${error.message}`);
    }
});

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

/* Oculta toda las capas */
let _allLayer = function(_lyr) {
    try {
        _lyr.map(item => {
            JMap.Layer.setVisible(item, false);
        });
    } catch(error) {
        console.error(`_allLayer': ${error.name} - ${error.message}`);
    }
};
/* Grupo de Activar Tematica */
let _contentSelect = function() {
    try {
        let _as = _elementById("ID_ACTIVAR_TEMATICA").checked;
        _elementById("ID_CONTENT").style.display = _as? "block":"none";
    } catch(error) {
        console.error(`_contentSelect: ${error.name} - ${error.message}`);
    }
};
_contentSelect();
/* Tabla de Denuncias */
let _datatableDenuncias = function() {
    try {
        TB_DENUNCIAS = $('#ID_TB_DENUNCIAS').DataTable({
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
            pageLength: 4,
            scrollX: true,
            search: { return: true },        
            columnDefs: [
                {
                    render: function (data, type, row) {
                        let [_longitud,_latitud,_fGeoreferenciacion] = data;
                        let _status = _fGeoreferenciacion == "1" ? "":"disabled";
                        return `<button type='button' class='btn btn-sm btn-general ${_fGeoreferenciacion == "1" ? "btn-warning":"btn-secondary"}' data-ramos="${_fGeoreferenciacion}" onclick='_zoomPoint(${_longitud},${_latitud})' ${_status} title='Acercamiento'><i class='fa fa-search-plus'></i></button>`;
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "25px",
                    targets: 1
                },{
                    render: function (data, type, row) {
                        let [_idDenuncia,_fMedidasProteccion] = data;
                        return `<button type='button' class='btn btn-sm btn-general ${_fMedidasProteccion=="1"?"btn-warning":"btn-secondary"}' data-codigo='${_idDenuncia}' onclick='_medidaProteccion(this)' title='Medida de Protección'><i class='fa fa-bars'></i></button>`;
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "25px",
                    targets: 2
                },{
                    render: function (data, type, row) {
                        let [_idDenuncia,_cantVisitasPnp] = data;
                        return `
                            <button type='button' class='btn btn-sm btn-general ${_cantVisitasPnp>0?"btn-warning":"btn-secondary"}' data-codigo='${_idDenuncia}' onclick='_datatableVisitas(this)' title='RELACIÓN DE VISITAS PNP REALIZADAS'><i class='fa fa-user' aria-hidden='true'></i></button>
                            <button type='button' class='btn btn-sm btn-general btn-secondary' data-codigo='${_idDenuncia}' onclick='_visitasPunto(this)' title='AGREGAR VISITA PNP'><i class='fa fa-plus' aria-hidden='true'></i></button>
                        `;
                    },/* Visita */
                    orderable: false,
                    className: 'dt-center',
                    width: "60px",
                    targets: 14
                },{
                    target: 20, /* F_MEDIDAS_PROTECCION  19*/
                    visible: false,
                    searchable: false,
                },{
                    target: 21, /* F_GEOREFERENCIACION  20*/
                    visible: false,
                    searchable: false,
                },{
                    target: 22, /* CANT_VISITAS_PNP 21 */
                    visible: false,
                    searchable: false,
                }
            ]
        });
    } catch(error) {
        console.error(`_datatableDenuncias: ${error.name} - ${error.message}`);
    } 
};
_datatableDenuncias();
/* Liksta de Denuncias de la Jurisdiccion */
let _denunciaJurisdiccion = function(_jurisdiccion) {
    try {
        const ID_MED_PRO = "#Tab-2_TAB .tab-list";
        TB_DENUNCIAS.clear().draw();
        $.ajax({
            "async": true,
            "url": `http://localhost:8099/denuncia/lista/${_jurisdiccion}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                "Content-Type": "application/json"
            }
        }).done(function(_response) {
            if(_response.length > 0) {
                _response.forEach((element,index) => {
                    TB_DENUNCIAS.row.add([
                        (index + 1),
                        [element['ubiLongXHecho'],element['ubiLatYHecho'],element['fGeoreferenciacion']],
                        [element[`idDenuncia`],element['fMedidasProteccion']],
                        element[`idDenuncia`],
                        element[`comisaria`],
                        element[`region`],
                        element[`libro`],
                        element[`tipoDocDenuncia`],
                        element[`dptoDenuncia`],
                        element[`provDenuncia`],
                        element[`distDenuncia`],
                        element[`ubigeoDenuncia`],
                        element[`direccionDenuncia`],
                        new Date(element[`fechaRegistroDenuncia`]).toLocaleDateString(),

                        [element[`idDenuncia`],element['cantVisitasPnp']],
                        element[`dptoHecho`],
                        element[`provHecho`],
                        element[`distHecho`],
                        element[`ubigeoHecho`],
                        new Date(element[`fechaRegistroHecho`]).toLocaleDateString(),                        
                        element[`fMedidasProteccion`], /* Ocultar */
                        element[`fGeoreferenciacion`], /* Ocultar */
                        element[`cantVisitasPnp`], /* Ocultar */
                    ]).draw(false);
                });
            }
          }).fail(function(msg) {
            TB_DENUNCIAS.clear().draw();
            $(ID_MED_PRO).html(`<div class="alert alert-danger" role="alert">
                    <strong>Error</strong> al cargar la Información !
            </div>`);
            setTimeout(()=>{$(ID_MED_PRO).hide();},3000);
        });        
    } catch(error) {
        console.error(`_denunciaJurisdiccion: ${error.name} - ${error.message}`);
    }
};
/* OTORGAMIENTO DE MEDIDAS DE PROTECCION */
window.medidasProteccion = (_codigo) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_PROTE)) {
        JMap.Layer.setSelectabilityById(LYR_ID_PROTE, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_PROTE,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(_feature => {
            if(_feature.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_PROTE]);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_PROTE, _feature);
            JMap.Layer.setVisible(LYR_ID_PROTE, _elementById("ID_ACTIVAR_TEMATICA").checked);
            /*JMap.Map.fitFeatures(_feature);*/
        })
        .catch(error => {
            console.error(`: ${error.name} - ${error.message}`);
        });

    
};
/* TIPIFICACION DE VIOLENCIA */
window.tipificacionViolencia = (_codigo) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_VIOLE)) {
        JMap.Layer.setSelectabilityById(LYR_ID_VIOLE, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_VIOLE,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(_feature => {
            if(_feature.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_VIOLE]);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_VIOLE, _feature);
            /*JMap.Map.fitFeatures(_feature);*/
        })
        .catch(error => {
            console.error(`LYR_ID_VIOLE: ${error.name} - ${error.message}`);
        });
    JMap.Layer.setVisible(LYR_ID_VIOLE, _elementById("ID_ACTIVAR_TEMATICA").checked);
};

/* NIVELES DE RIESGO */
window.nivelesRiesgo = (_codigo) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_RIESG)) {
        JMap.Layer.setSelectabilityById(LYR_ID_RIESG, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_RIESG,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(_feature => {
            if(_feature.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_RIESG]);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_RIESG, _feature);
            /*JMap.Map.fitFeatures(_feature);*/
        })
        .catch(error => {
            console.error(`LYR_ID_RIESG: ${error.name} - ${error.message}`);
        });
    JMap.Layer.setVisible(LYR_ID_RIESG, _elementById("ID_ACTIVAR_TEMATICA").checked);
};

/* NÚMERO DE VIVISTAS PNP */
window.numeroVisitas = (_codigo) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_VISIT)) {
        JMap.Layer.setSelectabilityById(LYR_ID_VISIT, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_VISIT,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(_feature => {
            if(_feature.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_VISIT]);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_VISIT, _feature);
            /*JMap.Map.fitFeatures(_feature);*/
        })
        .catch(error => {
            console.error(`LYR_ID_VISIT: ${error.name} - ${error.message}`);
        });
    JMap.Layer.setVisible(LYR_ID_VISIT, _elementById("ID_ACTIVAR_TEMATICA").checked);
};

/* CONCENTRACION DE DENUNCIAS */
window.concentracionDenuncias = (_codigo) => {
    if (!JMap.Layer.isSelectableById(LYR_ID_CONCE)) {
        JMap.Layer.setSelectabilityById(LYR_ID_CONCE, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_CONCE,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(_feature => {
            if(_feature.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_CONCE]);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_CONCE, _feature);
            /*JMap.Map.fitFeatures(_feature);*/
            JMap.Layer.setVisible(LYR_ID_CONCE, false);
        })
        .catch(error => {
            console.error(`concentracionDenuncias: ${error.name} - ${error.message}`);
        });
};

/* DENUNCIAS */
window.denuncias = (_cod) => {
    //moment().format('DD/MM/yyyy');
    if (!JMap.Layer.isSelectableById(LYR_ID_DENUN)) {
        JMap.Layer.setSelectabilityById(LYR_ID_DENUN, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_DENUN,
            attributeName: "cod_cpnp",
            attributeValue: _cod,
            showMapPopup: false
        })
        .then(_features => {
            if(_features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_DENUN]);
            } else {
                //_denunciaJurisdiccion(_cod);
                window.concentracionDenuncias(_cod);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_DENUN, _features);
            //JMap.Map.fitFeatures(_features);
        })
        .catch(error => {
            console.error(`window.denuncias: ${error.name} - ${error.message}`);
        });
};

/* JURISDICCIÓN */
window.jurisdiccion = (_codigo) => {
    isSearching = true;
    if (!JMap.Layer.isSelectableById(LYR_ID_JURID)) {
        JMap.Layer.setSelectabilityById(LYR_ID_JURID, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_JURID,
            attributeName: "COD_CPNP",
            attributeValue: _codigo,
            showMapPopup: false
        })
        .then(features => {
            isSearching = false;
            if(features.length === 0) {
                JMap.Map.Selection.clearLayersSelection([LYR_ID_JURID]);
            } else  {
                _bbox = features[0].bbox;
                _zoomExtent(_bbox);
                window.denuncias(_codigo);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_JURID, features);
            JMap.Map.fitFeatures(features);
        })
        .catch(error => {
            isSearching = false;
            console.error(`JURISDICCION: ${error.name} - ${error.message}`);
        });
};

/* MAPA */
window.JMAP_OPTIONS = {
    projectId: 7,
    restBaseUrl: "http://172.31.0.48/services/rest/v2.0",
    anonymous: true,
    map: {
        zoom: 8,
        center: {x:-76.0000000,y:-10.0000000},
    },
    hideMainLayout: true,
    application: {
        containerId: "app-map",
        sidePanelInitialVisibility: false
    },
    onReady: () => {
        JMap.Event.Map.on.mapLoad("my-listener", () => {
            
            /*_allLayer(LYR);*/

            if(USUARIO_SID !== "null" && USUARIO_SID !== "" && USUARIO_SID !== null) {
                _activarTematica(_elementById("ID_ACTIVAR_TEMATICA").checked);

                // Defecto - Jurisdicción
                window.jurisdiccion(USUARIO_SID);
                
                // OTORGAMIENTO DE MEDIDAS DE PROTECCION
                window.medidasProteccion(USUARIO_SID);
                // TIPIFICACION DE VIOLENCIA
                window.tipificacionViolencia(USUARIO_SID);
                // NIVELES DE RIESGO
                window.nivelesRiesgo(USUARIO_SID);
                // NÚMERO DE VIVISTAS PNP
                window.numeroVisitas(USUARIO_SID);
                

                // Defecto - Gráfico
                const currentLayerVisibility = JMap.Layer.isVisible(LYR_ID_PROTE);
                JMap.Layer.setVisible(LYR_ID_PROTE, !currentLayerVisibility);
                // let circle = { ceter: { x: 10, y: 10 }, radius: 100000 }
                // JMap.Geometry.checkCircle(circle)

                if(USUARIO_SID !== "null" && USUARIO_SID !== null && USUARIO_SID !== "") {
                    _denunciaJurisdiccion(USUARIO_SID);
                }   

                
            }
        });
    }
}



/* Acercamiento al Extent */
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

let _zoomJurisdiccion = function() {
    try {
        _zoomExtent(_bbox);
    } catch(error) {
        console.error(`_zoomJurisdiccion ${error.name} - ${error.message}`);
    }
};

/* Oculta todos los TAG que esta asociado a cada pestaña */
let _tabDesactive = function(node) {
	try {
    	for (let i = 0; i < node.length; i++) {
			_elementById(node[i].id + "_TAB").style.display = "none";
    	}
    } catch(error) {
  		console.error(`_tabDesactive: ${error.name} - ${error.message}`);
	}
};

/* Activa TAG de la pestaña que se da clic */
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
  		console.error(`_tabActive: ${error.name} - ${error.message}`);
	}
};
_tabActive();
_elementById('Tab-1').click();
/* Activar Mapa de Calor */
_elementById("ID_CALOR").addEventListener("click", function() {
    try {
        JMap.Layer.setVisible(LYR_ID_CONCE, this.checked);
    } catch(error) {
        console.error(`ID_CALOR: ${error.name} - ${error.message}`);
    }
});
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
/* Elimina el TOKEN */
_elementById("ID_SALIR").addEventListener("click", function(){
    try {
        localStorage.removeItem("token_pnp");
        _validateLocal();
    } catch(error) {
        console.error(`ID_SALIR: ${error.name} - ${error.message}`);
    }
});
/* Acercamiento a un PUNTO */
let _zoomPoint = function(nex,ney){
    try {
        JMap.Map.panAndZoomTo({ x:nex, y:ney }, 19);
    } catch(error) {
        console.error(`_zoomExtent: ${error.name} - ${error.message}`);
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
let _jurisdiccion = function(_data) {
    try { 
        _elementById("ID_CodigoJurisdiccion").innerText = _data == "null" ? "NO ASIGNADA" : _data;
	} catch(error) {
  		console.error(`_jurisdiccion: ${error.name} - ${error.message}`);
	}
};
_jurisdiccion(USUARIO_SID);
/* Comisaria */
let _comisaria = function(_data) {
    try {
        _elementById("ID_Comisaria").innerText = _data || 'Error';
	} catch(error) {
  		console.error(`_comisaria: ${error.name} - ${error.message}`);
	}
};
_comisaria(USUARIO_PNP);
Chart.defaults.set('plugins.datalabels', { color: '#FFFFFF' });
/* Gráfica PIE */
let chartPie = new Chart(document.getElementById('ID_Pie'), {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
        labels: ['Sin medidas', 'Con medidas'],
        datasets: [{
            label: 'Cantidad',
            data: [],
            /* data: [12, 19], */
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
                text: 'DISTRIBUCIÓN',
                color: 'rgb(255,255,255)'
            },
            legend: {
                display: true,
                position: "bottom",
                labels: { color: 'rgb(255,255,255)' }
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
/* Gráfica BAR */
let chartBar = new Chart(document.getElementById('ID_Bar'), {
    plugins: [ChartDataLabels],
    type: 'bar',
    data: {
        /*labels: ['label 1', 'label 2', 'label 3', 'label 4', 'label 5', 'label 6', 'label 7'],*/
        labels: [],
        datasets: [{
            label: 'Cantidad',
            /*data: [500, 59, 80, 81, 56, 55, 40],*/
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
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 0
        }]
    },
    options: {
        scales: {
            x: {
                border: { color: '#FFFFFF' },
                grid: {
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    tickColor: '#FFFFFF',
                    lineWidth: 0.3
                },
                ticks: { color: '#FFFFFF', },
                title: {
                    color: '#FFFFFF',
                    display: true,
                    text: 'Rango de Visitas'
                }
            },
            y: {
                border: { color: '#FFFFFF' },
                grid: {
                    color: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    tickColor: '#FFFFFF',
                    lineWidth: 0.3
                },
                ticks: { color: '#FFFFFF', }
            }
        },        
        plugins: {
            title: {
                display: true,
                text: 'DISTRIBUCIÓN',
                color: 'rgb(255,255,255)'
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    generateLabels: (chart) => {
                        let visibility = [];
                        for(let i=0; i<chart.data.labels.length; i++) {
                            if(chart.getDataVisibility(i) === true) {
                                visibility.push(false);
                            } else {
                                visibility.push(true);
                            }
                        };
                        return chart.data.labels.map((label,index) => ({
                            text:label,
                            fontColor: 'rgb(255,255,255)',
                            strokeStyle: chart.data.datasets[0].borderColor[index],
                            fillStyle: chart.data.datasets[0].backgroundColor[index],
                            hidden: visibility[index]
                        }))
                    }
                },
                onClick: (evt, legendItem, legend) => {
                    const index = legend.chart.data.labels.indexOf(legendItem.text);
                    legend.chart.toggleDataVisibility(index);
                    legend.chart.update();
                }
            },
            datalabels: {
                color: '#FFFFFF',
                textStrokeColor: "#000000",
                textStrokeWidth: 0.8,
                textShadowBlur: 4,
                textShadowColor: '#000000',
                anchor: 'center',
                clamp: true,
                align: 'end',
                formatter: function formatter(value, context) {
                    value = value.toString();
                    return value + "%";
                }
            }            
        }
    }
});

let _graficos = function(_url,_index){
    try {
          $.ajax({
            "url": _url,
            "async": true,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                "Content-Type": "application/json"
            }
          })
            .done(function (response) {
                if(_index == "01") {
                    let _total_01 = response[0].total; /*SIN MEDIDA*/
                    let _label_01 = response[0].dMedidaProteccion;
                    let _total_02 = response[1].total;/*CON MEDIDA*/
                    let _label_02 = response[1].dMedidaProteccion;
                    let _labels = [_label_01,_label_02];
                    let _porcentaje = Math.round((_total_02 /(_total_01 +_total_02))*100);
                    chartPie.data.datasets[0].data = [(100-_porcentaje),_porcentaje];
                    chartPie.data.labels = _labels;
                    chartPie.update();
                } else if(_index == "02") {
                    let _leng = response.length;
                    let _data = [], _label = [];
                    for(let i = 0; i< _leng; i++) {
                        _label.push(response[i].tipoViolencia);
                        _data.push(response[i].total);
                    }
                    let _total = _data.reduce((a, b) => a + b, 0);
                    let _data_0 = Math.round((_data[0]/_total)*100); /* Violencia fisica */
                    let _data_1 = Math.round((_data[1]/_total)*100); /* Violencia psicologica */
                    let _data_2 = Math.round((_data[2]/_total)*100); /* Violencia sexual */
                    let _data_3 = Math.round((_data[3]/_total)*100); /* Violencia economica o patrimonial */
                    let _data_4 = Math.round((_data[4]/_total)*100); /* Sin tipo */
                    chartPie.data.datasets[0].data = [_data_0,_data_1,_data_2,_data_3,_data_4];
                    chartPie.data.labels = _label;
                    chartPie.update();
                } else if(_index == "03") {
                    let _leng = response.length;
                    let _data = [], _label = [];
                    for(let i = 0; i< _leng; i++) {
                        _label.push(response[i].nivelRiesgo);
                        _data.push(response[i].total);
                    }
                    let _total = _data.reduce((a, b) => a + b, 0);
                    let _data_0 = Math.round((_data[0]/_total)*100); /* Moderado (riesgo en aumento) */
                    let _data_1 = Math.round((_data[1]/_total)*100); /* Leve (riesgo variable) */
                    let _data_2 = Math.round((_data[2]/_total)*100); /* Severo 1 (severo) */
                    let _data_3 = Math.round((_data[3]/_total)*100); /* Severo 2 (severo extremo) */
                    chartPie.data.datasets[0].data = [_data_0,_data_1,_data_2,_data_3];
                    chartPie.data.labels = _label;
                    chartPie.update();
                } else {
                    let _data = [response.cero,response.tres,response.cinco,response.mascinco];
                    let _labels = ["0","1-3","4-5","Mas de 5"];
                    chartBar.data.datasets[0].data = _data;
                    chartBar.data.labels = _labels;
                    chartBar.update();
                }
            });
    } catch(error) {
        console.error(`_graficos: ${error.name} - ${error.message}`);
    }
}

_graficos(`http://localhost:8099/denuncia/medidaProteccion/${USUARIO_SID}`,"01");

/* Vista */
let _vista = function() {
    try {
        /* Lista de Vista */
        fetch("./json/config.json")
            .then(response => { return response.json(); })
            .then(jsondata => {
                let _list = jsondata.lyr;
                let pie = document.querySelector('.canvas-pie');
                let bar = document.querySelector('.canvas-bar');
                let optionVista = _list.map(item => `<option value="${item.value}">${item.alias}</option>`);
                let clave = _list.map(item => {if(item.value != "04") { return item.value}});
                let idVista = _elementById("ID_Vista");
                idVista.innerHTML = "";
                idVista.disabled = _elementById("ID_ACTIVAR_TEMATICA").checked;
                idVista.innerHTML = optionVista.join("");
                idVista.addEventListener('change', function(event) {
                    let _data = [], _labels = []; let layerId = 0;
                    if(USUARIO_SID !== "null" && USUARIO_SID !== "" && USUARIO_SID !== null) { 
                        bar.style.display = pie.style.display = "none";
                        /* console.log(event.target.value);
                        console.log(clave.indexOf(event.target.value));
                        console.log(clave); */
                        if(clave.indexOf(event.target.value) != -1) {        
                            pie.style.display = "block";
                            /* Otorgamiento de Medidas de Proteccion */
                            if(event.target.value == "01") {
                                _graficos(`http://localhost:8099/denuncia/medidaProteccion/${USUARIO_SID}`,"01");
                                if(_elementById("ID_ACTIVAR_TEMATICA").checked) {
                                    console.log("ENTRO PRIMERO");
                                    layerId = LYR_ID_PROTE;
                                    JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                                    JMap.Layer.setVisible(LYR_ID_RIESG, false);
                                    JMap.Layer.setVisible(LYR_ID_VISIT, false);
                                    JMap.Layer.setVisible(layerId, true);
                                }
                            }
                            /* Tipificacion de Violencia */
                            if(event.target.value == "02") {
                                _graficos(`http://localhost:8099/denuncia/violencia/${USUARIO_SID}`,"02");
                                if(_elementById("ID_ACTIVAR_TEMATICA").checked) {
                                    layerId = LYR_ID_VIOLE;
                                    JMap.Layer.setVisible(LYR_ID_PROTE, false);
                                    JMap.Layer.setVisible(LYR_ID_RIESG, false);
                                    JMap.Layer.setVisible(LYR_ID_VISIT, false);
                                    JMap.Layer.setVisible(layerId, true);
                                }
                            }                        
                            /* Niveles de Riesgo */
                            if(event.target.value == "03") {
                                _graficos(`http://localhost:8099/denuncia/nivelRiesgo/${USUARIO_SID}`,"03");
                                if(_elementById("ID_ACTIVAR_TEMATICA").checked) {
                                    layerId = LYR_ID_RIESG;
                                    JMap.Layer.setVisible(LYR_ID_PROTE, false);
                                    JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                                    JMap.Layer.setVisible(LYR_ID_VISIT, false);
                                    JMap.Layer.setVisible(layerId, true);
                                }
                            }
                        } else {
                            _graficos(`http://localhost:8099/denuncia/visitas/${USUARIO_SID}`,"04");
                            layerId = LYR_ID_VISIT;                            
                            const currentLayerVisibility = JMap.Layer.isVisible(layerId);
                            JMap.Layer.setVisible(layerId, !currentLayerVisibility);                
                            JMap.Layer.setVisible(LYR_ID_PROTE, false);
                            JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                            JMap.Layer.setVisible(LYR_ID_RIESG, false);                          
                            bar.style.display = "block";
                        }
                    }
                });
                /* Defecto - Selector */
                $('#ID_Vista').val('01').trigger('change');
                pie.style.display = "block";                
                /* const currentLayerVisibility = JMap.Layer.isVisible(LYR_ID_VIOLE);
                JMap.Layer.setVisible(LYR_ID_VIOLE, !currentLayerVisibility); */
            });
	} catch(error) {
  		console.error(`_vista: ${error.name} - ${error.message}`);
	}
};
_vista();

let _visibleTematica = function(_bool) {
    try {
        //_elementById("ID_CONTENT").style.display = _bool?"block":"none";
        let _vista = _elementById("ID_Vista");
        let idPie = _elementById("ID_Pie").style;
        let idBar = _elementById("ID_Bar").style;
        if(_bool) {
            _vista.disabled = true;
            idPie.display = "block";
            idBar.display = "block";
            /* Otorgamiento de Medidas de Proteccion */
            if(_vista.value == "01") {
                JMap.Layer.setVisible(LYR_ID_PROTE,true);         
                JMap.Layer.setVisible(LYR_ID_VIOLE,false);
                JMap.Layer.setVisible(LYR_ID_RIESG,false);
                JMap.Layer.setVisible(LYR_ID_VISIT,false);
            }
            /* Tipificacion de Violencia */
            if(_vista.value == "02") {
                JMap.Layer.setVisible(LYR_ID_VIOLE,true);
                JMap.Layer.setVisible(LYR_ID_PROTE,false);
                JMap.Layer.setVisible(LYR_ID_RIESG,false);
                JMap.Layer.setVisible(LYR_ID_VISIT,false);
            }                        
            /* Niveles de Riesgo */
            if(_vista.value == "03") {
                JMap.Layer.setVisible(LYR_ID_RIESG,true);
                JMap.Layer.setVisible(LYR_ID_PROTE,false);
                JMap.Layer.setVisible(LYR_ID_VIOLE,false);
                JMap.Layer.setVisible(LYR_ID_VISIT,false);                        
            }
            /* Numero de visitas */
            if(_vista.value == "04") {
                JMap.Layer.setVisible(LYR_ID_VISIT,true);
                JMap.Layer.setVisible(LYR_ID_PROTE,false);
                JMap.Layer.setVisible(LYR_ID_VIOLE,false);
                JMap.Layer.setVisible(LYR_ID_RIESG,false);
            }
        } else {
            _vista.disabled = false;
            idPie.display = "none";
            idBar.display = "none";
            JMap.Layer.setVisible(LYR_ID_VIOLE,false);
            JMap.Layer.setVisible(LYR_ID_RIESG,false);
            JMap.Layer.setVisible(LYR_ID_VISIT,false);
            JMap.Layer.setVisible(LYR_ID_PROTE,false);
        }
    } catch(error) {
        console.error(`_visibleTematica: ${error.name} - ${error.message}`);
    }
};

let _activarTematica = function(_boolCB) {
    try {
        let idVista = _elementById("ID_ACTIVAR_TEMATICA");
        idVista.addEventListener('change', function() {
            _visibleTematica(this.checked);
        });
        _visibleTematica(_boolCB);
    } catch(error) {
        console.error(`_activarTematica: ${error.name} - ${error.message}`);
    }
};


//_activarTematica(_elementById("ID_ACTIVAR_TEMATICA").checked);



/* Construcción de filas */
let _rowDetalle = function(_label,_data) {
    try {
        return `
            <div class="row-col">
                <label class="col-md-4 font-weight-bold col-form-label">${_label}:</label>
                <p class="col-md-6">${_data}</div>
            </div>
        `;
    } catch(error) {
        console.error(`_rowDetalle: ${error.name} - ${error.message}`);
    }
}

/* Datos de Medida de Protección */
let _medidaProteccion = function(_this) {
    try{
        const GIF_LOAD = "<center><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div></center>";
        const ID_MED_PRO = "#Tab-2_TAB .tab-list";
        let _codigoDenuncia = _this.dataset.codigo || 0;
        $(ID_MED_PRO).html(GIF_LOAD);     
        $.ajax({
            "url": `http://localhost:8099/medidaProteccion/detailIdDenunciaSidpol/${_codigoDenuncia}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                "Content-Type": "application/json"
            }
        }).done(function (response) {
            try {
                $(ID_MED_PRO).html("");
                $(ID_MED_PRO).html(`<hr><p><strong>Código de Denuncia</strong>: &nbsp; ${_codigoDenuncia}</p>`)
                let _res = response[0];
                /*$(ID_MED_PRO).append(_rowDetalle("Denuncia",_codigoDenuncia));*/
                $(ID_MED_PRO).append(_rowDetalle("Juzgado de Protección",_res["juzgadoAsignado"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Juzgado de Instancia",_res["juzgadoInstancia"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Material Exp.",_res["materiaExp"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Denunciado",_res["denunciado"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Denunciante",_res["denunciante"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Número de Resolución",_res["numeroResolucion"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Fecha Emisión",_res["fechaEmision"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Fecha Fin",_res["fechaFin"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Duranción",_res["duracion"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Documento PNP",_res["documentoPnp"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Cantidad de Visitas",_res["cantidadVisitas"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Auto Medidas",_res["fAutoMedidas"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Estado de Vigencia",_res["fEstadoVigencia"] || ""));
                $(ID_MED_PRO).append(_rowDetalle("Otorga de Medidas",_res["fOtorgaMedidas"] || ""));
                /* Se registrar la información que se esta visualizando */
                _medidasProteccion_CTRL(_codigoDenuncia);
            } catch(error) {                
                $(ID_MED_PRO).html(`<hr><div class="alert alert-danger" role="alert">
                    <strong>Error</strong> al cargar la Información !
                </div>`);
            }            
        }).fail(function(error) {
            $(ID_MED_PRO).html(`<hr><div class="alert alert-warning" role="alert">
                <strong>Advertencia</strong>. No tiene medida de protección asignado!
            </div>`);
        }).always(function(jqXHR,textStatus) { });
        _elementById('Tab-2').click();
    } catch(error) {
        console.error(`_medidaProteccion: ${error.name} - ${error.message}`);
    }
};

/* Datos de Medida de Protección */
let _datatableVisitas = function(_this) {
    try {
        _elementById('Tab-3').click();
        const ID_VISITAS = "#Tab-3_TAB .tab-list";
        let _codigoDenuncia = _this.dataset.codigo || 0;
        $(ID_VISITAS).html("");
        $(ID_VISITAS).html(`<hr><p><strong>Código de Denuncia</strong>: &nbsp; ${_codigoDenuncia}</p>
        <table class="table table-sm" class="display" id="ID_TB_VISITAS" style="width:100%">
            <thead>
                <tr>
                    <th>#</th>
                    <th>UBICACIÓN</th>
                    <th>FECHA VISITA</th>
                    <th>DOC. REFERENCIALES</th>
                    <th>HECHOS ADVERTIDOS</th>
                    <th>PRESENCIA VICTIMA</th>
                    <th>PRESENCIA MENORES</th>
                    <th>ACCIÓN</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>`);

        TB_VISITAS = $('#ID_TB_VISITAS').DataTable({
            language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
            pageLength: 15,
            scrollX: true,
            columnDefs: [
                {
                    className: 'dt-center',
                    width: "60px",
                    targets: 0
                },{
                    render: function (data, type, row) { /* return data + ' (' + row[3] + ')'; */
                        return `<button type='button' class='btn btn-xs btn-general btn-warning' onclick='_zoomPoint(${data.toString()})'>
                            <i class='fa fa-bullseye' aria-hidden='true'></i>
                        </button>`;
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "25px",
                    targets: 1
                },{
                    render: function (data, type, row) {
                        return new Date(data).toLocaleDateString();
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "100px",
                    targets: 2
                },{
                    render: function (data, type, row) {
                        let htmlBagde = data == 1 ? "badge-success'> PRESENTE ":"badge-secondary'> AUSENTE ";
                        return "<span style='padding: 5px; font-size: 11px;' class='badge badge-pill " + htmlBagde + "</span>";
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "115px",
                    targets: 5
                },{
                    render: function (data, type, row) {
                        let htmlBagde = data == 1 ? "badge-success'> PRESENTE ":"badge-secondary'> AUSENTE ";
                        return "<span style='padding: 5px; font-size: 11px;' class='badge badge-pill " + htmlBagde + "</span>";
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "95px",
                    targets: 6
                },{
                    render: function (data, type, row) {
                        return `<button type='button' class='btn btn-xs btn-general btn-danger' data-toggle='modal' data-id='${data}' 
                                    data-target='#ID_Modal_Visita_Eliminar' role="tab" title="ELIMINAR VISITA"> x 
                                </button>`;
                    },
                    orderable: false,
                    className: 'dt-center',
                    width: "100px",
                    targets: 7
                },
            ],
        });
        /* Se lista la tabla */
        _visitas(_codigoDenuncia);
    } catch(error) {
        console.error(`_datatableVisitas: ${error.name} - ${error.message}`);
    }
};

let _visitas = function(_codigoDenuncia) {
    try {
        const ID_VISITAS = "#Tab-3_TAB .tab-list";
        $("#Tab-3_TAB .tab-register").hide();
        $("#ID_CODIGO_DENUNCIA").val(_codigoDenuncia);
        TB_VISITAS.clear().draw();
        $.ajax({
            "url": `http://localhost:8099/visita/detailIdDenunciaSidpol/${_codigoDenuncia}`,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                "Content-Type": "application/json"
            }
        })
        .done(function (_response) {
            try {
                _response.forEach((item,index) => {
                    TB_VISITAS.row.add([
                        index + 1,
                        [item["ubiLatY"],item["ubiLongX"]],
                        item["fechaVisita"],
                        item["docRefPnp"],
                        item["hechosAdvertidos"],
                        item["fPresenciaVictima"],
                        item["fPresenciaMenores"],
                        item["idVisitasPnp"]
                    ]).draw(false);
                });
            } catch(error) {
                $(ID_VISITAS).html(`<hr><div class="alert alert-error" role="alert">
                    <strong>Error</strong>. En el servicio !
                </div>`);
                console.error(`Erro: _visitas: ${error.name} - ${error.message}`);
            }
        })
        .fail(function(msg) {
            TB_VISITAS.clear().draw();
            $(ID_VISITAS).html(`<hr><div class="alert alert-warning" role="alert">
                    La <strong>Denuncia Nº${_codigoDenuncia}</strong>. No tiene Vistas realizadas a la fecha !
                </div>`);
        });
    } catch(error) {
        console.error(`_visitas: ${error.name} - ${error.message}`);
    }
};

$('#ID_VISITA_FECHA').datetimepicker({ locale: 'es', format: 'DD/MM/YYYY', useCurrent: false });

let _visitasPunto = function(_this) {
    try {
        _elementById('Tab-3').click();
        const ID_VISITAS = "#Tab-3_TAB .tab-list";
        $("#Tab-3_TAB .tab-register").show();
        let _codigoDenuncia = _this.dataset.codigo || 0;
        let _button = _this.parentNode.childNodes[1];
        $(ID_VISITAS).html("");
        /* Asignar Código de Denuncia */
        _elementById("ID_VISITA_DENUNCIA").innerText = _codigoDenuncia;
        /* Visita GUARDAR */
        _elementById("ID_VISITA_GUARDAR").addEventListener('click', function() {
            const ID_VISITA = "#ID_ALERT_VISITAS";
            /* Limpia Formulario */            
            let _idVisitaDenuncia = _elementById("ID_VISITA_DENUNCIA").innerText;
            _idVisitaDenuncia = _idVisitaDenuncia.trim();
            let _latitud = _elementById("ID_LATITUD").innerText;
            _latitud = _latitud.trim();
            let _longitud = _elementById("ID_LONGITUD").innerText;
            _longitud = _longitud.trim();
            let _fecha = $("#ID_VISITA_FECHA").val();
            _fecha = _fecha.trim();
            let _documento = $("#ID_VISITA_DOCUMENTO").val();
            _documento = _documento.trim();
            let _hechos = $("#ID_VISITA_HECHOS").val();
            _hechos = _hechos.trim();
            let _victimas = $("#ID_VISITA_VICTIMA").val();
            _victimas = _victimas.trim();
            let _menores = $("#ID_VISITA_MENORES").val();
            _menores = _menores.trim();
            /* VALIDANDO */
            if(_idVisitaDenuncia == "" || _latitud == "0" || _latitud == "0" || _latitud == "" || _longitud == "" || _longitud == "" || _fecha == "0" || _documento == "" || _hechos == "" || _victimas == "" || _menores == "") {
                $(ID_VISITA).html(`<br><br><hr>
                    <div class="alert alert-warning" role="alert">
                        <strong>Advertencia</strong>. (*) Campos obligatorios !
                    </div>`);
                    return false;
            } else {
                $(ID_VISITA).html("");
            }
            /* Invertir orden de fecha */
            _fecha = _fecha.split('/').reverse().join('-');
            console.log({
                "idDenunciaSidpol": parseInt(_idVisitaDenuncia),
                "fechaVisita": `${_fecha} 00:00:00`,
                "docRefPnp": _documento,
                "hechosAdvertidos": _hechos,
                "ubiLatY": _latitud,
                "ubiLongX": _longitud,
                "fPresenciaVictima": _victimas,
                "fPresenciaMenores": _menores,
                "fEstadoReg": "1"
            });
            /* VISITA A ENVIAR */
            $.ajax({
                "url": "http://localhost:8099/visita/create",
                "method": "POST",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                },
                "data": JSON.stringify({
                    "idDenunciaSidpol": parseInt(_idVisitaDenuncia),
                    "fechaVisita": `${_fecha} 00:00:00`,
                    "docRefPnp": _documento,
                    "hechosAdvertidos": _hechos,
                    "ubiLatY": _latitud,
                    "ubiLongX": _longitud,
                    "fPresenciaVictima": _victimas,
                    "fPresenciaMenores": _menores,
                    "fEstadoReg": "1"
                }),
            })
            .done(function (response) {
                try{
                    $(ID_VISITA).html(`<br><br><hr><div class="alert alert-success" role="alert">
                        <strong>SE GUARDO VISITA</strong>. Proceso finalizado!
                    </div>`);
                    _elementById("ID_VISITA_LIMPIAR").click();
                    /* Activar boton de lista de visitas de PNP */
                    _button.disabled = false;
                    _button.classList.remove("btn-secondary");
                    _button.classList.add("btn-warning");
                } catch(error) {
                    $(ID_VISITA).html(`<br><br><hr><div class="alert alert-danger" role="alert">
                        <strong>ERROR</strong>. En el servicio !
                    </div>`);
                    setTimeout(()=>{$(ID_VISITA).hide();},3000);
                    console.error(`#ID_VISITA_GUARDAR .done: ${error.name} - ${error.message}`);
                }
            })
            .fail(function(msg) {
                $(ID_VISITA).html(`<hr><div class="alert alert-danger" role="alert">
                    <strong>Error</strong>. Servicio caido !
                </div>`);
            }).always(function() {
                setTimeout(()=>{$(ID_VISITA).hide();},5000);
            });
        });

        /* Visita LIMPIAR */
        _elementById("ID_VISITA_LIMPIAR").addEventListener('click', function() {
            try {
                _elementById("ID_LATITUD").innerText = "0";
                _elementById("ID_LONGITUD").innerText = "0";
                $("#ID_VISITA_FECHA").val("");
                $("#ID_VISITA_DOCUMENTO").val("");
                $("#ID_VISITA_HECHOS").val("");
                $("#ID_VISITA_VICTIMA").val("");
                $("#ID_VISITA_MENORES").val("");
                $("#ID_VISITA_UBICACION").val("");
            } catch(error) {
                console.error(`ID_VISITA_GUARDAR: ${error.name} - ${error.message}`);
            }
        });

        /* Visita SALIR */
        _elementById("ID_VISITA_SALIR").addEventListener('click', function() {
            try {
                _elementById("ID_VISITA_LIMPIAR").click();
                $("#Tab-3_TAB .tab-register").hide();
            } catch(error) {
                console.error(`ID_VISITA_SALIR: ${error.name} - ${error.message}`);
            }
        });

    } catch(error) {
        console.error(`_visitasPunto: ${error.name} - ${error.message}`);
    }
};

/* Elimina Visita */
let _visitaEliminar = function() {
    try {
        const ID_VISITA = "ID_ALERT_VISITAS";
        const ID_MODAL = "#ID_Modal_Visita_Eliminar";

        const ALERT_ERROR = `<hr>
            <div class="alert alert-danger" role="alert" style="margin-top: 20px;">
                <strong>ERROR</strong> al eliminar VISITA.
            </div>`;
        const ALERT_SUCCESS = `<hr>
            <div class="alert alert-success" role="alert">
                <strong>vISITA ELIMINADA</strong>. Proceso finalizado.
            </div>`;
        $(ID_VISITA).html("");
        let _indexVisita = $("#ID_LIST_CODIGO").val();
        _indexVisita = _indexVisita.trim();
        console.log(_indexVisita);
        if(_indexVisita !== "") {
            $.ajax({
                "url": `http://localhost:8099/visita/delete/${_indexVisita}`,
                "method": "DELETE",
                "timeout": 0,
                "headers": {
                    "Authorization": `Bearer Bearer ${TOKEN_PNP}`,
                    "Content-Type": "application/json"
                }
            })
            .done(function (response) {
                $(ID_MODAL).modal('hide');
                _visitas(_elementById("ID_CODIGO_DENUNCIA").value);
                $(ID_VISITA).html(ALERT_SUCCESS);
                $(ID_VISITA).hide();
            })
            .fail(function(msg) {
                $(ID_VISITA).html(ALERT_ERROR);
            }).always(function(){
                setTimeout(()=>{$(ID_VISITA).hide();},3000);
                $(ID_VISITA).html("");
            });            
        }
    } catch(error) {
        console.error(`_visitaEliminar: ${error.name} - ${error.message}`);
    }
}

$('#ID_Modal_Visita_Eliminar').on('show.bs.modal', function(_this) {
    try {
        $("#ID_LIST_CODIGO").val('');
        let _id = $(_this.relatedTarget).data().id;
        $("#ID_LIST_CODIGO").val(_id);
    } catch(error) {
        console.error(`ID_Modal_EDI_USUARIO: ${error.name} - ${error.message}`);
    } 
});

/* Guarda la medidas de progteccion accedidas */
let _medidasProteccion_CTRL = function(_codigoDenuncia) {
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
                "audaccion": "Consulta",
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
}

_elementById("ID_VISITA_POSICION").addEventListener('click', function() {
    try {
        let _boolean = false;
        JMap.Event.Map.on.click("selectLocation", (res) => {
            if(!_boolean) {
                _elementById("ID_LATITUD").innerText = res.location.x;
                _elementById("ID_LONGITUD").innerText = res.location.y;
                let circle = { center: { x: parseInt(res.location.x), y: parseInt(res.location.y) }, radius: 10 }
                // The following instruction will not throw an error
                JMap.Geometry.checkCircle(circle);
            }
            _boolean = true;
        });
    } catch(error) {
        console.error(`ID_VISITA_POSICION: ${error.name} - ${error.message}`);
    }
});

/*
setTimeout(()=>{
    if(USUARIO_SID !== "null" && USUARIO_SID !== null && USUARIO_SID !== "") {
        _denunciaJurisdiccion(USUARIO_SID);
    }    
},3000);
*/
