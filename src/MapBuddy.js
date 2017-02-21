'use strict';

import React, { Component } from 'react';
import MapBox, { MapView } from 'react-native-mapbox-gl';
import {
        AppRegistry,
        StyleSheet,
        View,
        Button,
        Alert
} from 'react-native';
import MyButton from './MyButton';

const accessToken = 'pk.eyJ1IjoidGRrd2FuIiwiYSI6ImNpeXh6M2E0ZjAwOWIycW82Mmc1cm10bnQifQ.kcNY9PN_ObOcx1ZXXsXDQw';
MapBox.setAccessToken(accessToken);
/*Class MapBuddy is the root component of the React Native App MapBuddy*/
class MapBuddy extends Component {
    /*Set the initial state with the initial mapViewLocation
    the current zoomLevel, initial map orientation
    */
    constructor(props) {
        super(props);
        this.state = {
            initialLocation: 'unknown',
            currentZoom: 17,
            initialDirection: 0,
            showsUserLocation: true,
            homeLocation: 'unknown',
            annotations: [{
                coordinates: [40.72052634, -73.97686958312988],
                type: 'point',
                title: 'This is marker 1',
                source: { uri: 'https://cldup.com/9Lp0EaBw5s.png' },
                    height: 25,
                    width: 25
                }
            ]
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialLocation = JSON.stringify(position);
                this.setState({initialLocation});
            }
        )
    }

    onHomeButtonPress = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var homeLocation = JSON.stringify(position);
                this.setState({homeLocation: homeLocation});
            }
        )
        Alert.alert(
            'Set Home?',
            'Set current location as home?',
            [
                {text: 'Cancel', onPress : () => console.log('Cancel Pressed')},
                {text: 'Ok!', onPress : () => {this.addHomeMarker()}}
            ]
        );
    };

    addHomeMarker = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var homeLocation = JSON.stringify(position);
                this.setState({homeLocation:homeLocation});
            }
        )
        this.setState({
            annotations: [ ...this.state.annotations, {
                coordinates:[this.state.homeLocation.latitude, this.state.homeLocation.longitude],
                type: 'point',
                title: 'Home',
                annotationImage: {
                    source: { uri: '../img/home-icon'},
                    height: 10,
                    width: 10,
                }
            }]
        })
    }

    onRegionDidChange = (location) => {
        this.setState({
                currentZoom: location.zoomLevel
        });
    };


    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref={map => {this._map = map; } }
                    style={styles.map}
                    styleUrl= {MapBox.mapStyles.streets}
                    //initialCenterCoordinate={this.state.intialLocation}
                    initialZoomLevel={this.state.currentZoom}
                    initialDirection={this.state.initialDirection}
                    showsUserLocation={this.state.showsUserLocation}
                    userTrackingMode={MapBox.userTrackingMode.follow}
                />
                <MyButton
                    onHomeButtonPress={this.onHomeButtonPress}
                    styles={styles}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    map: {
        flex: 1
    },
    homeButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        paddingRight: 25,
        paddingBottom: 25
    },
});

AppRegistry.registerComponent('MapBuddy', () => MapBuddy);
