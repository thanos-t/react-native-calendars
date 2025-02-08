import includes from 'lodash/includes';
import XDate from 'xdate';

import React, {ReactNode, useCallback, useMemo, forwardRef, useImperativeHandle} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ColorValue,
  Insets
} from 'react-native';
import {weekDayNames} from '../../dateutils';
import styleConstructor from './style';
import {Theme, Direction} from '../../types';

import ArrowLeft from '../img/arrow_back_24dp.png';
import ArrowRight from '../img/arrow_forward_24dp.png';

export interface CalendarHeaderProps {
  /** The current month presented in the calendar */
  month?: XDate;
  /** A callback for when a month is changed from the headers arrows */
  addMonth?: (num: number) => void;
  /** The current date presented */
  current?: string;
  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator. Default = false */
  displayLoadingIndicator?: boolean;
  /** Show week numbers. Default = false */
  showWeekNumbers?: boolean;
  /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
  monthFormat?: string;
  /** Hide day names */
  hideDayNames?: boolean;
  /** Hide month navigation arrows */
  hideArrows?: boolean;
  /** Replace default arrows with custom ones (direction = 'left' | 'right') */
  renderArrow?: (direction: Direction) => ReactNode;
  /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
  onPressArrowLeft?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
  onPressArrowRight?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Left & Right arrows. Additional distance outside of the buttons in which a press is detected. Default = 20 */
  arrowsHitSlop?: Insets | number;
  /** Disable left arrow */
  disableArrowLeft?: boolean;
  /** Disable right arrow */
  disableArrowRight?: boolean;
  /** Apply custom disable color to selected day names indexes */
  disabledDaysIndexes?: number[];
  /** Replace default title with custom one. the function receive a date as parameter */
  renderHeader?: (date?: XDate) => ReactNode; //TODO: replace with string
  /** Replace default title with custom element */
  customHeaderTitle?: JSX.Element;
  /** Test ID */
  testID?: string;
  /** Specify style for header container element */
  style?: StyleProp<ViewStyle>;
  /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
  webAriaLevel?: number;
  /** whether the accessibility elements contained within this accessibility element are hidden (iOS only) */
  accessibilityElementsHidden?: boolean;
  /** controlling if a view fires accessibility events and if it is reported to accessibility services (Android only) */
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  /** The number of days to present in the header (for example for Timeline display) */
  numberOfDays?: number;
  /** Left inset for the timeline calendar header. Default = 72 */
  timelineLeftInset?: number;
}

const accessibilityActions = [
  {name: 'increment', label: 'increment'},
  {name: 'decrement', label: 'decrement'}
];

const CalendarHeader = forwardRef((props: CalendarHeaderProps, ref) => {
  const {
    theme,
    style: propsStyle,
    addMonth: propsAddMonth,
    month,
    firstDay,
    onPressArrowLeft,
    onPressArrowRight,
    disableArrowLeft,
    disableArrowRight,
    disabledDaysIndexes,
    displayLoadingIndicator,
    testID,
    numberOfDays,
    current = ''
  } = props;

  const numberOfDaysCondition = useMemo(() => {
    return numberOfDays && numberOfDays > 1;
  }, [numberOfDays]);
  const style = useMemo(() => {
    return styleConstructor(theme);
  }, []);

  useImperativeHandle(ref, () => ({
    onPressLeft,
    onPressRight
  }));

  const addMonth = useCallback(() => {
    propsAddMonth?.(1);
  }, [propsAddMonth]);

  const subtractMonth = useCallback(() => {
    propsAddMonth?.(-1);
  }, [propsAddMonth]);

  const onPressLeft = useCallback(() => {
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(subtractMonth, month);
    }
    return subtractMonth();
  }, [onPressArrowLeft, subtractMonth, month]);

  const onPressRight = useCallback(() => {
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(addMonth, month);
    }
    return addMonth();
  }, [onPressArrowRight, addMonth, month]);

  const renderWeekDays = useMemo(() => {
    const dayOfTheWeek = new XDate(current).getDay();
    const weekDaysNames = numberOfDaysCondition ? weekDayNames(dayOfTheWeek) : weekDayNames(firstDay);
    const dayNames = numberOfDaysCondition ? weekDaysNames.slice(0, numberOfDays) : weekDaysNames;

    return dayNames.map((day, index) => {
      const dayStyle = [style.weekDay];

      if (includes(disabledDaysIndexes, index)) {
        dayStyle.push(style.disabledWeekDay);
      }

      const dayTextAtIndex = `dayTextAtIndex${index}`;

      if (style[dayTextAtIndex]) {
        dayStyle.push(style[dayTextAtIndex]);
      }

      return (
        <Text key={index} allowFontScaling={false} style={dayStyle} numberOfLines={1}>
          {day}
        </Text>
      );
    });
  }, [firstDay, style, current, numberOfDaysCondition, numberOfDays, disabledDaysIndexes]);

  const renderIndicator = () => {
    if (displayLoadingIndicator) {
      return <ActivityIndicator color={theme?.indicatorColor as ColorValue} testID={`${testID}.loader`} />;
    }
  };

  const renderMonthAndYear = () => {
    const _month = month?.toString('MMMM');
    const _year = month?.toString('yyyy');

    if (!_month || !_year) {
      return;
    }

    return (
      <View style={style.monthAndYearContainer}>
        <Text allowFontScaling={false} style={style.monthText}>
          {_month}
        </Text>
        <Text allowFontScaling={false} style={style.yearText}>
          {_year}
        </Text>
        {renderIndicator()}
      </View>
    );
  };

  const renderLeftArrow = () => {
    const disabledStyle = disableArrowLeft ? style.disabledArrowImage : {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressLeft}
        disabled={disableArrowLeft}
        style={[style.arrow, disabledStyle]}
        hitSlop={{top: 4, left: 4, bottom: 4, right: 4}}
      >
        <Image source={ArrowLeft} style={style.arrowImage} />
      </TouchableOpacity>
    );
  };

  const renderRightArrow = () => {
    const disabledStyle = disableArrowRight ? style.disabledArrowImage : {};

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressRight}
        disabled={disableArrowRight}
        style={[style.arrow, style.rightArrowContainer, disabledStyle]}
        hitSlop={{top: 4, left: 4, bottom: 4, right: 4}}
      >
        <Image source={ArrowRight} style={style.arrowImage} />
      </TouchableOpacity>
    );
  };

  const renderWeekDaysContainer = () => {
    return <View style={style.weekDaysContainer}>{renderWeekDays}</View>;
  };

  return (
    <View style={propsStyle}>
      <View style={style.contentContainer}>
        {renderMonthAndYear()}

        <View style={style.arrowsContainer}>
          {renderLeftArrow()}
          {renderRightArrow()}
        </View>
      </View>

      {renderWeekDaysContainer()}
    </View>
  );
});

export default CalendarHeader;
CalendarHeader.displayName = 'CalendarHeader';
CalendarHeader.defaultProps = {
  monthFormat: 'MMMM yyyy',
  webAriaLevel: 1,
  arrowsHitSlop: 20
};
