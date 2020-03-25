import React, { Component } from "react";
import { View, Text, Image, SafeAreaView, FlatList } from "react-native";
import {
  Card,
  ListItem,
  Button,
  Icon,
  Avatar,
  Header
} from "react-native-elements";
import styles from "./styles";
// implemented without image with header

const users = [
  {
    name: "brynn",
    avatar: "./123"
  }
];
const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba"
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63"
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72"
  },
  {
    id: "58650f-3da1-471f-bd96-145571e29d88"
  },
  {
    id: "58650c-3dd1-aaaa-bd96-145571e29d88"
  }
];
function Item({ title }) {
  return (
    <Card title="CARD WITH DIVIDER">
      {users.map((u, i) => {
        return (
          <View key={i} style={styles.user}>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{ require: u.avatar }}
            />
            <Text style={[styles.name, styles.blue]}>{u.name}</Text>
          </View>
        );
      })}
    </Card>
  );
}

export default class HomeCard extends Component {
  render() {
    return (
      <SafeAreaView style={[styles.HomeCard, styles.blue]}>
        <FlatList
          data={DATA}
          renderItem={({ item }) => <Item />}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}
