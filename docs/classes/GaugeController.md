[chartjs-gauge-v3 - v3.0.0-alpha.1](../README.md) / [Exports](../modules.md) / GaugeController

# Class: GaugeController

## Hierarchy

- `DoughnutController`

  ↳ **`GaugeController`**

## Table of contents

### Constructors

- [constructor](GaugeController.md#constructor)

### Properties

- [center](GaugeController.md#center)
- [descriptors](GaugeController.md#descriptors)
- [id](GaugeController.md#id)
- [overrides](GaugeController.md#overrides)
- [version](GaugeController.md#version)

### Methods

- [\_updateMeta](GaugeController.md#_updatemeta)
- [draw](GaugeController.md#draw)
- [drawNeedle](GaugeController.md#drawneedle)
- [drawValueLabel](GaugeController.md#drawvaluelabel)
- [getAngle](GaugeController.md#getangle)
- [getSize](GaugeController.md#getsize)
- [getTranslation](GaugeController.md#gettranslation)
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

### center

• **center**: `ArcElement`<`ArcProps`, `ArcOptions`\>

___

### descriptors

▪ `Static` `Readonly` **descriptors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_scriptable` | (`name`: `string`) => `boolean` |

___

### id

▪ `Static` `Readonly` **id**: ``"gauge"``

#### Overrides

DoughnutController.id

___

### overrides

▪ `Static` `Readonly` **overrides**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aspectRatio` | `boolean` |
| `layout` | { `padding`: { `bottom`: `number` = 80; `top`: `number` = 10 }  } |
| `layout.padding` | { `bottom`: `number` = 80; `top`: `number` = 10 } |
| `layout.padding.bottom` | `number` |
| `layout.padding.top` | `number` |
| `plugins` | { `legend`: { `display`: `boolean` = false } ; `tooltip`: { `enabled`: `boolean` = false }  } |
| `plugins.legend` | { `display`: `boolean` = false } |
| `plugins.legend.display` | `boolean` |
| `plugins.tooltip` | { `enabled`: `boolean` = false } |
| `plugins.tooltip.enabled` | `boolean` |

___

### version

▪ `Static` `Readonly` **version**: `string` = `version`

## Methods

### \_updateMeta

▸ **_updateMeta**(): `GaugeMetaExtensions`

#### Returns

`GaugeMetaExtensions`

___

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

### getAngle

▸ **getAngle**(`valuePercent`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `valuePercent` | `number` |

#### Returns

`number`

___

### getSize

▸ **getSize**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` |

#### Returns

`number`

___

### getTranslation

▸ **getTranslation**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `dx` | `number` |
| `dy` | `number` |

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
