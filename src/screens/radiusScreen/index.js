import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {WebView} from 'react-native-webview';
import Slider from '@react-native-community/slider';
import Icon1 from 'react-native-vector-icons/FontAwesome';

import {Colors} from '~styles';
import {Button, Text} from '~components/common';
import ScreenContainer from '../../components/ScreenContainer';
// import RadiusModal from '../../containers/modals/radiusModal';
import {SEARCH_RADIUS} from '~constants';
import {
  updateRange,
  switchProfile,
  getHotelList,
  viewHotel,
  viewBookedTours,
  viewBookedTransfers,
} from '~redux/actions';
import themeContext from '~components/ThemeContext';

class RadiusScreen extends Component {
  constructor(props) {
    super(props);

    this.initLongitude = (props.location && props.location.longitude) || 0;
    this.initLatitude = (props.location && props.location.latitude) || 0;

    this.state = {
      webviewLoad: true,
    };
  }

  componentDidMount() {
    this.props.viewBookedTours();
    this.props.viewBookedTransfers();
    this.props.getHotelList({
      latitude: this.initLatitude,
      longitude: this.initLongitude,
    });
  }

  componentDidUpdate() {
    if (this.state.webviewLoad === false) {
      this.updateMap();
    }
  }

  updateMap = () => {
    const {longitude, latitude} = this.props.location;
    const {value, zoom} = SEARCH_RADIUS[this.props.searchRadius];
    this.webref.injectJavaScript(
      `changeRadius(${zoom}, ${value}, ${longitude}, ${latitude})`,
    );
  };

  handleSliderValueChange = (value) => {
    const {searchRadius} = this.props;
    if (value !== searchRadius) {
      this.props.updateRange(value);
    }
  };

  render() {
    let showButton = true;
    if (this.props.route.params && this.props.route.params.buttonCheck) {
      showButton = false;
    }

    const {isDark} = this.props.useThemeHook;
    const {hotelList} = this.props;
    return (
      <ScreenContainer>
        <View style={{flex: 1}}>
          {this.props.location ? (
            <WebView
              ref={(r) => (this.webref = r)}
              onLoadEnd={() => {
                this.setState({webviewLoad: false});
                this.updateMap();
              }}
              source={{
                html: require('~utils/Map.js')({
                  lon: this.initLongitude,
                  lat: this.initLatitude,
                }),
              }}
            />
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? '#343434' : Colors.blue[0],
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 50,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}>
          <Text color={Colors.light} style={{textAlign: 'center'}} h4>
            Set your radius to see active accounts nearby.
          </Text>
          <Slider
            style={{width: '100%', height: 60}}
            minimumValue={0}
            maximumValue={4}
            step={1}
            minimumTrackTintColor={Colors.yellow[0]}
            maximumTrackTintColor="#000000"
            thumbTintColor={Colors.yellow[0]}
            onSlidingComplete={this.handleSliderValueChange}
            value={this.props.searchRadius}
          />
          <Text color={Colors.light} h2>
            Radius: {SEARCH_RADIUS[this.props.searchRadius].value}m
          </Text>
          <Text
            color={Colors.light}
            style={{marginTop: 5, marginBottom: 40, textAlign: 'center'}}>
            On Airplane, decrease radius to 0 and switch on Bluetooth{' '}
            {/* <View style={{position: 'absolute', top: 4}}> */}
            <Icon1 name="bluetooth" size={12} color={Colors.light} />
            {/* </View> */}
          </Text>

          {showButton && hotelList && hotelList.length === 1 ? (
            <Button
              buttonType={'secondary'}
              size={'large'}
              h3
              bold
              onPress={() => {
                this.props.viewHotel(hotelList[0].id).then(() =>
                  this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'AppTabNavigators'}],
                  }),
                );
              }}>
              Discover Now
            </Button>
          ) : showButton ? (
            <Button
              buttonType={'secondary'}
              size={'large'}
              h3
              bold
              onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'AppTabNavigators'}],
                });
              }}>
              Discover Now
            </Button>
          ) : (
            <Button
              buttonType={'secondary'}
              size={'large'}
              h3
              bold
              onPress={() => {
                this.props.navigation.navigate('Discover');
              }}>
              Discover Now
            </Button>
          )}
        </View>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const {location, searchRadius, isNetworkBT} = state.app;
  const {activeProfileType} = state.profile;
  const {hotelList} = state.hotel;

  return {
    hotelList,
    location,
    searchRadius,
    isNetworkBT,
    activeProfileType,
  };
};

export default connect(mapStateToProps, {
  updateRange,
  switchProfile,
  getHotelList,
  viewHotel,
  viewBookedTours,
  viewBookedTransfers,
})(themeContext(RadiusScreen));
