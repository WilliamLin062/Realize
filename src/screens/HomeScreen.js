import * as React from 'react';
import { Button, View } from 'react-native';
import HomeCard from '../conponets/component/HomeCard';


export default function HomeScreen({ navigation }) {
  return (
    
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <HomeCard></HomeCard>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications這裡是首頁"
      />

    </View>
  );
}