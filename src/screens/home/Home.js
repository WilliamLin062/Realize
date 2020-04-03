import * as React from "react";
import { View, InteractionManager } from "react-native";
import HomeCard from "../../containers/container/HomeCard";
import { ActionSheetIOS, StyleSheet } from "react-native";
import NewPost from "../NewPost";
import { NavigationContainer } from "@react-navigation/native";
import { NavigationEvents } from "react-navigation";
import { Navigation } from "../../conponets/Navigation";

export default function Home({ navigation: { navigate } }, props) {
  const title = "add new";
  return (
    <View style={styles.container}>
     <HomeCard />
      <Navigation
        // leftIcon={require('../../assets/images/icon_search.png')}
        rightClick={(e) => navigate("New")}
        rightText={title}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
