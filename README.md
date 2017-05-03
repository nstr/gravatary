# gravatary
The Gravatar Generator

* [Installation](#installation)
* [Usage](#usage)
* [Options](#options)

![demo](https://s3-eu-west-1.amazonaws.com/njnest-opensource/npm/gravatary.gif)


## Installation

```
npm i react-tab-list
```

## Usage: 


Create random gravatar
```js
import gravatary from "gravatary";

let image = gravatary(); // data:image/png;base64,...

```

Create gravatar from hashstring without options.
```js
import gravatary from "gravatary";

let image = gravatary("hashstring"); // data:image/png;base64,...

```

Create gravatar with hash and options.
```js
import gravatary from "gravatary";

let image = gravatary("hashstring", {margin: 0.08, size: 450, background: [0, 0, 0]}); // data:image/png;base64,...

```

## Options

Property | Type | Description
:---|:---|:---
margin | `float` | inner margin
size | `int` | px. size of an image
background | `array of int` | RGB background for a gravatat
