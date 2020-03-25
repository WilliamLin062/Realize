import React, { Component } from "react";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { View, Alert } from "react-native";



var alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
                   'catalysts for change. Dynamically revolutionize.';
export  class Btn extends Component {
    constructor(props){
        super(props)
    }
  render() {
    return (
      <View>
        <Button
          icon={<Icon name="arrow-right" size={15} color="white" />}
          iconRight
          title="Button with right icon"
        />
      </View>
    );
  }
}
