module.exports = {
  config: {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [{
        backgroundColor: 'red',
        borderColor: 'red',
        fill: false,
        data: [3, 1, 4, 2, 5, 3, 16]
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: false,
        },
        y: {
          type: 'logarithmic',
          ticks: {
            autoSkip: false
          }
        }
      }
    }
  },
  options: {
    spriteText: true
  }
};
