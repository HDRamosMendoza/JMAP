/* const LYR_ID_ = ; */
const LYR_ID_DENUN = 5;
const LYR_ID_JURID = 6;
const LYR_ID_VISIT = 7;
const LYR_ID_PROTE = 11;
const LYR_ID_VIOLE = 12;
const LYR_ID_RIESG = 13;

let isSearching = false;

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

let _zoomPoint = function(nex,ney){
    try {
        JMap.Map.panAndZoomTo({ x:nex, y:ney }, 19);
    } catch(error) {
        console.error(`_zoomExtent: ${error.name} - ${error.message}`);
    }
}

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
    isSearching = true;
    if (!JMap.Layer.isSelectableById(LYR_ID_DENUN)) {
        JMap.Layer.setSelectabilityById(LYR_ID_DENUN, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_DENUN,
            attributeName: "cod_cpnp",
            attributeValue: _cod,
            showMapPopup: true
        })
        .then(features => {
            isSearching = false;
            TB_JURISDICCION.clear().draw();
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_DENUN]);
            } else {
                features.forEach((element,index) => {
                    TB_JURISDICCION.row.add([
                        (index + 1),
                        element.geometry.coordinates,
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.ID_DENUNCIA_SIDPOL_L30364"],

                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.COMISARIA"],                        
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.modalidad"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.sub_tipo"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.REGION"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.LIBRO"],

                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.TIPO_DOC_DENUNCIA"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.DPTO_DENUNCIA"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.PROV_DENUNCIA"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.DIST_DENUNCIA"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.UBIGEO_DENUNCIA"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.DIRECCION_DENUNCIA"],
                        new Date(element.properties["TM_DENUNCIAS_SIDPOL_L30364.FECHA_REGISTRO_DENUNCIA"]).toLocaleDateString(),

                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.ID_DENUNCIA_SIDPOL_L30364"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.DPTO_HECHO"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.PROV_HECHO"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.DIST_HECHO"],
                        element.properties["TM_DENUNCIAS_SIDPOL_L30364.UBIGEO_HECHO"],
                        new Date(element.properties["TM_DENUNCIAS_SIDPOL_L30364.FECHA_REGISTRO_HECHO"]).toLocaleDateString(),

                    ]).draw(false);
                });
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_DENUN, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            isSearching = false;
            TB_JURISDICCION.clear().draw();
            console.error(`TB_JURISDICCION: ${error.name} - ${error.message}`);
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
            isSearching = false;
            TB_VISITAS.clear().draw();
            if(features.length === 0) { 
                JMap.Map.Selection.clearLayersSelection([LYR_ID_VISIT]);
            } else {
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
            }
            JMap.Map.Selection.setLayerSelection(LYR_ID_VISIT, features);
            JMap.Map.fitFeatures(features);            
        })
        .catch(error => {
            isSearching = false;
            TB_VISITAS.clear().draw();
            console.error(`TB_VISITAS: ${error.name} - ${error.message}`);
        });
};
window.search = (_cod) => {
    isSearching = true;
    if (!JMap.Layer.isSelectableById(LYR_ID_JURID)) {
        JMap.Layer.setSelectabilityById(LYR_ID_JURID, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: LYR_ID_JURID,
            attributeName: "COD_CPNP",
            attributeValue: _cod,
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
            window.denuncias(_cod);
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
      scaleControlPosition: "bottom-left"
    },
    hideMainLayout: true,
    application: {
      containerId: "my-custom-app"
    }
}
setTimeout(() => {
    /* 1541 */
    window.search("1870");
}, 5000);