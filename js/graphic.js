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

let _usuario = function() {
    try {
        let txtUsuario = "CAP. JORGE LAZO"; /* SOURCE */
        _elementById("ID_Usuario").innerText = txtUsuario || 'Error';	    
	} catch(error) {
  		console.error(`_usuario: ${error.name} - ${error.message}`);
	}
};
_usuario();

let _comisaria = function() {
    try {
        let txtComisaria = "CPNP JOSE GALVEZ"; /* SOURCE */
        _elementById("ID_Comisaria").innerText = txtComisaria || 'Error';	    
	} catch(error) {
  		console.error(`_comisaria: ${error.name} - ${error.message}`);
	}
};
_comisaria();

let _jurisdiccion = function() {
    try {
        let txtJurisdiccion = "CPNP JOSE GALVEZ"; /* SOURCE */
        _elementById("ID_Jurisdiccion").innerText = txtJurisdiccion || 'Error';	    
	} catch(error) {
  		console.error(`_jurisdiccion: ${error.name} - ${error.message}`);
	}
};
_jurisdiccion();

let _anio = function() {
    try {
        const anio = [2022,2021,2020,2019,2018,2017,2016]; /* SOURCE */
        let option = anio.map(item => `<option value="${item}">${item}</option>`);
        let idAnio = _elementById("ID_Anio");
        idAnio.innerHTML = "";
        idAnio.innerHTML = option.join("");
	} catch(error) {
  		console.error(`_anio: ${error.name} - ${error.message}`);
	}
};
_anio();

/*  VERSION 02 - AÑO 
    let idAnio = _elementById("ID_Anio");
    idAnio.innerHTML = "";
    const anio = [2022,2021,2020,2019,2018,2017,2016];
    anio.map(item => {
        let option = document.createElement("option");
        option.setAttribute("value", item);
        let optionText = document.createTextNode(item);
        option.appendChild(optionText);
        idAnio.appendChild(option);
    }); */

/*  TIPO DE VISTA */
const vista = [ /* SOURCE */
    { clave:"01", valor:"01 Medidas de Protección" },
    { clave:"02", valor:"02 Tipo de Violencia" },
    { clave:"03", valor:"03 Nivel de Riesgo" },
    { clave:"04", valor:"04 Número de Visitas" }
];
let pie = document.querySelector('.canvas-pie');
let bar = document.querySelector('.canvas-bar');
let optionVista = vista.map(item => `<option value="${item.clave}">${item.valor}</option>`);
let clave = vista.map(item => {if(item.clave != "04") { return item.clave}});
let idVista = _elementById("ID_Vista");
idVista.innerHTML = "";
idVista.innerHTML = optionVista.join("");
idVista.addEventListener('change', function(event) {
    let _data = [], _labels = []; let layerId = 0;
    bar.style.display = pie.style.display = "none";
    if(clave.indexOf(event.target.value) != -1) {        
        pie.style.display = "block";        
        
        if(event.target.value == "01") {
            //window.medidasProteccion("1870");
            _data = [17,83];
            _labels = ["Sin medidas","Con medidas"];
            layerId = 11;
            JMap.Layer.setVisible(12, false);
            JMap.Layer.setVisible(13, false);
            JMap.Layer.setVisible(7, false);
        }

        if(event.target.value == "02") {
            //window.tipoViolencia("1870");
            _data = [46,40,8,6];
            _labels = ["Fisica","Psicologica","Sexual","Economica / Pat"];
            layerId = 12;
            JMap.Layer.setVisible(11, false);
            JMap.Layer.setVisible(13, false);
            JMap.Layer.setVisible(7, false);
        }
        //ID_DENUNCIA_SIDPOL
        if(event.target.value == "03") {
            //window.nivelRiesgo("1870");
            _data = [51,40,9];            
            _labels = ["Bajo", "Leve", "Severo"];
            layerId = 13;
            JMap.Layer.setVisible(11, false);
            JMap.Layer.setVisible(12, false);
            JMap.Layer.setVisible(7, false);
        }
        
        const currentLayerVisibility = JMap.Layer.isVisible(layerId);
        JMap.Layer.setVisible(layerId, !currentLayerVisibility);

        chartPie.data.datasets[0].data = _data;
        chartPie.data.labels = _labels;
        chartPie.update();
    } else {
        bar.style.display = "block";
        _data = [111.328,87.500,18.200,60.000];
        _labels = ["0","1-3","3-5","Mas de 5"];

        chartBar.data.datasets[0].data = _data;
        chartBar.data.labels = _labels;
        chartBar.update();

        layerId = 7;
        const currentLayerVisibility = JMap.Layer.isVisible(layerId);
        JMap.Layer.setVisible(layerId, !currentLayerVisibility);

        JMap.Layer.setVisible(11, false);
        JMap.Layer.setVisible(12, false);
        JMap.Layer.setVisible(13, false);
    }
});

/* Por defecto */
$('#ID_Vista').val('02').trigger('change');
pie.style.display = "block";

//COD_CPNP: "1541"

let TB_JURISDICCION;
let TB_VISITAS;

$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var min = minDate.val();
        var max = maxDate.val();
        var date = new Date( data[14,20] );
 
        if (
            ( min === null && max === null ) ||
            ( min === null && date <= max ) ||
            ( min <= date   && max === null ) ||
            ( min <= date   && date <= max )
        ) {
            return true;
        }
        return false;
    }
);
var minDate, maxDate;

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
   
    minDate = new DateTime($('#min'), {format:  'DD/M/yyyy'});
    maxDate = new DateTime($('#max'), {format:  'DD/M/yyyy'});
 
    $('#min, #max').on('change', function () {
        TB_JURISDICCION.draw();
    });

    $('#ID_TB_BUSCAR').on('click', function () {
        let _data = $('#ID_BTN_DATO').val();
        TB_JURISDICCION.search(_data).draw(false);
    });

    $('#ID_TB_LIMPIAR').on('click', function () {
        
        $('#ID_BTN_DATO').val("");
        /*$('#min').val("");
        $('#max').val("");*/
        TB_JURISDICCION.search("").draw(false);
    });
   
    TB_JURISDICCION = $('#ID_TB_JURISDICCION').DataTable({
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
        pageLength: 5,
        scrollX: true,
        search: { return: true },
        columnDefs: [
            {
                render: function (data, type, row) { /* return data + ' (' + row[3] + ')'; */
                    /* console.log(data.toString()); */
                    return "<button type='button' class='btn btn-xs btn-zoom btn-dark' onclick=\"_zoomPoint(" + data.toString() + ")\"></button>";
                },
                orderable: false,
                className: 'dt-center',
                width: "25px",
                targets: 1
            },{
                render: function (data, type, row) {
                    return "<button type='button' class='btn btn-xs btn-detalle btn-warning' data-toggle='modal' data-target='#ID_Modal_Detalle' data-codigo='" + data + "'><i class='fa fa-bars'></i></button>";
                },
                orderable: false,
                className: 'dt-center',
                width: "25px",
                targets: 2
            },/*{
                render: function (data, type, row) {
                    return "<div style='width: 150px'><p>" + data + "</p></div>";
                },
                targets: 5
            },*/{
                render: function (data, type, row) {
                    return "<button type='button' class='btn btn-xs btn-visita btn-warning' data-toggle='modal' data-target='#ID_Modal_Visitas' data-codigo='" + data + "'></button>";
                },
                orderable: false,
                className: 'dt-center',
                width: "25px",
                targets: 15
            },
        /*{ visible: false, targets: [3] },*/
        ],
    });
    
  
    TB_VISITAS = $('#ID_TB_VISITAS').DataTable({
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
        pageLength: 5,
        search: { return: true },
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
                    let htmlBagde = data === 1 ? "badge-success'>EJECUTADO":"badge-info'>PROGRAMADO";
                    return "<span class='badge badge-pill " + htmlBagde + "</span>";
                },
                orderable: false,
                className: 'dt-center',
                width: "115px",
                targets: 5
            },{
                render: function (data, type, row) {
                    let htmlBagde = data === 1 ? "badge-success'>EJECUTADO":"badge-info'>PROGRAMADO";
                    return "<span class='badge badge-pill " + htmlBagde + "</span>";
                },
                orderable: false,
                className: 'dt-center',
                width: "95px",
                targets: 6
            }
        ],
    });

    $('#ID_Modal_Visitas').on('show.bs.modal', function (event) {
        try {
            let btn = $(event.relatedTarget);
            let cod = btn.data('codigo');
            window.visitas(cod);
        } catch(error) {
            console.error(`#ID_Modal_Visitas - show.bs.modal: ${error.name} - ${error.message}`);
        }
    })
});

Chart.defaults.set('plugins.datalabels', { color: '#FFFFFF' });
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