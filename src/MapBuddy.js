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
} from 'react-native';
import Button from 'react-native-button';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import MapButton from './MapButton';

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
            initialLocation: 'unknown',
            currentLocation: 'unknown',
            currentZoom: 17,
            initialDirection: 0,
            showsUserLocation: true,
            componentArray: [],
            homeLocation: 'unknown',
            annotations: [
            ],
            annotationsAreImmutable: false,
            logoIsHidden: false,
            pastLocations: [],
            exploreMode: false
        };
    }

/*
Initial Actions when the main View component is mounted:
gets a current location for the person, and sets the initial location of
the Mapview to that location.
*/
    componentWillMount() {

    }


    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({initialLocation: position});
                this.setState({currentLocation: position});
                this.setState({
                                pastLocations: [...this.state.pastLocations, {
                                   latitude: position.coords.latitude,
                                   longitude: position.coords.longitude,
                               }]
                           });
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },
            {}
        )

    }

/*
initial callBack function for when the 'home' button is pressed, confirms the action
calls the addHomeMarker method.
*/
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

/*
pre: onHomeButtonPress called and the action was confirmed
post: sets a home annotation by treating the original annotations array as immutable and updating.
*/
    addHomeMarker = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var currentLocation = position;
                this.setState({homeLocation: currentLocation});
                console.log('Your current position is:');
                console.log(`Latitude : `+ currentLocation.coords.latitude);
                console.log(`Longitude: `+ currentLocation.coords.longitude);
                console.log('More or less ' + position.coords.accuracy + ' meters.');
                this.setState({
                    pastLocations: [...this.state.pastLocations, {currentLocation}],
                    annotations: [ ...this.state.annotations, {
                        //Insert a new point marker for the home
                        coordinates: [ currentLocation.coords.latitude, currentLocation.coords.longitude],
                        type: 'point',
                        title: 'this is the home marker',
                        id: 'home',
                        annotationImage: {
                            source: { uri: '../android/app/src/main/res/drawable/homeicon.png' },
                            height: 25,
                            width: 25
                        }
                    },
                    {
                        coordinates: [[currentLocation.coords.latitude, currentLocation.coords.longitude]],
                        type: 'polyline',
                        title: 'this is the path traveled',
                        id: 'path',
                    },
                    ]
                });
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },

        )
    };

    //function called when explore Button is pressed
    //changes the pitch and the zoom to enter into explore mode,
    //initiate logging of locations to then draw polylines.
    //we are going to have to update a 2d array of coordinates in an object in the annotations array of objects that defines the lines
    //on each location change.
    onExploreButtonPress = () => {
        this.state.componentArray.push("Mark Object");
        this.setState({
            exploreMode: true,
            componentArray: this.state.componentArray
        });
        var map = this._map;
        map.easeTo({
                    latitude: this.state.currentLocation.coords.latitude,
                    longitude: this.state.currentLocation.coords.longitude,
                    direction: this.state.currentLocation.coords.heading,
                    pitch: 60,
                    zoomLevel: 19});


    //    var annotationsCoordinate = this.state.annotations[1].coordinates;
        //this.setState((prevState) => {
        //});
        console.log(this.state.annotations[1].coordinates);

        /*    },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            },
            {}
        )
        console.log(this.state.exploreMode);
        /*
        var map = this._map;
        map.getDirection((direction) => {
            console.log(this._map);
            console.log(direction);
            map.setDirection(direction, true);
            map.setZoomLevel(18);
            map.easeTo({pitch: 30, zoomLevel: 18})
        });
        //could use .bind(this)
        */
    }

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
//if the exploreMode is on then starts adding each location update onto the pastLocations
//state field.
//HAVE TO FIND A WAY TO APPEND locations onto the annotations "polyline array"
    onUpdateUserLocation = (location) => {
        //if it is in explore mode then update the new gps point onto the pastLocations state field array.
        //else simply changes the current location to the current location.
        console.log(location);
        var newLocation = [location.latitude, location.longitude]
        if (this.state.exploreMode) {
            this.setState({
                pastLocations: [ ...this.state.pastLocations,
                    {location},
                ]
            });
            this.setState((prevState, props) => {
                annotations:  prevState.annotations[1].coordinates.concat(newLocation);
            });
        } else {
            this.setState({
                currentLocation: location,
            });
            console.log(this.state.currentLocation);
        }
    }

    render() {

        let componentArray = this.state.componentArray.map((buttonName,index) => {
            return <ActionButton buttonColor="rgba(231,76,60,1)">
                      <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
                        <Icon name="ios-add-circle" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
                        <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
                        <Icon name="md-done-all" style={styles.actionButtonIcon} />
                      </ActionButton.Item>
                    </ActionButton>
        })
        return (
            <View accessible={true} accessibilityLabel={'Map view'} style={styles.container}>
                <MapView
                    ref={map => {this._map = map;}}
                    style={styles.map}
                    styleUrl= {MapBox.mapStyles.streets}
                    //initialCenterCoordinate={this.state.intialLocation}
                    initialZoomLevel={this.state.currentZoom}
                    initialDirection={this.state.initialDirection}
                    showsUserLocation={this.state.showsUserLocation}
                    userTrackingMode={MapBox.userTrackingMode.follow}
                    // onUpdateUserLocation={ } use the payload to mutate the coordinates for the polyline
                    // check for exploreCondition if true then continue to mutate the array otherwise abort action early.
                    annotations={this.state.annotations}
                    annotationPopUpEnabled={true}
                    annotationsAreImmutable={true}
                    pitchEnabled={true}
                />
                { componentArray }
                    <ActionButton buttonColor="rgba(231,76,60,1)">
                        <ActionButton.Item
                            buttonColor='#FF4242'
                            title="Home"
                            onPress={this.onHomeButtonPress}>
                            <Icon name="ios-home" style={styles.actionButtonIcon} />
                        </ActionButton.Item>
                    </ActionButton>
                    <Button
                        onPress={this.onExploreButtonPress}
                        containerStyle={styles.roundedButton}
                        style={styles.buttonTextStyle}>
                        Explore
                    </Button>

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
