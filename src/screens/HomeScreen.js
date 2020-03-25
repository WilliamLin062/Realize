import * as React from "react";
import { View } from "react-native";
import HomeCard from "../containers/container/HomeCard";
import { ActionSheetIOS } from "react-native";
import { Btn } from "../containers/container/BtnGroup";
import NewPost from "./NewPost";
import { NavigationContainer } from "@react-navigation/native";
import { Button } from "react-native-elements";

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <HomeCard></HomeCard>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Button
          onPress={() =>
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: ["Cancel", "Remove"],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0
              },
              buttonIndex => {
                if (buttonIndex === 1) {
                  /* destructive action */
                }
              }
            )
          }
          title="動作"
        />
        <Button onPress={() => navigation.navigate("New")} title="新增" />
      </View>
    </View>
  );
}
