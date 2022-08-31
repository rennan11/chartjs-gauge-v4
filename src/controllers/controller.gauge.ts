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
   * The color of the needle.
   * (Color)[https://www.chartjs.org/docs/latest/api/#color]
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
   * The font size of the label.
   * (FontSpec)[https://www.chartjs.org/docs/latest/api/interfaces/FontSpec.html]
   */
  font: FontSpec;

  /**
   * Returns the string representation of the value as it should be displayed on the chart.
   * @default Math.round
   */
  formatter?: (value: number) => number | string;

  /**
   * The text color of the label.
   * (Color)[https://www.chartjs.org/docs/latest/api/#color]
   */
  color: Color;

  /**
   * The background color of the label.
   * (Color)[https://www.chartjs.org/docs/latest/api/#color]
   */
  backgroundColor: Color;

  /**
   * The border color of the label.
   * (Color)[https://www.chartjs.org/docs/latest/api/#color]
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
 * [DoughnutControllerChartOptions](https://www.chartjs.org/docs/3.6.0/api/interfaces/DoughnutControllerChartOptions.html)
 * ```
 * cutout: '50%',
 * rotation: -90,
 * circumference: 180,
 * ```
 */
export interface GaugeControllerChartOptions extends DoughnutControllerChartOptions {
  needle: NeedleOptions;
  valueLabel: ValueLabelOptions;
  /**
   * Value used for the needle.
   * @default 0
   */
  value: number;

  /**
    * Used to offset the start value.
    * @default 0
    */
  minValue: number;
}

const defaults: DeepPartial<GaugeControllerChartOptions> = {
  needle: needleDefaults,
  valueLabel: valueLabelDefaults,
  animation: {
    animateRotate: true,
    animateScale: false,
  },
  cutout: '50%',
  rotation: -90, // -Math.PI
  circumference: 180, // 2 * Math.PI,
  value: 0,
  minValue: 0,
};

/**
 * [DoughnutControllerDatasetOptions](https://www.chartjs.org/docs/3.6.0/api/interfaces/DoughnutControllerDatasetOptions.html)
 */
export interface GaugeControllerDatasetOptions extends DoughnutControllerDatasetOptions {
}

export type GaugeDataPoint = DoughnutDataPoint;

/**
 * @private
 */
export interface GaugeMetaExtensions extends DoughnutMetaExtensions {
  // DoughnutMetaExtensions private member
  _parsed: number[];
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

  /** @internal */
  static readonly version = version;

  /** @internal */
  static readonly defaults = defaults;

  /** @internal */
  static readonly descriptors = {
    _scriptable: (name: string) => name !== 'formatter',
  };

  /** @internal */
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

  /** @internal */
  center: ArcElement;

  values: number[];

  valuePercent: number;

  previous: number;

  current: number;

  constructor(chart: Chart, datasetIndex: number) {
    super(chart, datasetIndex);
    // center for needle.
    this.center = new ArcElement({});
    this.values = [];
    this.valuePercent = 0;
    this.previous = 0;
    this.current = 0;
  }

  /** @internal */
  _updateMeta() {
    const meta: GaugeMetaExtensions = this._cachedMeta as any;
    const data = meta._parsed;
    this.values = [];
    this.valuePercent = 0;
    if (data.length === 0) {
      return meta;
    }

    const options: GaugeControllerChartOptions = (this as any).options as any;
    const { value = 0, minValue = 0 } = options;
    const maxValue = data.length > 0 ? data[data.length - 1] : minValue + 1;

    data.reduce((prev, curr) => {
      this.values.push(curr - prev);
      return curr;
    }, minValue);
    const length = maxValue - minValue;
    this.valuePercent = value / length;

    return meta;
  }

  /** @internal */
  _getTranslation() {
    const zero = this._cachedMeta.data[0];
    if (zero == null) {
      return { dx: 0, dy: 0 };
    }
    return { dx: zero.x, dy: zero.y };
  }

  /** @internal */
  _getAngle(valuePercent: number) {
    // NOTE options is private member......
    const options: GaugeControllerChartOptions = (this as any).options as any;
    const { rotation, circumference } = options;
    return toRadians(rotation + (circumference * valuePercent));
  }

  /** @internal */
  _getSize(value: string | number) {
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
    // NOTE options is private member......
    const options: GaugeControllerChartOptions = (this as any).options as any;
    const {
      ctx,
    } = this.chart;
    const {
      radius,
      width,
      length,
      color,
    } = options.needle;

    const needleRadius = this._getSize(radius);
    const needleWidth = this._getSize(width);
    const needleLength = this._getSize(length);

    // center
    const { dx, dy } = this._getTranslation();

    // interpolate
    const angle = this._getAngle((this.center as any as ArcProps).endAngle);

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
    // NOTE options is private member......
    const options: GaugeControllerChartOptions = (this as any).options as any;
    const { valueLabel } = options;
    if (!valueLabel.display) {
      return;
    }
    const { ctx } = this.chart;
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

    const { value } = options;
    const valueText = (formatter ? formatter(value) : value).toString();

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = font.string;

    // const { width: textWidth, actualBoundingBoxAscent, actualBoundingBoxDescent } = ctx.measureText(valueText);
    // const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
    const { width: textWidth } = ctx.measureText(valueText);
    // TODO ほかのところはどうやっているかを見て真似をしよう！
    // approximate height until browsers support advanced TextMetrics
    // const textHeight = Math.max(ctx.measureText('m').width, ctx.measureText('\uFF37').width);
    const { lineHeight } = font;
    const textHeight = (lineHeight as any) * 1;

    const x = -(padding.left + textWidth / 2) - borderWidth;
    const y = -(padding.top + textHeight / 2) - borderWidth;
    const w = (padding.left + textWidth + padding.right) + 2 * borderWidth;
    const h = (padding.top + textHeight + padding.bottom) + 2 * borderWidth;

    // center
    let { dx, dy } = this._getTranslation();
    dx += this._getSize(offsetX);
    dy += this._getSize(offsetY);

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

    // animations on will call update(reset) before update()
    if (reset) {
      this.previous = 0;
      this.current = 0;
    } else {
      this.previous = this.current || 0;
      this.current = this.valuePercent;
    }

    const parsed = meta._parsed;
    meta._parsed = this.values;
    super.update(mode);
    meta._parsed = parsed;
  }

  // overrides
  updateElements(elements: Element[], start: number, count: number, mode: UpdateMode): void {
    const meta: GaugeMetaExtensions = this._cachedMeta as any;

    const parsed = meta._parsed;
    meta._parsed = this.values;
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
      startAngle: this.previous,
      endAngle: this.current,
      circumference: 0,
      outerRadius: 100,
      innerRadius: 0,
      options: {},
    }, mode);
  }

  draw() {
    super.draw();

    if (this.values.length === 0) {
      return;
    }
    this.drawNeedle();
    this.drawValueLabel();
  }
}

export default GaugeController;
