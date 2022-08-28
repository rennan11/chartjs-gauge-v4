/* eslint-disable class-methods-use-this */
import {
  DoughnutController,
  ArcElement,
  Chart,
  DoughnutControllerChartOptions,
  DoughnutControllerDatasetOptions,
  DoughnutDataPoint,
  DoughnutMetaExtensions,
  ArcProps,
  UpdateMode,
  Element,
  FontSpec,
  Color,
} from 'chart.js';
import {
  addRoundedRectPath, renderText, toFont, toPercentage, toRadians, toTRBLCorners,
} from 'chart.js/helpers';
import type { DeepPartial } from 'chart.js/types/utils';
// @ts-ignore
import { version } from '../../package.json';

export interface NeedleOptions {
  /**
   * Needle circle.
   * String ending with '%' means percentage of the chart radius, number means pixels.
   * @default '10%'
   */
  radius: number | string;

  /**
   * Needle width.
   * String ending with '%' means percentage of the chart radius, number means pixels.
   * @default '15%'
   */
  width: number | string;

  /**
   * Needle length.
   * String ending with '%' means percentage of the chart radius, number means pixels.
   * @default '80%'
   */
  length: number | string;

  /**
   * The color of the needle
   */
  color: Color;
}

const needleDefaults: Partial<NeedleOptions> = {
  radius: '10%',
  width: '15%',
  length: '80%',
};

export interface ValueLabelOptions {
  /**
   * If true, display the value label.
   * @default true
   */
  display: boolean;

  /**
   * Returns the string representation of the value as it should be displayed on the chart.
   * @default Math.round
   */
  formatter?: (value: number) => number | string;

  /**
   * The text color of the label.
   */
  color: Color;

  /**
   * The background color of the label.
   */
  backgroundColor: Color;

  /**
   * The border color of the label.
   */
  borderColor: Color;

  /**
   * The border width of the label.
   */
  borderWidth: number;

  /**
   * The border radius of the label.
   * @default 5
   */
  borderRadius: number;

  /**
   * The padding of the label.
   */
  padding: {
    /**
     * @default 5
     */
    top: number;
    /**
     * @default 5
     */
    right: number;
    /**
     * @default 5
     */
    bottom: number;
    /**
     * @default 5
     */
    left: number;
  };

  /**
   * The offset x from needle center x.
   * String ending with '%' means percentage of the chart radius, number means pixels.
   * @default 0
   */
  offsetX: number | string;

  /**
   * The offset y from needle center y.
   * String ending with '%' means percentage of the chart radius, number means pixels.
   * @default 0
   */
  offsetY: number | string;
  font: FontSpec;
}

const valueLabelDefaults: Partial<ValueLabelOptions> = {
  display: true,
  font: undefined,
  formatter: Math.round,
  color: undefined,
  backgroundColor: undefined,
  borderColor: undefined,
  borderWidth: 0,
  borderRadius: 5,
  padding: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5,
  },
  offsetX: 0,
  offsetY: 0,
};

/**
 * `
 * cutout: '50%',
 * rotation: -90,
 * circumference: 180,
 * `
 */
export interface GaugeControllerChartOptions extends DoughnutControllerChartOptions {
  needle: NeedleOptions;
  valueLabel: ValueLabelOptions;
}

const defaults: DeepPartial<GaugeControllerChartOptions> = {
  needle: needleDefaults,
  valueLabel: valueLabelDefaults,
  animation: {
    animateRotate: true,
    animateScale: false,
  },
  // The percentage of the chart that we cut out of the middle.
  cutout: '50%',
  // The rotation of the chart, where the first data arc begins.
  rotation: -90, // -Math.PI
  // The total circumference of the chart.
  circumference: 180, // 2 * Math.PI,
};

export interface GaugeControllerDatasetOptions extends DoughnutControllerDatasetOptions {
  /**
   * Value used for the needle.
   * @default 0
   */
  value: number;

  /**
   * Value used for the needle.
   * @default 0
   */
  minValue: number;
}

export type GaugeDataPoint = DoughnutDataPoint;

/**
 * @private
 */
export interface GaugeMetaExtensions extends DoughnutMetaExtensions {
  // DoughnutMetaExtensions private member
  _parsed: number[];

  _gauge: {
    values: number[];
    valuePercent: number;
  }
  previous: number;
  current: number;
}

declare module 'chart.js' {
  interface ChartTypeRegistry {
    gauge: {
      chartOptions: GaugeControllerChartOptions;
      datasetOptions: GaugeControllerDatasetOptions;
      defaultDataPoint: GaugeDataPoint;
      metaExtensions: GaugeMetaExtensions;
      parsedDataType: number;
      scales: keyof CartesianScaleTypeRegistry;
    };
  }
}

export class GaugeController extends DoughnutController {
  static readonly id = 'gauge';

  static readonly version = version;

  static readonly descriptors = {
    _scriptable: (name: string) => name !== 'formatter',
  };

  static readonly overrides = {
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

  center: ArcElement;

  constructor(chart: Chart, datasetIndex: number) {
    super(chart, datasetIndex);
    // center for needle.
    this.center = new ArcElement({});
  }

  _updateMeta() {
    const meta: GaugeMetaExtensions = this._cachedMeta as any;
    const data = meta._parsed;
    if (data.length === 0) {
      meta._gauge = {
        values: [],
        valuePercent: 0,
      };
    }

    const dataset: GaugeControllerDatasetOptions = this.getDataset() as any;
    const { value = 0, minValue = 0 } = dataset;
    const maxValue = data.length > 0 ? data[data.length - 1] : minValue + 1;

    const values: number[] = [];
    data.reduce((prev, curr) => {
      values.push(curr - prev);
      return curr;
    }, minValue);
    const length = maxValue - minValue;
    const valuePercent = value / length;
    meta._gauge = { values, valuePercent };

    return meta;
  }

  getTranslation() {
    const zero = this._cachedMeta.data[0];
    if (zero == null) {
      return { dx: 0, dy: 0 };
    }
    return { dx: zero.x, dy: zero.y };
  }

  getAngle(valuePercent: number) {
    const options: GaugeControllerChartOptions = this.chart.options as any;
    const { rotation, circumference } = options;
    return toRadians(rotation + (circumference * valuePercent));
  }

  getSize(value: string | number) {
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
    // @ts-ignore
    const { options } = this;
    const {
      ctx,
    } = this.chart;
    const {
      radius,
      width,
      length,
      color,
    } = options.needle;

    const needleRadius = this.getSize(radius);
    const needleWidth = this.getSize(width);
    const needleLength = this.getSize(length);

    // center
    const { dx, dy } = this.getTranslation();

    // interpolate
    const angle = this.getAngle((this.center as any as ArcProps).endAngle);

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
    // @ts-ignore
    const { options } = this;
    const { valueLabel } = options;
    if (!valueLabel.display) {
      return;
    }
    const { ctx } = this.chart;
    const dataset: GaugeControllerDatasetOptions = this.getDataset() as any;
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
    } = valueLabel;
    const font = toFont(valueLabel.font);

    const { value } = dataset;
    const valueText = (formatter ? formatter(value) : value).toString();

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = font.string;

    // const { width: textWidth, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(valueText);
    // const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
    const { width: textWidth } = ctx.measureText(valueText);
    // approximate height until browsers support advanced TextMetrics
    // const textHeight = Math.max(ctx.measureText('m').width, ctx.measureText('\uFF37').width);
    const { lineHeight } = font;
    const textHeight = (lineHeight as any) * 1;

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
    renderText(ctx, valueText, 0, textHeight * magicNumber, font, {
      textAlign: 'center',
      textBaseline: 'middle',
    });
    ctx.restore();
  }

  // overrides
  update(mode: UpdateMode) {
    const reset = mode === 'reset';

    const meta = this._updateMeta();
    const initialValue = 0;

    // animations on will call update(reset) before update()
    if (reset) {
      meta.previous = initialValue;
      meta.current = initialValue;
    } else {
      meta.previous = meta.current || initialValue;
      meta.current = meta._gauge.valuePercent;
    }

    const parsed = meta._parsed;
    meta._parsed = meta._gauge.values;
    super.update(mode);
    meta._parsed = parsed;
  }

  // overrides
  updateElements(elements: Element[], start: number, count: number, mode: UpdateMode): void {
    const meta: GaugeMetaExtensions = this._cachedMeta as any;

    const parsed = meta._parsed;
    meta._parsed = meta._gauge.values;
    super.updateElements(elements, start, count, mode);
    meta._parsed = parsed;

    if (elements.length === 0) {
      return;
    }
    const zero = elements[0];
    // TODO center:ArcElementがElementとして、判定されないのだが.....
    super.updateElement(this.center as any, undefined, {
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

    const meta: GaugeMetaExtensions = this._cachedMeta as any;
    if (meta._gauge.values.length === 0) {
      return;
    }
    this.drawNeedle();
    this.drawValueLabel();
  }
}

GaugeController.defaults = defaults;

export default GaugeController;
