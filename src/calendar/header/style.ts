import {StyleSheet} from 'react-native';

export default function (theme = {}) {
  return StyleSheet.create({
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...theme.stylesheet.calendar.header.contentContainer
    },
    monthAndYearContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      ...theme.stylesheet.calendar.header.monthAndYearContainer
    },
    monthText: {
      ...theme.stylesheet.calendar.header.monthText
    },
    yearText: {
      ...theme.stylesheet.calendar.header.yearText
    },
    arrowsContainer: {
      ...theme.stylesheet.calendar.header.arrowsContainer
    },
    rightArrowContainer: {
      ...theme.stylesheet.calendar.header.rightArrowContainer
    },
    arrow: {
      ...theme.stylesheet.calendar.header.arrow
    },
    arrowImage: {
      ...theme.stylesheet.calendar.header.arrowImage
    },
    disabledArrowImage: {
      ...theme.stylesheet.calendar.header.disabledArrowImage
    },
    weekDaysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      ...theme.stylesheet.calendar.header.weekDaysContainer
    },
    weekDay: {
      ...theme.stylesheet.calendar.header.weekDay
    },
    disabledWeekDay: {
      ...theme.stylesheet.calendar.header.disabledWeekDay
    }
  });
}
