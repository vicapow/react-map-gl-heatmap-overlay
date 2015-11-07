'use strict';

var document = require('global/document');
var window = require('global/window');
var React = require('react');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var process = require('global/process');
var ExampleOverlay = require('../example-overlay');
var assign = require('object-assign');

var locations = require('example-cities');

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
        zoom: 0
      }
    };
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
      r(ExampleOverlay, {locations: locations})
    ]);
  }
});
document.body.style.margin = 0;
React.render(r(App), document.body);
