'use strict';

var React = require('react');
var window = require('global/window');
var r = require('r-dom');
var SVGOverlay = require('react-map-gl/src/overlays/svg.react');
var assign = require('object-assign');

module.exports = React.createClass({

  displayName: 'ExampleOverlay',

  propTypes: {
    locations: React.PropTypes.array.isRequired
  },

  render: function render() {
    return r(SVGOverlay, assign({}, this.props, {
      redraw: function redraw(opt) {
        return r.g(this.props.locations.map(function map(location) {
          var pixel = opt.project([location.latitude, location.longitude]);
          return r.circle({
            cx: pixel.x,
            cy: pixel.y,
            r: 10,
            style: {
              fill: 'rgba(0, 0, 0, 0.5)',
              pointerEvents: 'all',
              cursor: 'pointer'
            },
            onClick: function onClick() {
              window.location.href = 'https://en.wikipedia.org' + location.wiki;
            }
          });
        }));
      }.bind(this)
    }));
  }
});
