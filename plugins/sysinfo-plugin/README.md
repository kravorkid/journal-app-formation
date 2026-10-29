# sysinfo-plugin

Info systeme

## Install

To use npm

```bash
npm install sysinfo-plugin
````

To use yarn

```bash
yarn add sysinfo-plugin
```

Sync native files

```bash
npx cap sync
```

## API

<docgen-index>

* [`getInfo()`](#getinfo)
* [`getFreeSpace()`](#getfreespace)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### getInfo()

```typescript
getInfo() => Promise<SysInfoResult>
```

**Returns:** <code>Promise&lt;<a href="#sysinforesult">SysInfoResult</a>&gt;</code>

--------------------


### getFreeSpace()

```typescript
getFreeSpace() => Promise<FreeSpaceResult>
```

**Returns:** <code>Promise&lt;<a href="#freespaceresult">FreeSpaceResult</a>&gt;</code>

--------------------


### Interfaces


#### SysInfoResult

| Prop               | Type                |
| ------------------ | ------------------- |
| **`manufacturer`** | <code>string</code> |
| **`model`**        | <code>string</code> |
| **`osVersion`**    | <code>string</code> |
| **`sdkInt`**       | <code>number</code> |


#### FreeSpaceResult

| Prop            | Type                |
| --------------- | ------------------- |
| **`freeBytes`** | <code>number</code> |

</docgen-api>
