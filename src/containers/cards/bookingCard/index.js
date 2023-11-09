import React, {useState} from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';

import TourDialogModal from '../../modals/tourDialogModal';
import TransferDialogModal from '~containers/modals/transferDialogModal';
import {Text} from '../../../components/common';
import {Colors} from '../../../styles';
import {useTheme} from '~styles/ThemeProvider';

export default ({
  item,
  typeStyle = 1,
  navigation,
  getVehiclePrice,
  iconType = 1,
  onHotelModalClose,
  onLongPress = () => {},
}) => {
  const [visible, setVisible] = useState(false);
  const [modalData] = useState(item);
  const {colors} = useTheme();
  const handleTours = (icon) => {
    onHotelModalClose();
    icon === 'tour'
      ? navigation.navigate('TourListScreen')
      : icon === 'airport' && iconType === 1 && typeStyle === 1
      ? navigation.navigate('TransferListScreen')
      : icon === 'local-movies'
      ? navigation.navigate('TicketTourListScreen')
      : icon === 'person-pin-circle'
      ? navigation.navigate('GuideTicketTourListScreen')
      : null;
  };

  return (
    <>
      {item.icon === 'wifi_ssid' ? null : (
        <TouchableWithoutFeedback
          onPress={() =>
            item.icon === 'tour'
              ? // toursList(hotelId).then(() =>
                handleTours(item.icon)
              : // onHotelModalClose()  navigation.navigate('TourListScreen')
              // )
              (iconType !== 1 && typeStyle === 2) || typeStyle === 3
              ? setVisible(true)
              : item.icon === 'airport' && iconType === 1 && typeStyle === 1
              ? handleTours(item.icon)
              : // airportList().then(() => {
              //     onHotelModalClose();
              //     navigation.navigate('TransferListScreen');
              //   })
              iconType === 3 && typeStyle === 4
              ? // getPayment(item.id).then(() =>
                //     bookedTour(item.id).then(() =>
                navigation.navigate('ViewTour', {id: item.id})
              : //   ),
              // )
              iconType === 4 && typeStyle === 4
              ? // getTransferPayment(item.id).then(() =>
                //     bookedTransfer(item.id).then(() =>
                navigation.navigate('ViewTransfer', {id: item.id})
              : //   ),
              // )
              item.icon === 'receipt-outline'
              ? navigation.navigate('BookedToursScreen')
              : item.icon === 'airplane-outline'
              ? navigation.navigate('BookedTransfersScreen')
              : item.icon === 'local-movies'
              ? handleTours(item.icon)
              : // ticketTourList(hotelId).then(() => {
              //     onHotelModalClose();
              //     navigation.navigate('TicketTourListScreen');
              //   })
              item.icon === 'person-pin-circle'
              ? handleTours(item.icon)
              : // guideTicketTourList(hotelId).then(() => {
                //     onHotelModalClose();
                //     navigation.navigate('GuideTicketTourListScreen');
                //   })
                null
          }
          onLongPress={() => {
            onLongPress(item);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5,
              paddingHorizontal: 10,
              justifyContent: 'space-between',
              height: 60,
              borderBottomWidth: 1,
              borderBottomColor: colors.divider,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {iconType === 1 ? (
                <>
                  <Icon
                    name={
                      item.icon === 'airport' ? 'local-airport' : item.icon
                      //  === 'tour'
                      //   ? item.icon
                      //   : item.icon === 'local-movies'
                      //   ? item.icon
                      //   : 'local-airport'
                    }
                    size={30}
                    color={colors.text}
                  />
                </>
              ) : iconType !== 1 && typeStyle === 2 ? (
                <Icon name={'tour'} size={30} color={colors.text} />
              ) : (iconType !== 1 && typeStyle === 3) || typeStyle === 4 ? (
                <Icon name={'local-airport'} size={30} color={colors.text} />
              ) : iconType === 3 && typeStyle === 4 ? (
                <Icon1 name={'receipt-outline'} size={30} color={colors.text} />
              ) : iconType === 4 ? (
                <Icon1 name={item.icon} size={28} color={colors.text} />
              ) : null}
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {iconType !== 1 && typeStyle === 2 ? (
                  <Text
                    h4
                    bold
                    color={colors.text}>{`${item.destination}`}</Text>
                ) : iconType !== 1 && typeStyle === 3 ? (
                  <Text h4 bold color={colors.text}>{`${item.name}`}</Text>
                ) : iconType === 3 && typeStyle === 4 ? (
                  <Text h4 bold color={colors.text}>{`${
                    item.bookingTourType.name
                  }${', ' + item.busStop.name}`}</Text>
                ) : iconType === 4 && typeStyle === 4 ? (
                  item.direction === 1 ? (
                    <Text h4 bold color={colors.text}>{`${
                      item.hotel.displayName
                    }${' - ' + item.airport.name}`}</Text>
                  ) : (
                    <Text h4 bold color={colors.text}>{`${item.airport.name}${
                      ' - ' + item.hotel.displayName
                    }`}</Text>
                  )
                ) : null}
                <Text h4 color={colors.text}>
                  {typeStyle !== 4 ? item.label : item.userId}
                </Text>
              </View>
            </View>
            {/* {typeStyle === 1 ? (
            <Icon name="arrow-right" size={20} color={Colors.grey[3]} />
          ) : null} */}
            {typeStyle === 5 ? (
              <View style={{flexDirection: 'row'}}>
                {item.type === 'private' ? (
                  <Text h4 color={Colors.green[0]} style={{marginRight: 8}}>
                    Private
                  </Text>
                ) : (
                  <Text h4 color={Colors.yellow[0]} style={{marginRight: 8}}>
                    Shared
                  </Text>
                )}
              </View>
            ) : null}
            {iconType !== 1 && typeStyle === 2 ? (
              <TourDialogModal
                navigation={navigation}
                visible={visible}
                onClose={() => setVisible(false)}
                data={modalData}
              />
            ) : iconType !== 1 && typeStyle === 3 ? (
              <TransferDialogModal
                navigation={navigation}
                vehiclePrice={getVehiclePrice}
                visible={visible}
                onClose={() => setVisible(false)}
                data={modalData}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      )}
    </>
  );
};
