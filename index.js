'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var Immutable = require('immutable');
var window = require('global/window');
var document = require('global/document');
var r = require('r-dom');
var WebGLHeatmap = require('webgl-heatmap');
var ViewportMercator = require('viewport-mercator-project');
var viridis = require('scale-color-perceptual/hex/viridis.json');

module.exports = createReactClass({

  displayName: 'HeatmapOverlay',

  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    locations: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.instanceOf(Immutable.List)
    ]),
    lngLatAccessor: PropTypes.func.isRequired,
    intensityAccessor: PropTypes.func.isRequired,
    sizeAccessor: PropTypes.func.isRequired,
    gradientColors: PropTypes.instanceOf(Immutable.List).isRequired
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
      },
      gradientColors: Immutable.List(viridis)
    };
  },

  _prevGradientColors: null,
  _gradientTexture: null,

  componentDidMount: function componentDidMount() {
    this._update();
  },

  componentDidUpdate: function componentDidUpdate() {
    this._update();
  },

  componentWillUnmount: function componentWillUnmount() {
    // Clean up!
    this._heatmap = null;
  },

  /**
    * Updates `this._gradientTexture` Image if `props.gradientColors`
    * has changed.
    * @returns {Image} `this._gradientTexture`.
    */
  _getGradientTexture: function _getGradientTexture() {
    // Only update the texture when the gradient has changed.
    if (this._prevGradientColors === this.props.gradientColors) {
      return this._gradientTexture;
    }
    var canvas = document.createElement('canvas');
    // 512, 10 because these are the same dimensions webgl-heatmap uses for its
    // built in gradient textures.
    var width = 512;
    var height = 10;
    canvas.width = String(width);
    canvas.height = String(height);
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0, height / 2, width, height / 2);
    var colors = this.props.gradientColors;
    colors.forEach(function each(color, index) {
      var position = index / (colors.size - 1);
      gradient.addColorStop(position, color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    var image = new window.Image();
    image.src = canvas.toDataURL('image/png');
    return image;
  },

  _redraw: function _redraw() {
    var mercator = ViewportMercator(this.props);
    this._heatmap.clear();
    this._heatmap.adjustSize();
    this.props.locations.forEach(function each(location) {
      var size = this.props.sizeAccessor(location);
      var intensity = this.props.intensityAccessor(location);
      var pixel = mercator.project(this.props.lngLatAccessor(location));
      this._heatmap.addPoint(pixel[0], pixel[1], size, intensity);
    }, this);
    this._heatmap.update();
    this._heatmap.display();
  },

  _update: function _update() {
    var gradientTexture = this._getGradientTexture();
    if (this._gradientTexture !== gradientTexture) {
      this._heatmap = new WebGLHeatmap({
        canvas: this.refs.overlay,
        intensityToAlpha: true,
        alphaRange: [0, 0.1],
        gradientTexture: gradientTexture
      });
      this._gradientTexture = gradientTexture;
    }
    this._redraw();
    this._prevGradientColors = this.props.gradientColors;
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
