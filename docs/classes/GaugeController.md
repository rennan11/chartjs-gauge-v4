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

#### Defined in

[controllers/controller.gauge.ts:255](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L255)

## Properties

### center

• **center**: `ArcElement`<`ArcProps`, `ArcOptions`\>

#### Defined in

[controllers/controller.gauge.ts:253](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L253)

___

### descriptors

▪ `Static` `Readonly` **descriptors**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_scriptable` | (`name`: `string`) => `boolean` |

#### Defined in

[controllers/controller.gauge.ts:229](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L229)

___

### id

▪ `Static` `Readonly` **id**: ``"gauge"``

#### Overrides

DoughnutController.id

#### Defined in

[controllers/controller.gauge.ts:225](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L225)

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

#### Defined in

[controllers/controller.gauge.ts:233](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L233)

___

### version

▪ `Static` `Readonly` **version**: `string` = `version`

#### Defined in

[controllers/controller.gauge.ts:227](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L227)

## Methods

### \_updateMeta

▸ **_updateMeta**(): `GaugeMetaExtensions`

#### Returns

`GaugeMetaExtensions`

#### Defined in

[controllers/controller.gauge.ts:261](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L261)

___

### draw

▸ **draw**(): `void`

#### Returns

`void`

#### Overrides

DoughnutController.draw

#### Defined in

[controllers/controller.gauge.ts:484](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L484)

___

### drawNeedle

▸ **drawNeedle**(): `void`

#### Returns

`void`

#### Defined in

[controllers/controller.gauge.ts:317](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L317)

___

### drawValueLabel

▸ **drawValueLabel**(): `void`

#### Returns

`void`

#### Defined in

[controllers/controller.gauge.ts:361](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L361)

___

### getAngle

▸ **getAngle**(`valuePercent`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `valuePercent` | `number` |

#### Returns

`number`

#### Defined in

[controllers/controller.gauge.ts:295](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L295)

___

### getSize

▸ **getSize**(`value`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` \| `number` |

#### Returns

`number`

#### Defined in

[controllers/controller.gauge.ts:301](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L301)

___

### getTranslation

▸ **getTranslation**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `dx` | `number` |
| `dy` | `number` |

#### Defined in

[controllers/controller.gauge.ts:287](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L287)

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

#### Defined in

[controllers/controller.gauge.ts:437](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L437)

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

#### Defined in

[controllers/controller.gauge.ts:459](https://github.com/uk-taniyama/chartjs-gauge/blob/8340856/src/controllers/controller.gauge.ts#L459)
