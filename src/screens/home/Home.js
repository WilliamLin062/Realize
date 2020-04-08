import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Navigation } from "../../conponets/Navigation";
import Constants from "expo-constants";
// implemented without image with header
import * as SQLite from "expo-sqlite";
// Utils
import {
  ScreenWidth,
  ScreenHeight,
  StreamColor,
  TitleColor,
} from "../../utils";
import RBSheet from "react-native-raw-bottom-sheet";
import { useFonts } from "@use-expo/font";
import * as RootNavigation from "../RootNavigation";
import { SearchBar, Divider } from "react-native-elements";
const db = SQLite.openDatabase("db.db");
//function Item({ id, title, selected, onSelect, content }) {}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      title: this.props.content,
      content: this.props.title,
      type: this.props.type,
      data: this.props.data,
      selected: "",
      isEdit: false,
      flatListRefreshings: this.props,
      loadIng: false,
    };
  }
  deleteDiary(id) {
    this.setState({ loadIng: true });
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from diary where id = ?;`, [id]);
      },
      null,
      this.setState({ loadIng: false })
    );
  }
  contentBox(title, content, type) {
    const TYPE = ["沒有分類", "心情", "筆記", "記帳", "創作"];
    const COLOR = ["#F4F482", "#B92061", "#E2582F", "#C0A827", "#F9FDB3"];
    console.log(type);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 80,
          flexWrap: "nowrap",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            marginLeft: 1,
            width: 100,
            borderRightWidth: 2,
            borderRightColor: "#A8BDB8",
            backgroundColor: COLOR[type],
          }}
        >
          <Text style={{ fontSize: 20 }}>{TYPE[type]}</Text>
        </View>

        <View>
          <View style={styles.contentBox}>
            <Text numberOfLines={1} ellipsizeMode="head" style={styles.title}>
              {title}
            </Text>
            <Text numberOfLines={4} ellipsizeMode="head" style={styles.content}>
              {content}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  handlePress = (index) => this.setState({ selected: index });
  render() {
    if (this.state.loadIng === true) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      const { id, content, title, data, selected, type } = this.state;
      return (
        <TouchableOpacity
          onLongPress={() => this.refRBSheet.open()}
          onPress={() => {
            RootNavigation.navigate("Diary", { cardId: id.toString() });
          }}
          style={[
            styles.item,
            { backgroundColor: selected ? "#DCDCDC" : "#F8F8FF" },
          ]}
        >
          {this.contentBox(content, title, type)}
          <RBSheet
            ref={(ref) => {
              this.refRBSheet = ref;
            }}
            height={100}
            duration={250}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center",
              },
            }}
          >
            <TouchableOpacity
              onPress={() => {
                RootNavigation.navigate("New", {
                  cardId: id.toString(),
                  type: 1,
                }),
                  this.refRBSheet.close();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonEdit}>編輯</Text>
            </TouchableOpacity>
            <View style={styles.buttonLine}></View>
            <TouchableOpacity
              onPress={() => {
                this.deleteDiary(id), this.refRBSheet.close();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonDelete}>刪除</Text>
            </TouchableOpacity>
          </RBSheet>
        </TouchableOpacity>
      );
    }
  }
}
//
//                             mainFunction
//
export default class HomeCard extends Component {
  state = {
    isLoading: false,
    items: null,
    DATA: [],
    refreshing: false,
    search: "",
    flatListRefreshing: false,
  };
  updateSearch = (search) => {
    this.setState({ search });
  };
  _DELETE_TABLE() {
    //this use to test
    db.transaction((tx) => {
      tx.executeSql("pragma foreign_key = off", [], (_, { rows }) =>
        console.log("限制關閉")
      );
      tx.executeSql("drop table if exists diary", [], (_, { rows }) =>
        console.log("刪除資料庫")
      );
      tx.executeSql("pragma foreign_key = on", [], (_, { rows }) =>
        console.log("限制開啟")
      );
    });
  }
  _updateTimer() {
    this.timer1 = setInterval(() => {
      this.update();
      this.Diary();
    }, 5000);
  }
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    this.timer1 && clearInterval(this.timer1);
    console.log("Unmounted");
  }

  update() {
    const { items2 } = this.state.items;
    db.transaction((tx) => {
      tx.executeSql(`select * from diary;`, [], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
    this.setState({
      refreshing: false,
      items: items2,
      loadIng:false
      //    flatListRefreshing: !this.state.flatListRefreshing,
    });
    console.log("update");
  }
  getData() {
    this.setState({loadIng:true})
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists diary (id integer primary key not null, date text, title text,content text,type integer);",
        [],
        (_, { rows }) => console.log("開啟資料庫成功")
      );
    });
    db.transaction((tx) => {
      tx.executeSql(`select * from diary;`, [], (_, { rows: { _array } }) =>
        this.setState({ items: _array })
      );
    });
    this.setState({loadIng:false})
  }
  //實驗用
  Diary() {
    const { items } = this.state;
    console.log("diary    " + Object.values(items));
    const title = items.map((item) => Object.values(item));
    console.log(title);
  }
  //搜尋功能 研究中
  searchFilterFunction = (text) => {
    const { items } = this.state;
    var input = "%" + text + "%";
    console.log(input);
    db.transaction((tx) => {
      tx.executeSql(
        `select * from diary where title like ?;`,
        [input],
        (_, { rows: { _array } }) => this.setState({ items: _array })
      );
    });
    console.log("change");
  };
  // reFresh

  handleRefresh = () => {
    this.setState(
      {
        loadIng:true,
        refreshing: true,
      },
      (e) => {
        this.update();
      }
    );
  };
  //render
  renderItem = ({ item }) => (
    <Item
      id={item.id}
      title={item.title}
      content={item.content}
      type={item.type}
      onPress={(e) => item.id}
    />
  );
  render() {
    if (this.state.loadIng === true) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    } else {
      const { items} = this.state;
      const { search } = this.state;
      if (items === null) {
        console.log("erro");
        return null;
      }
      return (
        <SafeAreaView style={styles.sectionContainer}>
          <SearchBar
            lightTheme
            round
            autoCorrect={false}
            placeholder="搜尋標題..."
            clearTextOnFocus={true}
            onChangeText={(text) =>{ this.setState({search:text}) ,this.searchFilterFunction(text)}}
            value={search}
          />
          <FlatList
            ListEmptyComponent={(e) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ color: "#000000", fontSize: 25 }}>
                  還沒有任何內容窩{" "}
                </Text>
              </View>
            )}
            ListFooterComponent={(e) =>
              this.state.isEmpty ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "#000000", fontSize: 25 }}>
                    已經到底部了!!!!
                  </Text>
                </View>
              ) : null
            }
            data={items}
            refreshing={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            keyExtractor={(item) => item.id.toString()}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
            extraData={this.state}
            renderItem={this.renderItem}
          />
          <Navigation
            rightClick={(e) => RootNavigation.navigate("New", { type: 0 })}
            rightText={"新增日記"}
          />
          {console.log(this.state.flatListRefreshing)}
        </SafeAreaView>
      );
    }
  }
}
//style
const styles = StyleSheet.create({
  buttonDelete: {
    color: "#FF2D2D",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonLine: {
    width: 100,
    borderBottomWidth: 1,
    margin: 10,
  },
  buttonEdit: {
    color: "#3C3C3C",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    //backgroundColor: "#dd552d",
    maxWidth: 280,
    fontSize: 15,
    margin: 7,
    flexWrap: "nowrap",
    fontFamily: "AppleSDGothicNeo-Regular",
  },
  contentBox: {
    flex: 1,
    //   backgroundColor: "#dd552d",
    maxWidth: 270,
    minWidth: 270,
    flexWrap: "nowrap",
  },
  container: {
    backgroundColor: "#F8F8FF",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },

  fontcolor: {
    color: "#000",
    flex: 1,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "row",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  item: {
    margin: 5,
    flex: 1,
    minHeight: 150,
    elevation: 5,
    marginTop: 5,
    marginBottom: 5,
    maxWidth: ScreenHeight,
    borderRadius: 10,
    maxWidth: ScreenWidth,
  },
  listArea: {
    backgroundColor: "#5555FF",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    backgroundColor: "#dfdfdf",
    flex: 1,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  size: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: 25,
  },
  listTitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listIcon: {
    fontSize: 26,
    color: "#666",
    width: 60,
  },
  listLabel: {
    fontSize: 16,
  },
  titleContainer: {
    maxWidth: 283,
  },
  title: {
    // backgroundColor: "#ff55ff",
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: 280,
    marginLeft: 5,
    marginTop: 2,
    borderBottomWidth: 1,
    borderColor: "#dfdfdf",
    fontFamily: "Avenir-Black",
  },
});
/**/
