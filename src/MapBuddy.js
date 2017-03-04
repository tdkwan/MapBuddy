'use strict';

import React, { Component } from 'react';
import MapBox, { MapView } from 'react-native-mapbox-gl';
import {
        AppRegistry,
        TouchableHighlight,
        StyleSheet,
        View,
        Button,
        Alert,
        Image,
} from 'react-native';

import HomeButton from './HomeButton';
import ExploreButton from './ExploreButton';

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
            currentLocation: 'unknown',
            currentZoom: 17,
            initialDirection: 0,
            showsUserLocation: true,
            homeLocation: 'unknown',
            annotations: [
            ]
        };
    }

//when the View is mounted the initial actions,
//gets a current location for the person, and sets the initial location of
//the Mapview to that location.
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var initialLocation = position;
                this.setState({initialLocation});
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },
            {}
        )
    }

//initial callBack function for when the 'home' button is pressed, confirms the action
//calls the addHomeMarker method.
    onHomeButtonPress = () => {
        Alert.alert(
            'Set Home?',
            'Set current location as home?',
            [
                {text: 'Cancel', onPress : () => console.log('Cancel Pressed')},
                {text: 'Ok!', onPress : () => {this.addHomeMarker()}}
            ]
        );
    };

//pre: onHomeButtonPress called and Ok! was pressed on Home Alert Button
//post: sets a home annotation by treating the original annotations array as immutable and updating
    addHomeMarker = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var homeLocation = position;
                this.setState({homeLocation});
                console.log('Your current position is:');
                console.log(`Latitude : `+ this.state.homeLocation.coords.latitude);
                console.log(`Longitude: `+ this.state.homeLocation.coords.longitude);
                console.log('More or less ' + position.coords.accuracy + ' meters.');
                this.setState({
                    annotations: [...this.state.annotations, {
                        coordinates: [ this.state.homeLocation.coords.latitude, this.state.homeLocation.coords.longitude],
                        type: 'point',
                        title: 'this is the home marker',
                        id: 'home',
                        annotationImage: {
                            source: { uri: '../android/app/src/main/res/drawable/homeicon.png' },
                            height: 25,
                            width: 25
                        }
                    }]
                });
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },
            {}
        )
    };

    //function called when explore Button is pressed
    onExploreButtonPress = () => {
        var map = this._map;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                map.easeTo({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            direction: position.coords.heading,
                            pitch: 60,
                            zoomLevel: 18});
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },
            {}
        )
        /*var map = this._map;
        map.getDirection((direction) => {
            console.log(this._map);
            console.log(direction);
            map.setDirection(direction, true);
            map.setZoomLevel(18);
            map.easeTo({pitch: 30, zoomLevel: 18})
        });//could use .bind(this)*/
    };

//whenever the view changes set the state attributes of the MapView
//to match the current view.
    onRegionDidChange = (location) => {
        this.setState({
            currentZoom: location.zoomLevel,
        });
    };

    onLocateUserFailed = (location) => {
        {message: 'failed to locate user'};
    }

//sets a state of current MapView currentLocation to the currentLocation
//whenever the user changed location.
    onUpdateUserLocation = (location) => {
        this.setState({
            currentLocation: location,
        })
        console.log(this.state.currentLocation);
    }

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
                    annotations={this.state.annotations}
                    annotationPopUpEnabled={true}
                    annotationsAreImmutable={true}
                    pitchEnabled={true}
                />
                <HomeButton
                    onHomeButtonPress={this.onHomeButtonPress}
                    styles={styles}
                />
                <ExploreButton
                    onExploreButtonPress={this.onExploreButtonPress}
                    styles={styles}
                />
            </View>
        );
    }
}

//Stylesheet for MapBox in the View
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
        backgroundColor: '#519e8a',
    },
    exploreButton: {
        backgroundColor: '#476a6f',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 30,
        color: 'white',
        paddingBottom: 5,
        paddingTop: 5,
    },
});

AppRegistry.registerComponent('MapBuddy', () => MapBuddy);
