import React, {Component} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

import {Images} from '~assets';
import {Text} from '~components/common';
import UserDialogModal from '~containers/modals/userDialogModal';
import themeContext from '~components/ThemeContext';

class MessageRow extends Component {
  state = {
    visible: false,
    modalData: null,
  };

  modalHandler = (item) => {
    item &&
      this.setState({
        modalData: item,
      });
    this.visibleHandler();
  };

  visibleHandler = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  render() {
    let a = parseInt(`${this.props.message.key}`);
    let d = new Date(a).toUTCString();
    const isCurrentUser =
      auth().currentUser.uid === this.props.message.senderUid;

    const {colors} = this.props.useThemeHook;

    if (isCurrentUser) {
      return (
        <View style={[styles.item, styles.itemOut]}>
          <View
            style={[styles.balloon, {backgroundColor: colors.messageBubble2}]}>
            <Text h4 style={{paddingTop: 5}} color={colors.text}>
              {this.props.message.text}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              left: -10,
              bottom: -18,
            }}>
            <Text color={colors.text} style={{width: 70}}>
              {moment(d).calendar(null, {
                sameDay: 'hh:mm A',
                lastDay: 'DD/MM/YYYY',
                lastWeek: 'DD/MM/YYYY',
                sameElse: 'DD/MM/YYYY',
              })}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={{marginLeft: 20, marginBottom: 4}}>
            <TouchableOpacity
              onPress={() => {
                this.modalHandler(this.props.receiver);
              }}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 8,
                }}
                source={
                  this.props.receiver.avatar
                    ? {uri: this.props.receiver.avatar}
                    : Images.no_image
                }
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.item, styles.itemIn]}>
            <View
              style={[styles.balloon, {backgroundColor: colors.messageBubble}]}>
              <Text h4 style={{paddingTop: 5}} color={colors.text}>
                {this.props.message.text}
              </Text>
              <View
                style={{
                  position: 'absolute',
                  right: -10,
                  bottom: -18,
                }}>
                <Text style={{width: 70}} color={colors.text}>
                  {moment(d).calendar(null, {
                    sameDay: 'hh:mm A',
                    lastDay: 'DD/MM/YYYY',
                    lastWeek: 'DD/MM/YYYY',
                    sameElse: 'DD/MM/YYYY',
                  })}
                </Text>
              </View>
            </View>
          </View>
          <UserDialogModal
            visible={this.state.visible}
            onClose={this.visibleHandler}
            data={this.state.modalData}
            {...this.props}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  item: {
    // marginVertical: moderateScale(7, 2),
    marginBottom: 30,
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(3, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },

  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
  },
  bubbleView: {
    backgroundColor: '#ffffff',
    flex: 1,
    borderRadius: 8,
    padding: 8,
  },
  messageText: {
    flex: 1,
    // color: Colors.messageBubbleTextColor,
    fontSize: 16,
  },
});

export default themeContext(MessageRow);
