import * as React from "react";
import { Button, View, Text, TextInput,Dimensions } from "react-native";
import HomeCard from "../containers/container/HomeCard";
import { ActionSheetIOS } from "react-native";
import { Edit } from "../containers/container/TextEditer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function NewPost({ navigation }) {
  return (
    <View style={{ flex: 1, height: windowHeight, width: windowWidth }}>
      <Edit></Edit>
    </View>
  );
}
