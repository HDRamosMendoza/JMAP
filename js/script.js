//import abc from "./json/config.json";
//const jsonConfig = JSON.parse(config);

fetch("./json/config.json")
    .then(response => { return response.json(); })
    .then(jsondata => console.log(jsondata));

const LYR_ID_N4PE08 = 1;
const LYR_ID_N3PE02 = 2;
const LYR_ID_N2PE00 = 3;

const PLACE_LAYER_ID = 2;
function miFunc (nex,ney,swx,swy) {
    console.log("LE DIO CLIC");
    console.log(nex,ney,swx,swy);
    JMap.Map.zoomToRect({ ne: { x:nex,y:ney }, sw: { x:swx,y:swy }});
}

let isSearching = false;
window.search = () => {
    if (isSearching) {
      return console.log("Busqueda en proceso, porfavor espere");
    }
    const postalCode = document.getElementById("ID_TXT_DATO").value;
    if (!postalCode) {
      return alert("Ingrese dato");
    }
    isSearching = true;
    if (!JMap.Layer.isSelectableById(PLACE_LAYER_ID)) {
        JMap.Layer.setSelectabilityById(PLACE_LAYER_ID, true);
    }
    JMap.Layer.Search
        .byAttribute({
            layerId: PLACE_LAYER_ID,
            attributeName: "NOMBDEP",
            attributeValue: postalCode,
            showMapPopup: true
        })
        .then(features => {
            console.log("Features", features);
            features.forEach(element => {
                gg.row.add(['.0', '.1', '.2', '.3', '.4', '.5', '.6', '.7', '.8', '.9', '.10', '.11', element.bbox]).draw(false);
            });
            //gg.row.add([counter + '.1', counter + '.2', counter + '.3', counter + '.4', counter + '.5']).draw(false);
            isSearching = false;
            if (features.length === 0) {
                JMap.Map.Selection.clearLayersSelection([PLACE_LAYER_ID]);
                return alert("No feature found !");
            }
            JMap.Map.Selection.setLayerSelection(PLACE_LAYER_ID, features);
            JMap.Map.fitFeatures(features);
        })
        .catch(error => {
            isSearching = false;
            console.error("An error occured", error);
            alert("An error occured");
        });
};

window.JMAP_OPTIONS = {
    projectId: 7,
    restBaseUrl: "http://172.31.0.48/services/rest/v2.0",
    anonymous: true,
    map: {
        containerId: "my-custom-map",
      zoom: 4,
      center: {
        x: -76.0000000,
        y: -10.0000000
      },
      scaleControlVisible: true,
      scaleControlPosition: "bottom-right"
    },
    hideMainLayout: false,
    application: {
      containerId: "my-custom-app"
    },

    onReady: () => {
        JMap.Event.Map.on.mapLoad("my-listener", () => {
            document.getElementById("ID_BTN_Buscar").onclick = window.search;
        });
    }

}