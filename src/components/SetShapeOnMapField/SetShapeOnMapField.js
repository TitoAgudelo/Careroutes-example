import React, { Component } from 'react';

import '../../lib/heremaps/mapsjs-core';
import '../../lib/heremaps/mapsjs-service';
import '../../lib/heremaps/mapsjs-mapevents';

import './SetShapeOnMapField.scss';


const APP_ID = '0mlcV0cgriT99bqfpFGJ';
const APP_CODE = '3RSXrWG9iAEvw46QKU-zdw';

const STATUS = {
    INIT: 'Click on map to set initial top left point of restricted area',
    ONE_LEFT: 'Click on map to set end bottom right point of restricted area',
    RESET: 'Click anywhere on map to reset restricted area',
};

// US coords
const center = {
    lat: 37.0905723,
    lng: -97.3139057,
};

class SetShapeOnMapField extends Component {
    constructor(props) {
        super(props);

        const { topLeft, bottomRight } = props.bounds || {};

        this.state = {
            topLeft: topLeft || null,
            bottomRight: bottomRight || null,
            message: STATUS.INIT,
        };

        this.handleTapOnMap = this.handleTapOnMap.bind(this);
    }

    componentDidMount() {
        const { topLeft, bottomRight } = this.state;
        const mapConfig = {
            zoom: 4,
            center,
        };

        this.platform = new window.H.service.Platform({
            'app_id': APP_ID,
            'app_code': APP_CODE,
        });

        this.mapTypes = this.platform.createDefaultLayers();

        this.map = new window.H.Map(
            document.getElementById('mapContainer'),
            this.mapTypes.normal.map,
            mapConfig,
        );

        this.enableEvents();

        if (topLeft && bottomRight) {
            this.addShapeToMap();
        }

        if (!topLeft && !bottomRight) {
            // Add tap-listener
            this.map.addEventListener('tap', this.handleTapOnMap);
        }
    }

    enableEvents() {
        // Enable the event system
        const events = new window.H.mapevents.MapEvents(this.map);
        const behavior = new window.H.mapevents.Behavior(events);
    }

    handleTapOnMap(event) {
        const { topLeft, bottomRight } = this.state;
        const pointer = event.currentPointer;

        // Create geo.Point
        const latLng  = this.map.screenToGeo(pointer.viewportX, pointer.viewportY);

        if (topLeft && bottomRight) {
            this.setState({
                topLeft: null,
                bottomRight: null,
                message: STATUS.INIT,
            }, () => {
                this.map.removeObject(this.restrictedArea);
            });

            return;
        }

        if (!topLeft) {
            this.setState({
                topLeft: latLng,
                message: STATUS.ONE_LEFT,
            }, () => {
                const { topLeft } = this.state;
                this.topLeftMaker = new window.H.map.Marker(topLeft);
                this.map.addObject(this.topLeftMaker);
            });
        } else if (!bottomRight) {
            this.setState({
                bottomRight: latLng,
                message: STATUS.RESET,
            }, () => {
                // Remove top left marker
                this.map.removeObject(this.topLeftMaker);
                // Add restricted area to map
                this.addShapeToMap();
            });
        }
    }

    addShapeToMap() {
        const { topLeft, bottomRight } = this.state;
        // Create restricted area in rectangle shape
        this.restrictedArea = new window.H.map.Rect(
            new window.H.geo.Rect(
                topLeft.lat,
                topLeft.lng,
                bottomRight.lat,
                bottomRight.lng,
            ),
        );

        // Add the rectangle to the map
        this.map.addObject(this.restrictedArea);

        // Zoom the map to fit the rectangle
        this.map.setViewBounds(this.restrictedArea.getBounds());

        if (this.props.onChange) {
            this.props.onChange({ topLeft, bottomRight });
        }
    }

    render() {
        const { className } = this.props;
        const { message } = this.state;
        return (
            <React.Fragment>
                <p>{message}</p>
                <div
                    className={className || 'map-container'}
                    id="mapContainer"
                />
            </React.Fragment>
        );
    }
}

export default SetShapeOnMapField;