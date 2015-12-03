'use strict';

var React = require('react');
var Immutable = require('immutable');
var window = require('global/window');
var r = require('r-dom');
var WebGLHeatmap = require('webgl-heatmap');
var ViewportMercator = require('viewport-mercator-project');

module.exports = React.createClass({

  displayName: 'HeatmapOverlay',

  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    longitude: React.PropTypes.number.isRequired,
    latitude: React.PropTypes.number.isRequired,
    zoom: React.PropTypes.number.isRequired,
    locations: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.instanceOf(Immutable.List)
    ]),
    lngLatAccessor: React.PropTypes.func.isRequired,
    intensityAccessor: React.PropTypes.func.isRequired,
    sizeAccessor: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      lngLatAccessor: function lngLatAccessor(location) {
        return [location.longitude, location.latitude];
      },
      intensityAccessor: function intensityAccessor(location) {
        return 1 / 10;
      },
      sizeAccessor: function sizeAccessor(location) {
        return 40;
      }
    };
  },

  componentDidMount: function componentDidMount() {
    this._heatmap = new WebGLHeatmap({
      canvas: this.refs.overlay,
      intensityToAlpha: true,
      alphaRange: [0, 0.1]
    });
    this._redraw();
  },

  componentWillUnmount: function componentWillUnmount() {
    this._heatmap = null;
  },

  componentDidUpdate: function componentDidUpdate() {
    this._redraw();
  },

  _redraw: function _redraw() {
    var heatmap = this._heatmap;
    var mercator = ViewportMercator(this.props);
    heatmap.clear();
    heatmap.adjustSize();
    this.props.locations.forEach(function each(location) {
      var size = this.props.sizeAccessor(location);
      var intensity = this.props.intensityAccessor(location);
      var pixel = mercator.project(this.props.lngLatAccessor(location));
      heatmap.addPoint(pixel[0], pixel[1], size, intensity);
    }, this);
    heatmap.update();
    heatmap.display();
  },

  render: function render() {
    var pixelRatio = window.devicePixelRatio || 1;
    return r.canvas({
      ref: 'overlay',
      width: this.props.width * pixelRatio,
      height: this.props.height * pixelRatio,
      style: {
        width: this.props.width + 'px',
        height: this.props.height + 'px',
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0
      }
    });
  }
});
