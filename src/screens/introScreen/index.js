import React, {Component} from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';

import {Colors} from '~styles';
import {Text} from '~components/common';
import {introData} from '../../constants/userData';

class SomeComponent extends Component {
  onPressSkip = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('introCheck', jsonValue);
      this.props.navigation.navigate('LoginScreen');
    } catch (e) {
      // saving error
    }
  };

  _renderItem = ({item}) => {
    return (
      <View style={{flex: 1, backgroundColor: Colors.light}}>
        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingTop: 30,
            height: '80%',
          }}>
          <Image
            resizeMode="cover"
            source={require('../../assets/images/LogoFilled.png')}
          />
          <View style={{padding: 10}} />
          <Image resizeMode="cover" source={item.image} />
          <Text h1 style={{marginTop: 10, textAlign: 'center'}}>
            {item.text}
          </Text>

          <Text
            h4
            color={Colors.grey[3]}
            style={{marginTop: 10, textAlign: 'center'}}>
            {item.text2 === 'true' ? (
              <Text h4>
                Be works on{' '}
                <Text h4 bold>
                  airplanes
                </Text>
                ! You can also message offline
              </Text>
            ) : (
              item.text2
            )}
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginHorizontal: 30,
            paddingTop: 40,
          }}>
          <Text h4 color={Colors.grey[1]}>
            Already have an account?
          </Text>
          <TouchableOpacity
            style={{height: 30, width: 40}}
            onPress={() => {
              this.onPressSkip({check: true});
            }}>
            <Text h4 color={Colors.orange[0]}>
              {item.key !== 3 ? 'Skip' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <AppIntroSlider
        renderItem={this._renderItem}
        data={introData}
        dotStyle={{backgroundColor: Colors.grey[7]}}
        activeDotStyle={{backgroundColor: Colors.blue[0]}}
      />
    );
  }
}

export default SomeComponent;
