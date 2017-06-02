'use strict';
/*NEXT GOAL, saving the state of each location change, talking to gps to save the session of the
user and where he/she went, what points she tracked etc. ?datastructures ?locationlistening */
import React, { Component } from 'react';
import MapBox, { MapView } from 'react-native-mapbox-gl';
import {
        AppRegistry,
        TouchableHighlight,
        StyleSheet,
        View,
        Alert,
        Image,
        AsyncStorage,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Entypo';

const accessToken = 'pk.eyJ1IjoidGRrd2FuIiwiYSI6ImNpeXh6M2E0ZjAwOWIycW82Mmc1cm10bnQifQ.kcNY9PN_ObOcx1ZXXsXDQw';
MapBox.setAccessToken(accessToken);

/*
Class MapBuddy is the root component of the React Native App MapBuddy
*/
class MapBuddy extends Component {

/*Set the initial state with the initial mapViewLocation
the current zoomLevel, initial map orientation
Stack object for state
*/
    constructor(props) {
        super(props);
        this.state = {
            sessionNumber: 0,
            initialCenterCoordinate: 'unknown', //sets the initialCenterCoordinate of the map onLoad
            currentLocation: 'unknown',
            pastLocations: 'unknown',
            currentZoom: 17,
            initialDirection: 0,
            showsUserLocation: true,
            componentArray: [],
            homeLocation: 'unknown',
            annotations: [],
            annotationsAreImmutable: false,
            logoIsHidden: false,
            pastLocations: [],
            exploreMode: false,
            treeCounter: 0,
            holeCounter: 0,
        };
    }

    /*
    Load past state of the application, mainly testing the functionality of AsyncStorage
    */
    /*loadPastSession = () => {
        AsyncStorage.getItem()
    }*/

    /*Map Component about to mount, pre render
    gets the phones current position with success,
    timout, and error callbacks
    sets the currentLocation state field with the current position as well as setting
    the Mapbox View's intialCenterCoordinate which determines map start position
    */
    /*handlers only update state*/
    componentWillMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({currentLocation:position});
            },
            (error) => {
                alert(JSON.stringify(error));
            },
            {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } //options for getting location
        );
        //using an object as an argument to setState performs a shallow merge of past and present state
    };

    /*Ends the watch session of the navigator.geolocation.watchposition
    As well as uses asyncstorage to store the current state of the component
    (need to get past state number and determine what to set as the key for the state save for sequential session saving)
    */
    componentWillUnmount() {
        /*var stateData = JSON.stringify(this.state);
        try {
            await AsyncStorage.setItem(stateSaveKey, stateData);
        } catch (error) {
            console.log(error.message);
        }
        */
        navigator.geolocation.clearWatch(this.watchId);
    }

    //testing when user location updates prints out updated location to console
    //going to try to impement this through using the watchposition geolocation react native api function
    onUpdateUserlocation = (location) => {
        console.log(location);
    }

    /*
    Once the root component mounts mapbox watches location, and prints out each
    updated location, with each updated location updates currentLocation state field, adds current position to
    state value including the pastLocations
    logs error if error, with options for watch preferences
    */
    componentDidMount() {
        console.log(this.state.currentLocation.coords);
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({currentLocation:position});
                this.setState({
                    pastLocations: [ ...this.state.pastLocations, {
                        position
                    }]
                })
                console.log('tracked new position point');
            },
            (error) => {
                console.log(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10,
            }
        );
    }

    /*
    BUTTON HANDLERS
    */

    /*
    When the home button is pressed add an annotation at the user's currentLocation
    */
    handleHomeButtonPress = () => {
        console.log('home button pressed');
        console.log(this.state.currentLocation.coords);
        this.setState({
            annotations: [ ...this.state.annotations, {
                coordinates: [this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude],
                type: 'point',
                title: 'This is your home location!',
                id: 'home',
            }]
        })
    }

    //why can't I print the number of trees
    handleTreeButtonPress = () => {
        this.state.treeCounter += 1;
        console.log(this.state.treeCounter); //this isn't working? why?
        console.log('tree button pressed');
        this.setState({
            annotations: [ ...this.state.annotations, {
                coordinates: [this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude],
                type: 'point',
                title: 'There is a tree here!',
                id: 'tree' + this.state.treeCounter,
            }]
        })
    }

    handleHoleButtonPress = () => {
        this.state.holeCounter += 1;
        console.log('hole button pressed');
        this.setState({
            annotations: [ ...this.state.annotations, {
                coordinates: [this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude],
                type: 'point',
                title: 'There is a hole here!',
                id: 'hole' + this.state.holeCounter,
            }]
        });
    }
    /*Fired when user touches any location on the MapView
    */
    onTap = (location) => {
        console.log(location);
    };

    render() {
        return (
            <View accessible={true} style={styles.container}>
                <MapView
                    ref={map => {this._map = map;}}
                    style={styles.map}
                    styleUrl= {MapBox.mapStyles.streets}
                    //initialCenterCoordinate={this.state.intialLocation}
                    initialZoomLevel={this.state.currentZoom}
                    initialDirection={this.state.initialDirection}
                    showsUserLocation={this.state.showsUserLocation}
                    userTrackingMode={MapBox.userTrackingMode.follow}
                    onUpdateUserLocation={this.onUpdateUserLocation} //use the payload to mutate the coordinates for the polyline
                    // check for exploreCondition if true then continue to mutate the array otherwise abort action early.
                    annotations={this.state.annotations}
                    annotationPopUpEnabled={true}
                    annotationsAreImmutable={true}
                    pitchEnabled={true}
                    onTap={this.onTap}
                />
                <ActionButton buttonColor="rgba(231,76,60,1)">
                      <ActionButton.Item buttonColor='#9b59b6' title="Set Home" onPress={this.handleHomeButtonPress}>
                        <Icon name="home" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item buttonColor='#3498db' title="Tree" onPress={this.handleTreeButtonPress}>
                        <Icon name="tree" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item buttonColor='#1abc9c' title="Hole" onPress={this.handleHoleButtonPress}>
                        <Icon name="tools" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                 </ActionButton>
            </View>
        );
    }
}
//Stylesheet for MapBox in the View
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
        buttonContainer: {
            flex: 1,
            bottom: 0,
            left: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
            position: 'absolute'
        },
        actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
        },
        roundedButton: {
            width: 100,
            padding: 10,
            height: 45,
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: '#519e8a'
        },
        buttonTextStyle: {
            fontSize: 20,
            color: 'white',
        },
    });


AppRegistry.registerComponent('MapBuddy', () => MapBuddy);
