# react-map-gl-example-overlay

An example of a standalone react-map-gl-overlay

![](screenshot.png)

## Usage

````js
var ExampleOverlay = require('react-map-gl-example-overlay');
var cities = require('example-cities');
````

Where each element in cities looks like: `{latitude, longitude}`.

````js
    render: function render() {
      return <MapGL ...viewportProps>
        <ExampleOverlay locations={cities} />
      </MapGL>;
    }
````