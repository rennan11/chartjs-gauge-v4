[chartjs-gauge-v3 - v3.0.0-beta.1](../README.md) / GaugeController

# Class: GaugeController

## Hierarchy

- `DoughnutController`

  ↳ **`GaugeController`**

## Table of contents

### Constructors

- [constructor](GaugeController.md#constructor)

### Properties

- [id](GaugeController.md#id)

### Methods

- [draw](GaugeController.md#draw)
- [drawNeedle](GaugeController.md#drawneedle)
- [drawValueLabel](GaugeController.md#drawvaluelabel)
- [update](GaugeController.md#update)
- [updateElements](GaugeController.md#updateelements)

## Constructors

### constructor

• **new GaugeController**(`chart`, `datasetIndex`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `chart` | `Chart`<keyof `ChartTypeRegistry`, (``null`` \| `number` \| `ScatterDataPoint` \| `BubbleDataPoint`)[], `unknown`\> |
| `datasetIndex` | `number` |

#### Overrides

DoughnutController.constructor

## Properties

### id

▪ `Static` `Readonly` **id**: ``"gauge"``

#### Overrides

DoughnutController.id

## Methods

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Overrides

DoughnutController.draw

___

### drawNeedle

▸ **drawNeedle**(): `void`

#### Returns

`void`

___

### drawValueLabel

▸ **drawValueLabel**(): `void`

#### Returns

`void`

___

### update

▸ **update**(`mode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | ``"normal"`` \| ``"none"`` \| ``"hide"`` \| ``"show"`` \| ``"active"`` \| ``"resize"`` \| ``"reset"`` |

#### Returns

`void`

#### Overrides

DoughnutController.update

___

### updateElements

▸ **updateElements**(`elements`, `start`, `count`, `mode`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `elements` | `Element`<`AnyObject`, `AnyObject`\>[] |
| `start` | `number` |
| `count` | `number` |
| `mode` | ``"normal"`` \| ``"none"`` \| ``"hide"`` \| ``"show"`` \| ``"active"`` \| ``"resize"`` \| ``"reset"`` |

#### Returns

`void`

#### Overrides

DoughnutController.updateElements
