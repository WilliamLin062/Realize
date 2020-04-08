import * as React from "react";
import {View,Dimensions } from "react-native";
import { Edit } from "../containers/container/TextEditer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function NewPost({ navigation: { navigate, setOptions } }) {
  return (
    <View style={{ flex: 1, height: windowHeight, width: windowWidth }}>
      <Edit
        click={(e) => {
          navigate("Home");
        }}
      ></Edit>
    </View>
  );
}
