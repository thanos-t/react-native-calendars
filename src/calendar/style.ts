import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
export default function getStyle(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      backgroundColor: appStyle.calendarBackground,
      ...appStyle.stylesheet.calendar.main.container
    },
    dayContainer: {
      flex: 1,
      alignItems: 'center',
      ...appStyle.stylesheet.calendar.main.dayContainer
    },
    emptyDayContainer: {
      flex: 1,
      ...appStyle.stylesheet.calendar.main.emptyDayContainer
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground,
      ...appStyle.stylesheet.calendar.main.monthView
    },
    week: {
      marginVertical: appStyle.weekVerticalMargin,
      flexDirection: 'row',
      justifyContent: 'space-around',
      ...appStyle.stylesheet.calendar.main.week
    }
  });
}
