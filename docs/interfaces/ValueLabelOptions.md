[chartjs-gauge-v3 - v3.0.0-beta.1](../README.md) / ValueLabelOptions

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

___

### borderColor

• **borderColor**: `Color`

The border color of the label.

___

### borderRadius

• **borderRadius**: `number`

The border radius of the label.

**`Default`**

5

___

### borderWidth

• **borderWidth**: `number`

The border width of the label.

___

### color

• **color**: `Color`

The text color of the label.

___

### display

• **display**: `boolean`

If true, display the value label.

**`Default`**

true

___

### font

• **font**: `FontSpec`

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

___

### offsetX

• **offsetX**: `string` \| `number`

The offset x from needle center x.
String ending with '%' means percentage of the chart radius, number means pixels.

**`Default`**

0

___

### offsetY

• **offsetY**: `string` \| `number`

The offset y from needle center y.
String ending with '%' means percentage of the chart radius, number means pixels.

**`Default`**

0

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
