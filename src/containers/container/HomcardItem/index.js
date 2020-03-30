import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("db.db");
export default class Items extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      Items: null
    };
  }
 
  componentDidMount() {
    this.update();
  }
  update() {
    db.transaction(tx => {
      tx.executeSql(
        `select * from diary;`,
        [],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      );
    });
  }
  render() {
    const { items } = this.state;
    if (items === null || items.length === 0) {
      return null;
    }
    return (
      <View>
        {items.map(({ id, content, title }) => {
          <TouchableOpacity
            key={id}
            onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
          >
             <Text style={{}}>{title}</Text>
            <Text style={{}}>{content}</Text>
          </TouchableOpacity>;
        })}
      </View>
    );
  }

  
}
