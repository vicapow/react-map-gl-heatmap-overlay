'use strict';

var document = require('global/document');
var window = require('global/window');
var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var r = require('r-dom');
var MapGL = require('react-map-gl');
var HeatmapOverlay = require('../');
var assign = require('object-assign');
var locations = require('example-cities');
var rasterTileStyle = require('raster-tile-style');

var tileSource = '//tile.stamen.com/toner/{z}/{x}/{y}.png';
var mapStyle = Immutable.fromJS(rasterTileStyle([tileSource]));

var App = React.createClass({

  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: 0,
        longitude: 0,
        zoom: 2
      },
      mapStyle: mapStyle
    };
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('resize', function onResize() {
      this.setState({
        viewport: assign({}, this.state.viewport, {
          width: window.innerWidth,
          height: window.innerHeight
        })
      });
    }.bind(this));
  },

  _onChangeViewport: function _onChangeViewport(viewport) {
    this.setState({viewport: assign({}, this.state.viewport, viewport)});
  },

  render: function render() {
    return r(MapGL, assign({}, this.state.viewport, {
      onChangeViewport: this._onChangeViewport,
      mapStyle: this.state.mapStyle
    }), [
      r(HeatmapOverlay, assign({}, this.state.viewport, {
        locations: locations,
        // Semantic zoom
        sizeAccessor: function sizeAccessor() {
          return 60;
        }
        // Geometric zoom
        // sizeAccessor: function sizeAccessor() {
        //   return 30 * Math.pow(2, this.state.viewport.zoom - 0);
        // }
      }))
    ]);
  }
});

var reactContainer = document.createElement('div');
document.body.style.margin = '0';
document.body.appendChild(reactContainer);
ReactDOM.render(r(App), reactContainer);
