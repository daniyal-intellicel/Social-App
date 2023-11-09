import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Linking,
  // Switch,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {Colors} from '../../styles';
import {Text, Button} from '../../components/common';
import {signInAnonymously} from '~redux/actions';
import {EULA_URL, PRIVACY_POLICY_URL} from '~constants';
import {handleError} from '~utils/services/GeneralServices';
import themeContext from '~components/ThemeContext';

class LoginScreen extends Component {
  state = {
    name: '',
    loading: false,
  };

  handleDiscoverButtonPress = () => {
    if (this.state.name.trim()) {
      this.setState({
        loading: !this.state.loading,
      });
      this.props.signInAnonymously({name: this.state.name.trim()});
    } else {
      handleError('No name entered', null, 'Name field can not be empty');
    }
  };

  _showEULA = () => Linking.openURL(EULA_URL);

  _showPrivacyPolicy = () => Linking.openURL(PRIVACY_POLICY_URL);

  render() {
    const {colors, isDark} = this.props.useThemeHook;
    return (
      <KeyboardAwareScrollView
        style={{
          backgroundColor: colors.background,
        }}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
        keyboardShouldPersistTaps="always">
        <LinearGradient
          colors={
            isDark
              ? ['rgba(100, 26, 95, 0.5)', 'rgba(51, 92, 154, 0.5)']
              : [Colors.purple[1], Colors.blue[0]]
          }
          style={styles.linearGradient}>
          <Image
            resizeMode="cover"
            source={require('../../assets/images/Logo.png')}
          />
          <Text color={Colors.light} h3 style={{paddingVertical: 15}}>
            Simply enter your name and start discovering
          </Text>
          <Text h3 color={Colors.light} style={{marginTop: 40}}>
            {"What's your name? *"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={'Name or nickname'}
            onChangeText={(text) => {
              this.setState({
                name: text,
              });
            }}
            value={this.state.name}
          />
        </LinearGradient>
        <View
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 4,
            marginTop: '35%',
          }}>
          <Button
            size={'large'}
            h4
            onPress={this.handleDiscoverButtonPress}
            loading={this.state.loading}>
            Continue
          </Button>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
              paddingTop: 10,
            }}>
            <Text h3 color={colors.text}>
              Buy using this app you agree to our{' '}
              <Text
                color={Colors.blue[0]}
                h3
                bold
                onPress={() => {
                  Linking.openURL(
                    'https://blog.beapp.co/privacy-policy/',
                  ).catch((err) => console.error("Couldn't load page", err));
                }}>
                Privacy Policy.
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 6,
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  input: {
    backgroundColor: Colors.light,
    borderRadius: 4,
    marginTop: 15,
    padding: 12,
  },
});

export default connect(null, {signInAnonymously})(themeContext(LoginScreen));
