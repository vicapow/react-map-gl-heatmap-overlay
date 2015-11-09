'use strict';

var document = require('global/document');
var window = require('global/window');
var React = require('react');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var process = require('global/process');
var HeatmapOverlay = require('../');
var assign = require('object-assign');

var locations = require('example-cities');

var INITIAL_ZOOM = 0;

function scaleRelativeToZoom(radius, relativeToZoom, zoom) {
  return radius * Math.pow(2, zoom) / Math.pow(2, relativeToZoom);
}

// This will get converted to a string by envify
/* eslint-disable no-process-env */
var mapboxApiAccessToken = process.env.MapboxAccessToken;
/* eslint-enable no-process-env */

var App = React.createClass({

  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      appWidth: window.innerWidth,
      appHeight: window.innerHeight,
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: INITIAL_ZOOM
      }
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', function onResize() {
      this.setState({
        appWidth: window.innerWidth,
        appHeight: window.innerHeight
      });
    }.bind(this));
  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    this.setState({viewport: viewport});
  },

  render: function render() {
    var props = assign({}, this.state.viewport, {
      width: this.state.appWidth,
      height: this.state.appHeight,
      mapboxApiAccessToken: mapboxApiAccessToken,
      onChangeViewport: this._onChangeViewport
    });
    return r(MapGL, props, [
      r(HeatmapOverlay, {
        locations: locations,
        // Semantic zoom
        sizeAccessor: function sizeAccessor() {
          return 60;
        }
        // Geometric zoom
        // sizeAccessor: function sizeAccessor() {
        //   return scaleRelativeToZoom(30, 0, this.state.viewport.zoom);
        // }.bind(this)
      })
    ]);
  }
});
document.body.style.margin = 0;
React.render(r(App), document.body);
