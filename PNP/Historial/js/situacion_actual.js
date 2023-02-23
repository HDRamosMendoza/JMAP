Chart.defaults.set('plugins.datalabels', { color: '#FFFFFF' });
let chartSituacionTotal = new Chart(document.getElementById('ID_SituacionTotal'), {
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
                labels: { color: 'rgb(000,000,000)' }
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


let TB_SITUACION_ACTUAL = $('#ID_TB_SITUACION_ACTUAL').DataTable({
    language: { url: "https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json" },
    pageLength: 5   
});
