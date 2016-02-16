# react-map-gl-heatmap-overlay

A heatmap overlay for [react-map-gl](https://github.com/uber/react-map-gl) built
using [webgl-heatmap](https://github.com/vicapow/webgl-heatmap) originally
created by [Florian Boesch](https://github.com/pyalot).

![screen shot 2016-02-15 at 1 54 42 pm](https://cloud.githubusercontent.com/assets/583385/13063531/e1571cf6-d3fd-11e5-8691-d08d1b481f4a.png)

## Usage

````js
var HeatmapOverlay = require('react-map-gl-heatmap-overlay');
var cities = require('example-cities');
````

Where each element in cities looks like: `{longitude, latitude}`.

````js
    render() {
      return <MapGL {...viewport}>
        <HeatmapOverlay locations={cities} {...viewport}/>
      </MapGL>;
    }
````

The `locations` prop can be an array or ImmutableJS List.

## Accessors

Data accessors can be provided if your data doesn't fit the expected
`{longitude, latitude}` form.

````js
    render() {
      return <MapGL ...viewport>
        <HeatmapOverlay locations={houses} {...viewport}
          lngLatAccessor={(house) => [house.get('lng'), house.get('lat')]} />
      </MapGL>;
    }
````

Other accessors and their defaults:

````js
    intensityAccessor: (location) => {1 / 10}
    sizeAccessor: (location) => 40,
    // If not specified, defaults to Viridis.
    gradientColors: Immutable.List(['blue', 'red'])
````

## Installation

    npm install react-map-gl-heatmap-overlay

## Developing

    npm run start

To run the example.

## Attribution

 The included example uses raster tiles by [Stamen Design](http://stamen.com),
 under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0). Data by
[OpenStreetMap](http://openstreetmap.org), under
[CC BY SA](http://creativecommons.org/licenses/by-sa/3.0).
