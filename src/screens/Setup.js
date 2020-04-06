import * as React from "react";
import { Button, View, Modal } from "react-native";
import { createDrawerNavigator, StackActions } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { navigationRef } from "./RootNavigation";
/*SCREENS*/
import  {Edit}  from "../containers/container/TextEditer";
import Home from "./home/Home";
import NewPost from "./NewPost";
import Diary from "./Diary";

/*function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}
*/
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export default function Setup() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "首頁" }}
        />
        <Stack.Screen
          name="New"
          component={Edit}
          options={{ title: "新增文章" }}
          initialParams={{ cardId: null ,isEdit:false,type:null}}
 
          
        />
         <Stack.Screen
          name="Diary"
          component={Diary}
          options={{ title: "閱讀文章" }}
          initialParams={{ cardId: null }}/>
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
  /*   */