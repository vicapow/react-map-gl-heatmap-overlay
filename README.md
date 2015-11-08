# react-map-gl-heatmap-overlay

A heatmap overlay for [https://github.com/uber/react-map-gl](react-map-gl) built
using [https://github.com/vicapow/webgl-heatmap](webgl-heatmap).

![](screenshot.png)

## Usage

````js
var HeatmapOverlay = require('react-map-gl-heatmap-overlay');
var cities = require('example-cities');
````

Where each element in cities looks like: `{latitude, longitude}`.

````js
    render: function render() {
      return <MapGL ...viewportProps>
        <HeatmapOverlay locations={cities} />
      </MapGL>;
    }
````