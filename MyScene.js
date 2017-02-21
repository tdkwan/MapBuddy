import React, { Component, PropTypes } from 'react';
import { View, Text, TouchableHighlight, Image} from 'react-native';

export default class MyScene extends Component {
  _onPressButton() {
    console.log("You Tapped the Button");
  }


  render() {
    return (
      <View>
        <Text>Current Scene: {this.props.title}</Text>

        <TouchableHighlight onPress={this.props.onForward}>
          <Text>Tap me to load the next scene</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.props.onBack}>
          <Text>Tap me to go back</Text>
        </TouchableHighlight>

        <TouchableHighlight onPress={this.props.onForward}>
          <Image source={require('./icons/icon.jpg')}/>
        </TouchableHighlight>
      </View>
    )
  }
}

MyScene.propTypes = {
  title: PropTypes.string.isRequired,
  onForward: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};
