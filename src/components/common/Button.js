import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';

import GlobalStyles, {Colors} from '../../styles';
import Text from './Text';
import {useTheme} from '~styles/ThemeProvider';

export default (props) => {
  const {
    children,
    size = 'full',
    buttonType = 'primary',
    buttonTextColor = '',
    h5,
    h4,
    paymentButton,
    payment,
    confirmPayment,
    tourId,
    navigation,
    h3,
    bold,
    buttonBackgroundColor,
  } = props;
  const myProps = {...props};
  const {initPaymentSheet, presentPaymentSheet, retrievePaymentIntent} =
    useStripe();
  const [loading, setLoading] = useState(false);
  const initializePaymentSheet = async () => {
    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example',
      customerId: payment.customer,
      customerEphemeralKeySecret: payment.ephemeralKey,
      paymentIntentClientSecret: payment.paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    const {paymentIntent} = await retrievePaymentIntent(payment.paymentIntent);
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      // confirmPayment(payment.intentId);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      if (paymentIntent && paymentIntent.status === 'Succeeded') {
        tourId
          ? confirmPayment(tourId, payment.intentId, paymentIntent.status).then(
              () => navigation.pop(),
            )
          : null;
        // Handle successful payment here
      } else {
        // Handle unsuccessful, processing, or canceled payments and API errors here
        console.log('not completed');
      }
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [payment]);

  const {colors, isDark} = useTheme();

  const styles = StyleSheet.create({
    primary: {
      backgroundColor: Colors.blue[0],
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondary: {
      backgroundColor: buttonBackgroundColor
        ? buttonBackgroundColor
        : colors.modal,
      borderColor: buttonTextColor !== '' ? buttonTextColor : Colors.grey[8],
      borderWidth: 1,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    full: {
      width: '100%',
      height: 45,
      padding: 5,
    },
    small: {
      minWidth: 120,
      minHeight: 35,
      padding: 5,
    },
    xSmall: {
      minWidth: 50,
      minHeight: 25,
      padding: 5,
    },
    medium: {
      minWidth: 250,
      minHeight: 50,
      padding: 5,
    },
    large: {
      minWidth: 320,
      minHeight: 50,
      padding: 5,
    },
  });

  const textColor = props.color
    ? props.color
    : props.type === 'clear'
    ? buttonType === 'secondary'
      ? Colors.light
      : Colors.blue[0]
    : buttonType === 'secondary'
    ? buttonTextColor !== ''
      ? buttonTextColor
      : isDark
      ? Colors.light
      : Colors.blue[0]
    : Colors.light;

  const titleStyle = [GlobalStyles.textStyle, {color: textColor}];
  props.titleStyle && titleStyle.push(props.titleStyle);

  const buttonStyle = [];
  buttonStyle.push(styles[size], styles[buttonType]);
  props.buttonStyle && buttonStyle.push(props.buttonStyle);

  const containerStyle = [{paddingHorizontal: 0, paddingVertical: 0}];

  containerStyle.push(styles[size], {alignSelf: 'center'});
  props.containerStyle && containerStyle.push(props.containerStyle);

  props.icon && !props.icon.color && (myProps.icon.color = textColor);

  delete myProps.buttonStyle;
  delete myProps.titleStyle;
  delete myProps.containerStyle;

  return (
    <View>
      {paymentButton ? (
        <TouchableOpacity
          onPress={openPaymentSheet}
          style={containerStyle}
          disabled={!loading}>
          <View style={buttonStyle}>
            {props.loading ? (
              <ActivityIndicator animating color={Colors.dark} />
            ) : (
              <Text style={titleStyle} bold={bold} h5={h5} h4={h4} h3={h3}>
                {children}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={props.onPress} style={containerStyle}>
          <View style={buttonStyle}>
            {props.loading ? (
              <ActivityIndicator animating color={Colors.dark} />
            ) : (
              <Text style={titleStyle} bold={bold} h5={h5} h4={h4} h3={h3}>
                {children}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
