# ![chartjs-gauge logo](./samples/logo.svg) chartjs-gauge-v3

Simple gauge chart for [Chart.js](https://www.chartjs.org/) >= 3.1.0?

Fork of the [chartjs-gauge](https://github.com/haiiaaa/chartjs-gauge).

## Samples

- [Gauge Chart](samples/gauge.html)
- [Gauge Chart with datalabels plugin](samples/gauge-datalabels.html)
- [Gauge Chart with datalabels plugin displaying labels](samples/gauge-datalabels-labels.html)

## Install

- **yarn** install: `yarn add chart.js chartjs-gauge-v3`
- **npm** install: `npm install --save chart.js chartjs-gauge-v3`

Use the following command to see samples:

```sh
$ npx http-server node_modules/chartjs-guage-v3
```

## Interfaces

- [GaugeControllerChartOptions](docs/interfaces/GaugeControllerChartOptions.md)
- [GaugeControllerDatasetOptions](docs/interfaces/GaugeControllerDatasetOptions.md)
- [NeedleOptions](docs/interfaces/NeedleOptions.md)
- [ValueLabelOptions](docs/interfaces/ValueLabelOptions.md)

## Example

```javascript
var ctx = document.getElementById("canvas").getContext("2d");

var chart = new Chart(ctx, {
  type: 'gauge',
  data: {
    datasets: [{
      value: 65,
      minValue: 0,
      data: [50, 70, 90, 100],
      backgroundColor: ['green', 'yellow', 'orange', 'red'],
    }]
  },
  options: {
    needle: {
      radius: "20%",
      width: "10%",
      length: "80%",
      color: 'rgba(0, 0, 0, 1)'
    },
    valueLabel: {
      display: true,
      formatter: (value) => {
        return '$' + Math.round(value);
      },
      color: 'rgba(255, 255, 255, 1)',
      backgroundColor: 'rgba(0, 0, 0, 1)',
      borderRadius: 5,
      padding: {
        top: 10,
        bottom: 10
      }
    }
  }
});
```

## License

chartjs-gauge is available under the [MIT license](https://opensource.org/licenses/MIT).
