/* DENUNCIA */
const LYR_ID_DENUN = 16;
/* JURISDICCION */
const LYR_ID_JURID = 6;
/* GRAFICOS */
const LYR_ID_VISIT = 21; /* Número de Visistas PNP */
const LYR_ID_RIESG = 20; /* Niveles de Riesgo */
const LYR_ID_VIOLE = 19; /* Tipificacion de Violencia */
const LYR_ID_PROTE = 17; /* Otorgamiento de Medidas de Proteccion */
/* LOCAL STORAGE */
const TOKEN          = localStorage.getItem("token");
const USUARIO_NOMBRE = localStorage.getItem("usuNombre");
const USUARIO_CIP    = localStorage.getItem("usuCipUsuario");
const USUARIO_COD    = localStorage.getItem("usuCodUnidad");
const USUARIO_ROL    = localStorage.getItem("usuRol");
const USUARIO_SID    = localStorage.getItem("usuCodSidPol");
const USUARIO_PNP    = localStorage.getItem("usuUnidadPNP");
let TB_DENUNCIAS;

/* DENUNCIAS */
window.denuncias = (_cod) => {
    //moment().format('DD/MM/yyyy');
    //isSearching = true;
    //console.log(JMap.Layer.isSelectableById(LYR_ID_DENUN));
    if (!JMap.Layer.isSelectableById(LYR_ID_DENUN)) {
        JMap.Layer.setSelectabilityById(LYR_ID_DENUN, true);
    }
    console.log(_cod);
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_DENUN,
            attributeName: "ID_DENUNCIA_SIDPOL_L30364",
            /*attributeValue: "16869",*/
            attributeValue: parseInt(_cod),
            showMapPopup: false
        })
        .then(features => {
            isSearching = false;
            TB_DENUNCIAS.clear().draw();
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
                _zoomExtent(features[0].bbox);
                window.denuncias(_codigo);
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_JURID, features);
            JMap.Map.fitFeatures(features);
            /*window.denuncias(_codigo);*/
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
        zoom: 4,
        center: {
        x: -76.0000000,
        y: -10.0000000
        },
    },
    hideMainLayout: true,
    application: {
        containerId: "app-map",
        sidePanelInitialVisibility: false
    },
    onReady: () => {
        JMap.Event.Map.on.mapLoad("my-listener", () => {
            /* Defecto - Jurisdicción */
            window.jurisdiccion(USUARIO_SID);
            /* Defecto - Gráfico */
            const currentLayerVisibility = JMap.Layer.isVisible(LYR_ID_VIOLE);
            JMap.Layer.setVisible(LYR_ID_VIOLE, !currentLayerVisibility);
        });
    }
}

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

/* Valida TOKEN */
let _validateLocal = function() {
    try {
        let _TOKEN = localStorage.getItem("token");
        if(_TOKEN == "" || _TOKEN == null) {
            window.location.href = "./login.html";
        }
    } catch(error) {
        console.error(`_validateLocal: ${error.name} - ${error.message}`);
    }     
}
_validateLocal();

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

/* Elimina el TOKEN */
_elementById("ID_SALIR").addEventListener("click", function(){
    try {
        localStorage.removeItem("token");
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
        _elementById("ID_CodigoJurisdiccion").innerText = _data || 'Error';
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

/* Control de Paneles y secciones */
let _users = function(_rol) {
    try {
        if(_rol == "ROLE_USER") {
            /* Usuarios */
            $("#Tab-5").hide();
            $(`label[for="Tab-5"]`).hide();
            $("#Tab-5_TAB").hide(); 
        } else if(_rol == "ROLE_USER2") {
            /* Usuarios */
            $("#Tab-5").hide();
            $(`label[for="Tab-5"]`).hide();
            $("#Tab-5_TAB").hide(); 
            /* Auditoria */
            $("#Tab-4").hide();
            $(`label[for="Tab-4"]`).hide();
            $("#Tab-4_TAB").hide(); 
        }
	} catch(error) {
  		console.error(`_users: ${error.name} - ${error.message}`);
	}
}
_users(USUARIO_ROL);

Chart.defaults.set('plugins.datalabels', { color: '#FFFFFF' });
/* Gráfica PIE */
let chartPie = new Chart(document.getElementById('ID_Pie'), {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
        labels: ['Sin medidas', 'Con medidas'],
        datasets: [{
            label: 'Cantidad',
            data: [12, 19],
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
        labels: ['label 1', 'label 2', 'label 3', 'label 4', 'label 5', 'label 6', 'label 7'],
        datasets: [{
            label: 'Cantidad',
            data: [500, 59, 80, 81, 56, 55, 40],
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
                    text: 'Rango'
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

/* Vista */
let _vista = function() {
    try {
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
                idVista.innerHTML = optionVista.join("");
                idVista.addEventListener('change', function(event) {
                    let _data = [], _labels = []; let layerId = 0;
                    bar.style.display = pie.style.display = "none";
                    console.log(event.target.value);
                    console.log(clave.indexOf(event.target.value));
                    console.log(clave);
                    if(clave.indexOf(event.target.value) != -1) {        
                        pie.style.display = "block";

                        /* Otorgamiento de Medidas de Proteccion */
                        if(event.target.value == "01") {
                            //window.medidasProteccion("1870");
                            _data = [17,83];
                            _labels = ["Sin medidas","Con medidas"];
                            layerId = LYR_ID_PROTE;
                            JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                            JMap.Layer.setVisible(LYR_ID_RIESG, false);
                            JMap.Layer.setVisible(LYR_ID_VISIT, false);
                        }
                
                        /* Tipificacion de Violencia */
                        if(event.target.value == "02") {
                            //window.tipoViolencia("1870");
                            _data = [46,40,8,6];
                            _labels = ["Fisica","Psicologica","Sexual","Economica / Pat"];
                            layerId = LYR_ID_VIOLE;
                            JMap.Layer.setVisible(LYR_ID_PROTE, false);
                            JMap.Layer.setVisible(LYR_ID_RIESG, false);
                            JMap.Layer.setVisible(LYR_ID_VISIT, false);
                        }
                        
                        /* Niveles de Riesgo */
                        if(event.target.value == "03") {
                            //window.nivelRiesgo("1870");
                            _data = [51,40,9];            
                            _labels = ["Bajo", "Leve", "Severo"];
                            layerId = LYR_ID_RIESG;
                            JMap.Layer.setVisible(LYR_ID_PROTE, false);
                            JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                            JMap.Layer.setVisible(LYR_ID_VISIT, false);
                        }
                        
                        const currentLayerVisibility = JMap.Layer.isVisible(layerId);
                        JMap.Layer.setVisible(layerId, !currentLayerVisibility);
                
                        chartPie.data.datasets[0].data = _data;
                        chartPie.data.labels = _labels;
                        chartPie.update();
                    } else {
                                     
                        layerId = LYR_ID_VISIT;
                        const currentLayerVisibility = JMap.Layer.isVisible(layerId);
                        JMap.Layer.setVisible(layerId, !currentLayerVisibility);                
                        JMap.Layer.setVisible(LYR_ID_PROTE, false);
                        JMap.Layer.setVisible(LYR_ID_VIOLE, false);
                        JMap.Layer.setVisible(LYR_ID_RIESG, false);
                        
                        bar.style.display = "block";
                        /*
                        _data = [111.328,87.500,18.200,60.000];
                        _labels = ["0","1-3","3-5","Mas de 5"];                
                        chartBar.data.datasets[0].data = _data;
                        chartBar.data.labels = _labels;
                        chartBar.update();
                        */
                    }
                });
                /* Defecto - Selector */
                $('#ID_Vista').val('02').trigger('change');
                pie.style.display = "block";                
                /* const currentLayerVisibility = JMap.Layer.isVisible(LYR_ID_VIOLE);
                JMap.Layer.setVisible(LYR_ID_VIOLE, !currentLayerVisibility); */
            });
	} catch(error) {
  		console.error(`_vista: ${error.name} - ${error.message}`);
	}
};
_vista();

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
        const ID_MED_PRO = "#Tab-2_TAB .tab-list";
        const GIF_LOAD = "<center><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div></center>";
        let _codigoDenuncia = _this.dataset.codigo || 0;

        $(ID_MED_PRO).html(GIF_LOAD);
        $.ajax({
            "url": "sdsdsdsddd",
            "method": "GET",
            "timeout": 0,
            "headers": { "Content-Type": "application/json" },
            "data": JSON.stringify({
                "data": _codigoDenuncia
            }),
        }).done(function (response) {
            try {
                $(ID_MED_PRO).append(_rowDetalle("Denuncia",_codigoDenuncia));
                $(ID_MED_PRO).append(_rowDetalle("Juzgado de Protección",_response.data01 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Juzgado de Instancia",response.data02 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Juzgado de Instancia",response.data03 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Material Exp.",response.data04 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Denunciado",response.data05 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Denunciante",response.data06 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Número de Resolución",response.data07 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Fecha Emisión",response.data08 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Fecha Fin",response.data09 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Duranción",response.data10 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Documento PNP",response.data11 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Cantidad de Visitas",response.data12 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Auto Medidas",response.data13 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Estado de Vigencia",response.data14 || ""));
                $(ID_MED_PRO).append(_rowDetalle("Otorga de Medidas",response.data15 || ""));
            } catch(error) {
                console.error(`_medidaProteccion ajax done: ${error.name} - ${error.message}`);
                $(ID_MED_PRO).html(`
                <div class="alert alert-danger" role="alert">
                    <strong>Error</strong> al cargar la Información !
                </div>`);
            }
        })
        .fail(function(msg) {
            // Ventana de confirmación
            $(ID_MED_PRO).html(`
                <div class="alert alert-danger" role="alert">
                    <strong>Error</strong> al cargar la Información !
                </div>`);
            console.error(msg);
        })
        .always(function(jqXHR,textStatus) {});
        /* Activación de la capa */
        _elementById('Tab-2').click();
    } catch(error) {
        console.error(`_medidaProteccion: ${error.name} - ${error.message}`);
    }
};

/* Datos de Medida de Protección */
let _visitas = function(_this) {
    try {
        const ID_VISITAS = "#Tab-3_TAB .tab-list";
        let _codigoDenuncia = _this.dataset.codigo || 0;
        $(ID_VISITAS).html("");
        $(ID_VISITAS).html(`
            <table class="table table-sm" class="display" id="ID_TB_VISITAS" style="width:100%">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ubicación</th>
                        <th>Fecha de Visita</th>
                        <th>Documento Referencial</th>
                        <th>Hechos Advertidos</th>
                        <th>Presencia de Victima</th>
                        <th>Presencia de Menores</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`);
            let TB_VISITAS = $('#ID_TB_VISITAS').DataTable({
                language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
                pageLength: 5,
                paging: false,
                searching: false,
                columnDefs: [
                    {
                        className: 'dt-center',
                        width: "60px",
                        targets: 0
                    },{
                        render: function (data, type, row) { /* return data + ' (' + row[3] + ')'; */
                            return "<button type='button' class='btn btn-xs btn-point btn-warning' onclick='_zoomPoint(" + data.toString() + ")' data-dismiss='modal'></button>"
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
                            let htmlBagde = data === 1 ? "badge-success'>PRESENTE":"badge-info'>PROGRAMADO";
                            return "<span class='badge badge-pill " + htmlBagde + "</span>";
                        },
                        orderable: false,
                        className: 'dt-center',
                        width: "115px",
                        targets: 5
                    },{
                        render: function (data, type, row) {
                            let htmlBagde = data === 1 ? "badge-success'>AUSENTE":"badge-info'>PROGRAMADO";
                            return "<span class='badge badge-pill " + htmlBagde + "</span>";
                        },
                        orderable: false,
                        className: 'dt-center',
                        width: "95px",
                        targets: 6
                    }
                ],
            });
    } catch(error) {
        console.error(`_visitas: ${error.name} - ${error.message}`);
    }
};

/* Construcción de filas */
let _rowVisitas = function(_label,_data) {
    try {
        return `
            <div class="row-col">
                <label class="col-md-10 font-weight-bold col-form-label">${_label}:</label>
                <div class="col-md-10">
                    <input type="text" class="form-control input-sm" id="ID_${_data}" placeholder="Ingresar información"/>
                </div>                
            </div>
        `;
    } catch(error) {
        console.error(`_rowDetalle: ${error.name} - ${error.message}`);
    }
}
let _visitasPunto = function(_this) {
    try {
        const ID_VISITAS = "#Tab-3_TAB .tab-list";
        let _codigoDenuncia = _this.dataset.codigo || 0;
        $(ID_VISITAS).html("");
        $(ID_VISITAS).append(_rowVisitas("Fecha de Visita",_codigoDenuncia));
        $(ID_VISITAS).append(_rowVisitas("Documeto Ref. PNP",''));
        $(ID_VISITAS).append(_rowVisitas("Hechos Advertidos",''));
        $(ID_VISITAS).append(_rowVisitas("Presencia Victima",''));
        $(ID_VISITAS).append(_rowVisitas("Presencia de Menores",''));
        $(ID_VISITAS).append(_rowVisitas("Ubicación",''));
        /* Activación de la capa */
        _elementById('Tab-3').click();

        /* TABLA 
        $.ajax({
            "url": "",
            "method": "POST",
            "timeout": 0,
            "headers": { "Content-Type": "application/json" },
            "data": JSON.stringify({
                "data": _codigoDenuncia
            }),
        })
        .done(function (response) {
            console.log(response);
            response.forEach((item,index) => {
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

            if(response.length > 1) {
                window.visitas(_cod);
            }                    
        })
        .fail(function(msg) {
            TB_VISITAS.clear().draw();
            $(ID_MODAL).html(`
                <div class="alert alert-danger" role="alert">
                    <strong>Error</strong> al ENVIAR la información !
                </div>
            `);
        })
        .always(function(jqXHR,textStatus) {
            console.log("Proceso terminado");
        });*/ 
    } catch(error) {
        console.error(`_visitasPunto: ${error.name} - ${error.message}`);
    }
};

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
                return `<button type='button' class='btn btn-sm btn-general btn-info' onclick='_zoomPoint(${data.toString()})' ${_status}><i class='fa fa-search-plus'></i></button>`;
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
                return `<button type='button' class='btn btn-sm btn-general btn-secondary' data-codigo='${data}' ${_status} onclick='_medidaProteccion(this)'><i class='fa fa-bars'></i></button>`;
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
                    <button type='button' class='btn btn-sm btn-general btn-secondary' data-codigo='${data}' ${_status} onclick='_visitas(this)' title='Lista de Visita'><i class='fa fa-user' aria-hidden='true'></i></button>
                    <button type='button' class='btn btn-sm btn-general btn-secondary' data-codigo='${data}' ${_status} onclick='_visitasPunto(this)' title='Agregar Visita'><i class='fa fa-bullseye' aria-hidden='true'></i></button>
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