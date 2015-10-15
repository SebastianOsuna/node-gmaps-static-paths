# Static Google Maps paths

Generate an Static Google Map url to draw a path on a map.

## Usage

Install

```
npm install gmaps-static-paths --save
```

Require

```javascript
var gmapsPaths = require('gmaps-static-paths')(GMAPS_KEY);
```

Generate urls

```javascript
var url = gmapsPaths.getUrl([ [40.749825,-73.987963], [40.752946,-73.987384], [40.755823,-73.986397] ]);
```

Or download the image

```javascript
gmapsPaths.getMap([ [40.749825,-73.987963], [40.752946,-73.987384], [40.755823,-73.986397] ], {}, './mymap.png');
```

## CONTRIBUTING

Currently only accepting PR's. I don't have much time to work on new features.

Help with documentations, test and all that jazz is greatly appreciated.
