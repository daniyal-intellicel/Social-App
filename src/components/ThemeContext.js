import React from 'react';

import {useTheme} from '../styles/ThemeProvider';

export default function themeContext(Component) {
  return function WrappedComponent(props) {
    const useThemeHook = useTheme();
    return <Component {...props} useThemeHook={useThemeHook} />;
  };
}
