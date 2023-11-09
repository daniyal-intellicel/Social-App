import React from 'react';
import {
  View,
  // StyleSheet,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {connect, useSelector} from 'react-redux';
import Icons from 'react-native-vector-icons/Entypo';
import {RootSiblingParent} from 'react-native-root-siblings';

import {Colors} from '../../../styles';
import {Button, Text} from '../../../components/common';
import {useTheme} from '~styles/ThemeProvider';

function TransferDialogModal({
  vehiclePrice,
  visible = false,
  onClose,
  data,
  navigation,
}) {
  const hotel = useSelector((state) => state.hotel.hotel);
  const {colors} = useTheme();

  const Wrapper = RootSiblingParent;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <Wrapper>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback
            onPress={() => {
              onClose();
            }}>
            <View needsOffscreenAlphaCompositing style={{height: 150}} />
          </TouchableWithoutFeedback>
          <View
            style={{
              flex: 1,
              borderTopRightRadius: 50,
              borderTopLeftRadius: 50,
              elevation: 8,
              paddingBottom: 20,
              backgroundColor: colors.modal,
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.modal,
                paddingHorizontal: 15,
                borderTopRightRadius: 50,
                borderTopLeftRadius: 50,
              }}>
              {data ? (
                <View style={{alignItems: 'center', paddingTop: 20}}>
                  <Text h1 bold style={{marginTop: 5}} color={colors.text}>
                    {data.name}
                  </Text>
                  <Text h4 style={{marginTop: 10}} color={colors.text}>
                    {data.city + ', ' + data.country}
                  </Text>
                  <Text h5 style={{marginVertical: 10}} color={colors.text}>
                    Days: {data.address}
                  </Text>
                </View>
              ) : null}

              <Button
                h4
                onPress={() => {
                  vehiclePrice(hotel.id, data.id).then(() =>
                    navigation.navigate('BookTransferScreen', {transfer: data}),
                  );
                  onClose();
                }}>
                Book this transfer
              </Button>
              <TouchableOpacity
                onPress={() => {
                  onClose();
                }}
                style={{
                  position: 'absolute',
                  right: 30,
                  top: 20,
                }}>
                <Icons name="cross" size={25} color={Colors.grey[3]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Wrapper>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {})(TransferDialogModal);
