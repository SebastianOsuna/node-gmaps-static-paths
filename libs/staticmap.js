var polyline = require('polyline'),
    request = require('request'),
    fs = require('fs'),
    isArray = require('isarray');


module.exports = function (gmapsKey) {

  this.BASE_URL = "https://maps.googleapis.com/maps/api/staticmap?";

  /*
  getMap(points, [options [, filename [, callback]]]).
  See #getUrl default options.
  {filename} File name to write the downloaded image. If no file name is provided,
    the request stream is returned.
  {callback} Callback to be called after image is downloaded. callback = fn(error)
  */
  this.getMap = function (points, options, filename, callback) {
    var r = request(this.getUrl(points, options));
    if (filename) {
      r.pipe(fs.createWriteStream(filename));

      if (callback) {
        r.on('close', callback);
      }
    } else {
      return r;
    }
  };

  /*
  {options.center} Coordinates or location name to center the image into. ex
    options.center = [<lat>, <lot>]
    options.center = 'New York city'
    options.center = '<lat>,<lot>'
  {options.zoom} Integer between 0 and 21 representing the zoom of the image.
  {options.size} String of the desired pixel size of the image. Defaults to '500x500'.
  {options.maptype} Desired maptype. Defaults to 'roadmap'.
  {points} List of points of the path to paint.
    points = [ [<lat>, <lot>], ... ]
  */
  this.getUrl = function (points, options) {
    options = options || {};
    // Clean inputs
    if (options.center && isArray(options.center)) {
      options.center = options.center[0] + ',' + options.center[1];
    }

    if (options.zoom && (!parseInt(options.zoom) || options.zoom < 0 || options.zoom > 21)) {
      options.zoom = undefined;
    }

    options.size = options.size || '500x500';
    options.maptype = options.size || 'roadmap';

    points = points || [];

    // Build the url
    var params = [];
    params.push('size='+options.size);
    params.push('maptype='+options.maptype);
    if (options.center) {
      params.push('center='+encodeURIComponent(options.center));
    }
    if (options.zoom) {
      params.push('zoom='+options.zoom);
    }
    if (gmapsKey) {
      params.push('key='+gmapsKey);
    }

    params.push("path="+makePath(points, { encoded: true }));

    var url = this.BASE_URL + params.join('&');

    if (url.length > 2048) {
      throw 'Url too long. Think about cutting off some points';
    }

    return url;
  };

  /*
  {options.encoded} Set to true if you want to encode the points in google esque polyline:
    https://developers.google.com/maps/documentation/utilities/polylinealgorithm.
    This is used to reduce the size of the generated url.
  {options.weight} weight of the painting stroke
  {options.color} Color of the line
  {options.fillColor} Filling color for polygons
  {options.geodesic} Paint line in geodesic mode
  */
  function makePath (points, options) {
    // Set defaults
    options = options || {};

    var path = options.encoded ?
    // Case 1: Encoded
    "enc:" + polyline.encode(points) :
    // Case 2: Not encoded
    points.map(function (p) {
      return p.join(',');
    }).join(separator)
    ;

    return (options.weight ? "weight:"+options.weight+separator : '') +
           (options.color ? "color:"+options.color+separator : '') +
           (options.fillColor ? "fillColor:"+options.fillColor+separator : '') +
           (options.geodesic ? "geodesic:"+options.geodesic+separator : '') +
           path;
  }

  function makeMarker (lat, lot, color, label, icon, size) {
    color = color || (icon ? '' : 'blue');
    return "color:"+color+separator+
            "label:"+(label || '')+separator+
            (size ? "size:"+size+separator : "")+
            (icon ? "icon:"+encodeURIComponent(icon)+separator : "")
            lat + "," + lot;
  }

  return this;
};
