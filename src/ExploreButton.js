import React, { Component } from 'react';

import {
        Button,
        TouchableHighlight,
        Alert,
        View,
        StyleSheet,
        Text
} from 'react-native';

export default class ExploreButton extends Component {
    render() {
        return(
            <TouchableHighlight onPress={this.props.onExploreButtonPress}>
                <View style={this.props.styles.exploreButton}>
                    <Text style={this.props.styles.buttonText}>EXPLORE</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
