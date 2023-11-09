import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {connect} from 'react-redux';
// import Loader from 'react-native-loading-spinner-overlay';
import {Provider as PaperProvider} from 'react-native-paper';

import {PROMPT_CATEGORIES} from '~constants';
import {Snackbar} from './common';
import {deletePrompt} from '~redux/actions';
import themeContext from './ThemeContext';
import {Colors} from '~styles';

class Root extends Component {
  render() {
    const {prompt, activeProfileType} = this.props;
    const {isDark} = this.props.useThemeHook;

    return (
      <PaperProvider>
        <View style={styles.parentViewStyle}>
          <StatusBar
            animated={true}
            backgroundColor={
              activeProfileType === 'product'
                ? '#0f1545'
                : isDark
                ? '#171717'
                : Colors.purple[1]
            }
            barStyle="light-content"
          />
          {this.props.children}
          <Snackbar
            message={prompt ? prompt.message : undefined}
            type={prompt ? prompt.type : undefined}
            visible={prompt && prompt.category === PROMPT_CATEGORIES.snackbar}
          />
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  parentViewStyle: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  const {prompt, loading, loadingType, loadingMessage, haltAppInterface} =
    state.app;
  const {profileData, activeProfileType} = state.profile;

  return {
    prompt,
    loading,
    loadingType,
    loadingMessage,
    haltAppInterface,
    activeProfileType,
    profileData,
  };
};

export default connect(mapStateToProps, {deletePrompt})(themeContext(Root));
