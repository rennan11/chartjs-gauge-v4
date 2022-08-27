/* eslint-disable class-methods-use-this */
import { DoughnutController, ArcElement } from 'chart.js';
import { addRoundedRectPath, toRadians } from 'chart.js/helpers';
import { version } from '../../package.json';


class GaugeController extends DoughnutController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.center = new ArcElement();
  }

  // TODO テスト時に通らないこともある模様......
  parse(start, count) {
    super.parse(start, count);
    this._updateMeta();
  }

  _updateMeta() {
    const meta = this._cachedMeta;
    const data = meta._parsed;
    const { value, minValue = 0 } = this.getDataset();
    const maxValue = data.length > 0 ? data[data.length - 1] : minValue + 1;

    const values = [];
    data.reduce((prev, curr) => {
      values.push(curr - prev);
      return curr;
    }, minValue);
    const length = maxValue - minValue;
    const valuePercent = value / length;
    meta._guage = { values, valuePercent };
  }

  // getValuePercent({ minValue, data }, value) {
  //   const min = minValue || 0;
  //   const max = data.reduce((prev, curr) => prev + curr, min);
  //   const length = max - min;
  //   const percent = (value - min) / length;
  //   return percent;
  // }

  getWidth(chart) {
    return chart.chartArea.right - chart.chartArea.left;
  }

  getTranslation() {
    // const { chartArea, offsetX, offsetY } = chart;
    // const centerX = (chartArea.left + chartArea.right) / 2;
    // const centerY = (chartArea.top + chartArea.bottom) / 2;
    // const dx = (centerX + offsetX);
    // const dy = (centerY + offsetY);
    // TODO use center. but invalid data....
    const zero = this._cachedMeta.data[0];
    if (zero == null) {
      return { dx: 0, dy: 0 };
    }
    return { dx: zero.x, dy: zero.y };
  }

  getAngle({ chart, valuePercent }) {
    const { rotation, circumference } = chart.options;
    return rotation + (circumference * valuePercent);
  }

  /* TODO set min padding, not applied until chart.update() (also chartArea must have been set)
  setBottomPadding(chart) {
    const needleRadius = this.getNeedleRadius(chart);
    const padding = this.chart.config.options.layout.padding;
    if (needleRadius > padding.bottom) {
      padding.bottom = needleRadius;
      return true;
    }
    return false;
  },
  */

  drawNeedle() {
    const {
      ctx,
    } = this.chart;
    const {
      innerRadius,
      outerRadius,
    } = this;
    const {
      radiusPercentage,
      widthPercentage,
      lengthPercentage,
      color,
    } = this.options.needle;

    const width = this.getWidth(this.chart);
    const needleRadius = (radiusPercentage / 100) * width;
    const needleWidth = (widthPercentage / 100) * width;
    const needleLength = (lengthPercentage / 100) * (outerRadius - innerRadius) + innerRadius;

    // center
    const { dx, dy } = this.getTranslation();

    // interpolate
    // const origin = this.getAngle({ chart: this.chart, valuePercent: previous ? previous.valuePercent : 0 });
    // // TODO valuePercent is in current.valuePercent also
    // const target = this.getAngle({ chart: this.chart, valuePercent: this.getValuePercent(dataset, dataset.value) });
    // const angle = origin + (target - origin) * ease;
    const angle = this.getAngle({
      chart: this.chart,
      valuePercent: this.center.endAngle,
    });

    // draw
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(toRadians(angle - 90));
    ctx.fillStyle = color;

    // draw circle
    ctx.beginPath();
    ctx.ellipse(0, 0, needleRadius, needleRadius, 0, 0, 2 * Math.PI);
    ctx.fill();

    // draw needle
    ctx.beginPath();
    ctx.moveTo(0, needleWidth / 2);
    ctx.lineTo(needleLength, 0);
    ctx.lineTo(0, -needleWidth / 2);
    ctx.fill();

    ctx.restore();
  }

  drawValueLabel(ease) { // eslint-disable-line no-unused-vars
    if (!this.options.valueLabel.display) {
      return;
    }
    const { ctx, config } = this.chart;
    const {
      defaultFontFamily,
    } = config.options;
    const dataset = this.getDataset();
    const {
      formatter,
      fontSize,
      color,
      backgroundColor,
      borderRadius,
      padding,
      bottomMarginPercentage,
    } = this.options.valueLabel;

    const width = this.getWidth(this.chart);
    const bottomMargin = (bottomMarginPercentage / 100) * width;

    const fmt = formatter || (value => value);
    const valueText = fmt(dataset.value).toString();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    // TODO renderText
    if (fontSize) {
      ctx.font = `${fontSize}px ${defaultFontFamily}`;
    }

    // const { width: textWidth, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(valueText);
    // const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;

    const { width: textWidth } = ctx.measureText(valueText);
    // approximate height until browsers support advanced TextMetrics
    const textHeight = Math.max(ctx.measureText('m').width, ctx.measureText('\uFF37').width);

    const x = -(padding.left + textWidth / 2);
    const y = -(padding.top + textHeight / 2);
    const w = (padding.left + textWidth + padding.right);
    const h = (padding.top + textHeight + padding.bottom);

    // center
    let { dx, dy } = this.getTranslation(this.chart);
    // add rotation
    const rotation = toRadians(this.chart.options.rotation) % (Math.PI * 2.0);
    dx += bottomMargin * Math.cos(rotation + Math.PI / 2);
    dy += bottomMargin * Math.sin(rotation + Math.PI / 2);

    // draw
    ctx.save();
    ctx.translate(dx, dy);

    // draw background
    ctx.beginPath();
    addRoundedRectPath(ctx, {
      x, y, w, h, radius: borderRadius,
    });
    ctx.fillStyle = backgroundColor;
    ctx.fill();

    // draw value text
    ctx.fillStyle = color || config.options.defaultFontColor;
    const magicNumber = 0.075; // manual testing
    ctx.fillText(valueText, 0, textHeight * magicNumber);

    ctx.restore();
  }

  // overrides
  update(mode) {
    const reset = mode === 'reset';

    const meta = this._cachedMeta;
    if (meta._guage == null) {
      this._updateMeta();
    }

    const initialValue = {
      valuePercent: 0,
    };

    // animations on will call update(reset) before update()
    if (reset) {
      meta.previous = { valuePercent: 0 };
      meta.current = initialValue;
    } else {
      // dataset.data.sort((a, b) => a - b);
      meta.previous = meta.current || initialValue;
      meta.current = {
        valuePercent: meta._guage.valuePercent,
      };
    }

    const parsed = meta._parsed;
    meta._parsed = meta._guage.values;
    super.update(reset);
    meta._parsed = parsed;
  }

  // overrides
  updateElements(elements, start, count, mode) {
    const meta = this._cachedMeta;

    const parsed = meta._parsed;
    meta._parsed = meta._guage.values;
    super.updateElements(elements, start, count, mode);
    meta._parsed = parsed;

    if (elements.length === 0) {
      return;
    }
    const zero = elements[0];
    super.updateElement(this.center, undefined, {
      x: zero.x,
      y: zero.y,
      startAngle: meta.previous.valuePercent,
      endAngle: meta.current.valuePercent,
      circumference: 0,
      outerRadius: 100,
      innerRadius: 0,
      options: {},
    }, mode);
  }

  // updateElement(arc, index, properties, reset) {
  //   // TODO handle reset and options.animation
  //   super.updateElement(arc, index, properties, reset);
  //   const dataset = this.getDataset();
  //   const { data } = dataset;
  //   // const { options } = this.chart.config;
  //   // scale data
  //   const previousValue = index === 0 ? dataset.minValue : data[index - 1];
  //   const value = data[index];
  //   const startAngle = this.getAngle({ chart: this.chart, valuePercent: this.getValuePercent(dataset, previousValue) });
  //   const endAngle = this.getAngle({ chart: this.chart, valuePercent: this.getValuePercent(dataset, value) });
  //   const circumference = endAngle - startAngle;

  //   arc._model = {
  //     ...arc._model,
  //     startAngle,
  //     endAngle,
  //     circumference,
  //   };
  // }

  draw() {
    super.draw();

    this.drawNeedle();
    this.drawValueLabel();
  }
}

GaugeController.id = 'gauge';

GaugeController.version = version;

GaugeController.defaults = {
  needle: {
    // Needle circle radius as the percentage of the chart area width
    radiusPercentage: 2,
    // Needle width as the percentage of the chart area width
    widthPercentage: 3.2,
    // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
    lengthPercentage: 80,
    // The color of the needle
    color: 'rgba(0, 0, 0, 1)',
  },
  valueLabel: {
    fontSize: undefined,
    display: true,
    formatter: null,
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 5,
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    },
    bottomMarginPercentage: 5,
  },
  animation: {
    duration: 1000,
    animateRotate: true,
    animateScale: false,
  },
  // The percentage of the chart that we cut out of the middle.
  cutout: '50%',
  // The rotation of the chart, where the first data arc begins.
  rotation: -90, // -Math.PI,
  // The total circumference of the chart.
  circumference: 180, // Math.PI,
};

GaugeController.descriptors = {
  _scriptable: (name) => name !== 'formatter',
};

GaugeController.overrides = {
  aspectRatio: false,

  layout: {
    padding: {
      top: 10,
      bottom: 80,
    },
  },

  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
};

export default GaugeController;
