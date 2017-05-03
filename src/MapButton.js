'use strict';

import React, { Component } from 'react';

const Platform = require('Platform');
import {
        Button,
        TouchableHighlight,
        TouchableOpacity,
        Alert,
        View,
        StyleSheet,
        Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class MapButton extends Component {
    render() {
        return(
            <View style={}>
                <TouchableHighlight onPress={this.props.onPress}>
                    <Icon name={this.props.iconName} style={styles.buttonIcon}/>
                </TouchableHighlight>
            </View>
        );
    }

    const styles = StyleSheet.create({
        buttonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
        },
    })
}
