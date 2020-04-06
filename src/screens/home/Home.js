import * as React from "react";
import { View, InteractionManager, Text,StyleSheet } from "react-native";
import HomeCard from "../../containers/container/HomeCard";
import { Navigation } from "../../conponets/Navigation";

export default function Home({ navigation: { navigate, addListener } }, props) {
  const title = "新增日記";
  return (
    <View style={styles.container}>
      <HomeCard />
      <Navigation
        rightClick={(e) => navigate("New",{type:0})}
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
