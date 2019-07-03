import React, { Component } from 'react';
import moment from 'moment';

import '../../lib/heremaps/mapsjs-core';
import '../../lib/heremaps/mapsjs-service';
import '../../lib/heremaps/mapsjs-mapevents';
import '../../lib/heremaps/mapsjs-ui';
import '../../lib/heremaps/mapsjs-ui.css';

const APP_ID = '0mlcV0cgriT99bqfpFGJ';
const APP_CODE = '3RSXrWG9iAEvw46QKU-zdw';

// US coords
const center = {
  lat: 37.0905723,
  lng: -97.3139057,
};

class MapField extends Component {
  constructor(props) {
    super(props);

    this.setMarkers = this.setMarkers.bind(this);
    this.setIcon = this.setIcon.bind(this);
  }

  componentDidMount() {
    const { markers, routes, infos } = this.props;
    let linestring;
    let waypointsMarkers = this.setMarkers(), endMarker, startMarker;
    let routeMarkers = [];
    let mapObject = [];
    const iconStart = this.setIcon('S')
    const iconEnd = this.setIcon('E')

    this.platform = new window.H.service.Platform({
      'app_id': APP_ID,
      'app_code': APP_CODE,
    });

    this.pixelRatio = window.devicePixelRatio || 1;

    this.mapTypes = this.platform.createDefaultLayers({
      tileSize: this.pixelRatio === 1 ? 256 : 512,
      ppi: this.pixelRatio === 1 ? undefined : 320,
    });

    const mapConfig = {
      zoom: 4,
      pixelRatio: this.pixelRatio,
    };

    this.map = new window.H.Map(
      document.getElementById('mapContainer'),
      this.mapTypes.normal.map,
      mapConfig,
    );

    this.enableEvents();

    const ui = this.ui = window.H.ui.UI.createDefault(this.map, this.mapTypes);

    this.group = new window.H.map.Group();
    this.map.addObject(this.group);

    this.group.addEventListener('tap', (evt) => {
      // event target is the marker itself, group is a parent event target
      // for all objects that it contains
      const bubble =  new window.H.ui.InfoBubble(evt.target.getPosition(), {
        // read custom data
        content: evt.target.getData()
      });

      console.log(ui);
      // show info bubble
      ui.addBubble(bubble);
    }, false);

    // Create a linestring to use as a point source for the route line
    linestring = new window.H.geo.LineString();

    let centered = {};

    if(routes && routes.length) {

      (routes || []).forEach((route, index) => {
        centered = { lat: route[0], lng: route[1] };
        const current = {
          lat: route[0],
          lng: route[1]
        };
        routeMarkers.push(current);
      })
    } else {
      // Push all the points in the shape into the linestring:
      (markers || []).forEach(function(point, index) {
        linestring.pushLatLngAlt(point[0], point[1]);
        if (index === markers.length - 1) {
          endMarker = new window.H.map.Marker({
            lat: point[0],
            lng: point[1]
          }, {icon: iconEnd});
        }
        if (index === 1) {
          startMarker = new window.H.map.Marker({
            lat: point[0],
            lng: point[1]
          }, {icon: iconStart});
        }
      });
    }

    if (routeMarkers && routeMarkers.length > 0) {
      // mapObject = [...routeMarkers]
      const iconFA = this.setIconFA();
      routeMarkers.forEach((coords, idx) => {
        this.addMarkerToGroup(this.group, coords, {icon: iconFA}, this.getMarkerInfo(infos[idx]));
      })
      // // Add the route polyline and the two markers to the map:
      // this.map.addObjects(mapObject);
      this.map.setZoom(12);
      this.map.setCenter(centered);
    } else {
      if (linestring.getPointCount()) {
        let routeLine = new window.H.map.Polyline(linestring, {
          style: { strokeColor: '#35d2b7', lineWidth: 10 }
        });

        // map object
        mapObject = [routeLine, startMarker, endMarker, ...waypointsMarkers]

        // Add the route polyline and the two markers to the map:
        this.map.addObjects(mapObject);
        this.map.setViewBounds(routeLine.getBounds());
        this.map.setZoom(12);
      }
    }
  }

  addMarkerToGroup(group, coordinate, markerOptions, html) {
    const marker = new window.H.map.Marker(coordinate, markerOptions);
    marker.setData(html);
    group.addObject(marker);
  }

  getMarkerInfo({ routeNumber, routeDateTime }) {
    const time = moment(routeDateTime).format('h:mm a');
    const date = moment(routeDateTime).format('MM/DD/YYYY');
    return `
      <div>
        <h3>Route ${routeNumber}</h3>
        <p>Arrive ${time} ${date}</p>
      </div>
    `;
  }

  setMarkers() {
    const { waypoints } = this.props;
    let markers = [];

    (waypoints || []).map(point => {
      let indexIcon = this.setIcon(point.index);

      if (point.type !== 'start' && point.type !== 'end') {
        markers.push(
          new window.H.map.Marker(
            { lat: point.mapppedCoordinates.lat, lng: point.mapppedCoordinates.lng },
            { icon: indexIcon },
          ),
        );
      }
    })

    return markers;
  }

  setIcon(name) {
    const svgStartMarkup = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <rect stroke="white" fill="#4c38e6" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt"
    font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">${name}</text></svg>`;
    const icon = new window.H.map.Icon(svgStartMarkup);
    return icon;
  }

  setIconFA() {
    const svgStartMarkup = `<svg width="24" height="24" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="car-side" class="svg-inline--fa fa-car-side fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
      <path fill="#4c38e6" d="M544 192h-16L419.22 56.02A64.025 64.025 0 0 0 369.24 32H155.33c-26.17 0-49.7 15.93-59.42 40.23L48 194.26C20.44 201.4 0 226.21 0 256v112c0 8.84 7.16 16 16 16h48c0 53.02 42.98 96 96 96s96-42.98 96-96h128c0 53.02 42.98 96 96 96s96-42.98 96-96h48c8.84 0 16-7.16 16-16v-80c0-53.02-42.98-96-96-96zM160 432c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48zm72-240H116.93l38.4-96H232v96zm48 0V96h89.24l76.8 96H280zm200 240c-26.47 0-48-21.53-48-48s21.53-48 48-48 48 21.53 48 48-21.53 48-48 48z"></path></svg>`;
    const icon = new window.H.map.Icon(svgStartMarkup);
    return icon;
  }

  enableEvents() {
    // Enable the event system
    const events = new window.H.mapevents.MapEvents(this.map);
    const behavior = new window.H.mapevents.Behavior(events);
  }

  render() {
    const { className } = this.props;
    return (
      <div className={className || 'map-container'}
        id="mapContainer"
      />
    );
  }
}

export default MapField;