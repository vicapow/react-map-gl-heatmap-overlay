'use strict';

var React = require('react');
var window = require('global/window');
var r = require('r-dom');
var WebGLHeatmap = require('webgl-heatmap');

module.exports = React.createClass({

  displayName: 'ExampleOverlay',

  propTypes: {
    locations: React.PropTypes.array.isRequired,
    latLngAccessor: React.PropTypes.func,
    intensityAccessor: React.PropTypes.func,
    sizeAccessor: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      latLngAccessor: function lagLngAccessor(location) {
        return [location.latitude, location.longitude];
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
    var canvas = this.getDOMNode();
    this._heatmap = new WebGLHeatmap({
      canvas: canvas,
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
    var project = this.props.project;
    heatmap.clear();
    this.props.locations.forEach(function each(location) {
      var size = this.props.sizeAccessor(location);
      var intensity = this.props.intensityAccessor(location);
      var pixel = project(this.props.latLngAccessor(location));
      heatmap.addPoint(pixel.x, pixel.y, size, intensity);
    }, this);
    heatmap.adjustSize();
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
