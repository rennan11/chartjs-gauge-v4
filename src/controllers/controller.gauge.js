/* eslint-disable class-methods-use-this */
import { DoughnutController, ArcElement } from 'chart.js';
import {
  addRoundedRectPath, renderText, toFont, toPercentage, toRadians, toTRBLCorners,
} from 'chart.js/helpers';
import { version } from '../../package.json';

class GaugeController extends DoughnutController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    // center for needle.
    this.center = new ArcElement();
  }

  _updateMeta() {
    const meta = this._cachedMeta;
    const data = meta._parsed;
    if (data.length === 0) {
      meta._guage = {
        values: [],
        valuePercent: 0,
      };
    }

    const { value = 0, minValue = 0 } = this.getDataset();
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

  getTranslation() {
    const zero = this._cachedMeta.data[0];
    if (zero == null) {
      return { dx: 0, dy: 0 };
    }
    return { dx: zero.x, dy: zero.y };
  }

  getAngle(valuePercent) {
    const { rotation, circumference } = this.chart.options;
    return toRadians(rotation + (circumference * valuePercent));
  }

  getSize(value) {
    return toPercentage(value, this.outerRadius) * this.outerRadius;
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
      radius,
      width,
      length,
      color,
    } = this.options.needle;

    const needleRadius = this.getSize(radius);
    const needleWidth = this.getSize(width);
    const needleLength = this.getSize(length);

    // center
    const { dx, dy } = this.getTranslation();

    // interpolate
    const angle = this.getAngle(this.center.endAngle);

    // draw
    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate(angle);
    ctx.fillStyle = color;

    // draw circle
    ctx.beginPath();
    ctx.ellipse(0, 0, needleRadius, needleRadius, 0, 0, 2 * Math.PI);
    ctx.fill();

    // draw needle
    ctx.beginPath();
    ctx.moveTo(-needleWidth / 2, 0);
    ctx.lineTo(0, -needleLength);
    ctx.lineTo(needleWidth / 2, 0);
    ctx.fill();

    ctx.restore();
  }

  drawValueLabel() {
    if (!this.options.valueLabel.display) {
      return;
    }
    const { ctx } = this.chart;
    const dataset = this.getDataset();
    const {
      color,
      formatter,
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius,
      padding,
      offsetX,
      offsetY,
    } = this.options.valueLabel;
    const font = toFont(this.options.valueLabel.font);

    const fmt = formatter || (value => value);
    const valueText = fmt(dataset.value).toString();

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = font.string;

    // const { width: textWidth, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(valueText);
    // const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
    const { width: textWidth } = ctx.measureText(valueText);
    // approximate height until browsers support advanced TextMetrics
    // const textHeight = Math.max(ctx.measureText('m').width, ctx.measureText('\uFF37').width);
    const { lineHeight: textHeight } = font;

    const x = -(padding.left + textWidth / 2) - borderWidth;
    const y = -(padding.top + textHeight / 2) - borderWidth;
    const w = (padding.left + textWidth + padding.right) + 2 * borderWidth;
    const h = (padding.top + textHeight + padding.bottom) + 2 * borderWidth;

    // center
    let { dx, dy } = this.getTranslation();
    dx += this.getSize(offsetX);
    dy += this.getSize(offsetY);

    // draw
    ctx.translate(dx, dy);

    // draw background
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    addRoundedRectPath(ctx, {
      x, y, w, h, radius: toTRBLCorners(borderRadius),
    });
    ctx.closePath();
    ctx.fill();
    if (borderWidth) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    // draw value text
    const magicNumber = 0.075; // manual testing
    ctx.fillStyle = color;
    renderText(ctx, valueText, 0, textHeight * magicNumber, font, {});
    ctx.restore();
  }

  // overrides
  update(mode) {
    const reset = mode === 'reset';

    const meta = this._cachedMeta;
    this._updateMeta();

    const initialValue = 0;

    // animations on will call update(reset) before update()
    if (reset) {
      meta.previous = initialValue;
      meta.current = initialValue;
    } else {
      meta.previous = meta.current || initialValue;
      meta.current = meta._guage.valuePercent;
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
      startAngle: meta.previous,
      endAngle: meta.current,
      circumference: 0,
      outerRadius: 100,
      innerRadius: 0,
      options: {},
    }, mode);
  }

  draw() {
    super.draw();

    if (this._cachedMeta._guage.values.length === 0) {
      return;
    }
    this.drawNeedle();
    this.drawValueLabel();
  }
}

GaugeController.id = 'gauge';

GaugeController.version = version;

GaugeController.defaults = {
  needle: {
    // Needle circle radius as the percentage of the chart radius
    radius: '10%',
    // Needle width as the percentage of the chart radius
    width: '15%',
    // Needle length as the percentage of the chart radius
    length: '80%',
    // The color of the needle
    color: 'rgba(0, 0, 0, 1)',
  },
  valueLabel: {
    font: undefined,
    display: true,
    formatter: null,
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    borderRadius: 5,
    borderColor: null,
    borderWidth: 0,
    padding: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    },
    offsetX: 0,
    offsetY: 0,
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
