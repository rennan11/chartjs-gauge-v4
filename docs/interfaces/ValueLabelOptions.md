[chartjs-gauge-v3 - v3.0.0-alpha.1](../README.md) / [Exports](../modules.md) / ValueLabelOptions

# Interface: ValueLabelOptions

## Table of contents

### Properties

- [backgroundColor](ValueLabelOptions.md#backgroundcolor)
- [borderColor](ValueLabelOptions.md#bordercolor)
- [borderRadius](ValueLabelOptions.md#borderradius)
- [borderWidth](ValueLabelOptions.md#borderwidth)
- [color](ValueLabelOptions.md#color)
- [display](ValueLabelOptions.md#display)
- [font](ValueLabelOptions.md#font)
- [formatter](ValueLabelOptions.md#formatter)
- [offsetX](ValueLabelOptions.md#offsetx)
- [offsetY](ValueLabelOptions.md#offsety)
- [padding](ValueLabelOptions.md#padding)

## Properties

### backgroundColor

• **backgroundColor**: `Color`

The background color of the label.

#### Defined in

[controllers/controller.gauge.ts:78](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L78)

___

### borderColor

• **borderColor**: `Color`

The border color of the label.

#### Defined in

[controllers/controller.gauge.ts:83](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L83)

___

### borderRadius

• **borderRadius**: `number`

The border radius of the label.

**`Default`**

5

#### Defined in

[controllers/controller.gauge.ts:94](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L94)

___

### borderWidth

• **borderWidth**: `number`

The border width of the label.

#### Defined in

[controllers/controller.gauge.ts:88](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L88)

___

### color

• **color**: `Color`

The text color of the label.

#### Defined in

[controllers/controller.gauge.ts:73](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L73)

___

### display

• **display**: `boolean`

If true, display the value label.

**`Default`**

true

#### Defined in

[controllers/controller.gauge.ts:62](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L62)

___

### font

• **font**: `FontSpec`

#### Defined in

[controllers/controller.gauge.ts:131](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L131)

___

### formatter

• `Optional` **formatter**: (`value`: `number`) => `string` \| `number`

#### Type declaration

▸ (`value`): `string` \| `number`

Returns the string representation of the value as it should be displayed on the chart.

**`Default`**

Math.round

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

##### Returns

`string` \| `number`

#### Defined in

[controllers/controller.gauge.ts:68](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L68)

___

### offsetX

• **offsetX**: `string` \| `number`

The offset x from needle center x.
String ending with '%' means percentage of the chart radius, number means pixels.

**`Default`**

0

#### Defined in

[controllers/controller.gauge.ts:123](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L123)

___

### offsetY

• **offsetY**: `string` \| `number`

The offset y from needle center y.
String ending with '%' means percentage of the chart radius, number means pixels.

**`Default`**

0

#### Defined in

[controllers/controller.gauge.ts:130](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L130)

___

### padding

• **padding**: `Object`

The padding of the label.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bottom` | `number` | **`Default`**  5 |
| `left` | `number` | **`Default`**  5 |
| `right` | `number` | **`Default`**  5 |
| `top` | `number` | **`Default`**  5 |

#### Defined in

[controllers/controller.gauge.ts:99](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L99)
