/**
 * Date objects
 * @author Reza Babakhani
 * @module date
 */

/**
 * PersianDate object constructor
 * @param input
 * @class PersianDate
 * @constructor
 */
var PersianDate = function (input) {

  if (!(this instanceof PersianDate))
    return new PersianDate(input)
  // Convert Any thing to Gregorian Date
  if (isUndefined(input)) {
    this.gDate = new Date();
  } else if (isDate(input)) {
    this.gDate = input;
  } else if (isArray(input)) {
    //  Encapsulate Input Array
    var arrayInput = input.slice();
    this.gDate = persianArrayToGregorianDate(arrayInput);
  } else if (isNumber(input)) {
    this.gDate = new Date(input);
  } else if (input instanceof PersianDate) {
    this.gDate = input.gDate;
  }
  // ASP.NET JSON Date
  else if (input.substring(0, 6) === "/Date(") {
    this.gDate = new Date(parseInt(input.substr(6)));
  }
  this.pDate = toPersianDate(this.gDate);
  return this;
};


PersianDate.prototype = {
  version: "0.1.8a",
  duration: function (input, key) {
    var isDuration = this.isDuration(input), isNumber = ( typeof input === 'number'), duration = ( isDuration ? input._data : ( isNumber ? {} : input)), ret;
    if (isNumber) {
      if (key) {
        duration[key] = input;
      } else {
        duration.milliseconds = input;
      }
    }
    return new Duration(duration);
  },
  isDuration: function (obj) {
    return obj instanceof Duration;
  },
  humanize: function () {
    return "Must Implement";
  },
  add: function (key, input) {
    var d = this.duration(input, key).valueOf(), newUnixDate = this.gDate.valueOf() + d;
    return new PersianDate(newUnixDate);
  },
  subtract: function (key, input) {
    var d = this.duration(input, key).valueOf(), newUnixDate = this.gDate.valueOf() - d;
    return new PersianDate(newUnixDate);
  },
  formatPersian: "_default",
  formatNumber: function () {
    var output;
    // if default conf dosent set follow golbal config
    if (this.formatPersian === "_default") {
      if (window.formatPersian === false) {
        output = false;
      } else {
        // Default Conf
        output = true;
      }
    } else {
      if (this.formatPersian === true) {
        output = true;
      } else if (this.formatPersian === false) {
        output = false;
      } else {
        $.error("Invalid Config 'formatPersian' !!")
      }
    }
    return output;
  },
  format: function (inputString) {
    var self = this, formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DD?D?D?|ddddd|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|X|LT|ll?l?l?|LL?L?L?)/g, info = {
      year: self.year(),
      month: self.month(),
      hour: self.hours(),
      minute: self.minutes(),
      second: self.seconds(),
      date: self.date(),
      timezone: self.zone(),
      unix: self.unix()
    };

    function replaceFunction(input) {
      formatToPersian = self.formatNumber();
      switch (input) {
        // AM/PM
        case("a"):
        {
          if (formatToPersian)
            return ((info.hour >= 12) ? 'ب ظ' : 'ق ظ');
          else
            return ((info.hour >= 12) ? 'PM' : 'AM');
        }
        // Hours (Int)
        case("H"):
        {
          if (formatToPersian)
            return toPersianDigit(info.hour);
          else
            return info.hour;
        }
        case("HH"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.hour, 2));
          else
            return leftZeroFill(info.hour, 2);
        }
        case("h"):
        {
          var h = info.hour % 12;
          if (formatToPersian)
            return toPersianDigit(h);
          else
            return h;
        }
        case("hh"):
        {
          var h = info.hour % 12;
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(h, 2));
          else
            return leftZeroFill(h, 2);
        }
        // Minutes
        case("m"):
        {
          if (formatToPersian)
            return toPersianDigit(info.minute);
          else
            return info.minute;
        }
        // Two Digit Minutes
        case("mm"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.minute, 2));
          else
            return leftZeroFill(info.minute, 2);
        }
        // Second
        case("s"):
        {
          if (formatToPersian)
            return toPersianDigit(info.second);
          else
            return info.second;
        }
        case("ss"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.second, 2));
          else
            return leftZeroFill(info.second, 2);
        }
        // Day (Int)
        case("D"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.date));
          else
            return leftZeroFill(info.date);
        }
        // Return Two Digit
        case("DD"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.date, 2));
          else
            return leftZeroFill(info.date, 2);
        }
        // Return day Of Year
        case("DDD"):
        {
          var t = self.startOf("year")
          if (formatToPersian)
            return toPersianDigit(self.diff(t, "days"));
          else
            return self.diff(t, "days");
        }
        // Return Week Day Full Name
        case("DDDD"):
        {
          var t = self.startOf("year")
          if (formatToPersian)
            return leftZeroFill(self.diff(t, "days"), 3);
          else
            return toPersianDigit(leftZeroFill(self.diff(t, "days"), 3));
        }
        // Return day Of week
        case("d"):
        {
          if (formatToPersian)
            return toPersianDigit(self.pDate.weekDayNumber);
          else
            return self.pDate.weekDayNumber;
        }
        // Return week day name abbr
        case("ddd"):
        {
          return weekRange[self.pDate.weekDayNumber].abbr.fa;
        }
        case("dddd"):
        {
          return weekRange[self.pDate.weekDayNumber].name.fa;
        }
        // Return Persian Day Name
        case("ddddd"):
        {
          return persianDaysName[self.pDate.monthDayNumber]
        }
        // Return Persian Day Name
        case("w"):
        {
          var t = self.startOf("year")
          return parseInt(self.diff(t, "days") / 7) + 1;
        }
        // Return Persian Day Name
        case("ww"):
        {
          var t = self.startOf("year")
          return leftZeroFill(parseInt(self.diff(t, "days") / 7) + 1, 2);
        }
        // Month  (Int)
        case("M"):
        {
          if (formatToPersian)
            return toPersianDigit(info.month);
          else
            return info.month;
        }
        // Two Digit Month (Str)
        case("MM"):
        {
          if (formatToPersian)
            return toPersianDigit(leftZeroFill(info.month, 2));
          else
            return leftZeroFill(info.month, 2);
        }
        // Abbr String of Month (Str)
        case("MMM"):
        {
          return monthRange[info.month].abbr.fa;
        }
        // Full String name of Month (Str)
        case("MMMM"):
        {
          return monthRange[info.month].name.fa;
        }
        // Year
        // Two Digit Year (Str)
        case("YY"):
        {
          var yearDigitArray = info.year.toString().split("");
          if (formatToPersian)
            return toPersianDigit(yearDigitArray[2] + yearDigitArray[3]);
          else
            return yearDigitArray[2] + yearDigitArray[3];
        }
        // Full Year (Int)
        case("YYYY"):
        {
          if (formatToPersian)
            return toPersianDigit(info.year);
          else
            return info.year;
        }
        case("Z"):
        {
          var flag = "+";
          var hours = Math.round(info.timezone / 60);
          var minutes = info.timezone % 60;
          if (minutes < 0) {
            minutes *= -1;
          }
          if (hours < 0) {
            flag = "-";
            hours *= -1;
          }

          var z = flag + leftZeroFill(hours, 2) + ":" + leftZeroFill(minutes, 2);
          if (formatToPersian)
            return toPersianDigit(z)
          else
            return z;
        }
        case("ZZ"):
        {
          var flag = "+";
          var hours = Math.round(info.timezone / 60);
          var minutes = info.timezone % 60;
          if (minutes < 0) {
            minutes *= -1;
          }
          if (hours < 0) {
            flag = "-";
            hours *= -1;
          }

          var z = flag + leftZeroFill(hours, 2) + "" + leftZeroFill(minutes, 2);
          if (formatToPersian)
            return toPersianDigit(z)
          else
            return z;
        }
        case("X"):
        {
          return self.unix();
        }
        // 8:30 PM
        case("LT"):
        {
          return self.format("h:m a");
        }
        // 09/04/1986
        case("L"):
        {
          return self.format("YYYY/MM/DD");
        }
        // 9/4/1986
        case("l"):
        {
          return self.format("YYYY/M/D");
        }
        // September 4th 1986
        case("LL"):
        {
          return self.format("MMMM DD YYYY");
        }
        // Sep 4 1986
        case("ll"):
        {
          return self.format("MMM DD YYYY");
        }
        //September 4th 1986 8:30 PM
        case("LLL"):
        {
          return self.format("MMMM YYYY DD   h:m  a");
        }
        // Sep 4 1986 8:30 PM
        case("lll"):
        {
          return self.format("MMM YYYY DD   h:m  a");
        }
        //Thursday, September 4th 1986 8:30 PM
        case("LLLL"):
        {
          return self.format("dddd D MMMM YYYY  h:m  a");
        }
        // Thu, Sep 4 1986 8:30 PM
        case("llll"):
        {
          return self.format("ddd D MMM YYYY  h:m  a");
        }

        default:
          return info._d;
      }
    }

    if (inputString) {
      return inputString.replace(formattingTokens, replaceFunction);
    } else {
      var inputString = "YYYY-MM-DD HH:mm:ss a"
      return inputString.replace(formattingTokens, replaceFunction);
    }
  },
  // Humanize
  from: function () {
    return "Must Implement";
  },
  fromNow: function () {
    return "Must Implement";
  },
  humanizeDuration: function () {
    return "Must Implement";
  },
  _d: function () {
    return this.gDate._d;
  },
  diff: function (input, val, asFloat) {
    var self = new PersianDate(this), inputMoment = input,
    //this._isUTC ? moment(input).utc() : moment(input).local();
        zoneDiff = 0,
    //(this.zone() - inputMoment.zone()) * 6e4;
        diff = self.gDate - inputMoment.gDate - zoneDiff, year = self.year() - inputMoment.year(), month = self.month() - inputMoment.month(), date = (self.date() - inputMoment.date()) * -1, output;
    if (val === 'months' || val === 'month') {
      output = year * 12 + month + date / 30;
    } else if (val === 'years' || val === 'year') {
      output = year + (month + date / 30) / 12;
    } else {
      output = val === 'seconds' || val === 'second' ? diff / 1e3 : // 1000
          val === 'minutes' || val === 'minute' ? diff / 6e4 : // 1000 * 60
              val === 'hours' || val === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                  val === 'days' || val === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                      val === 'weeks' || val === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                          diff;
    }
    if (output < 0)
      output * -1;
    return asFloat ? output : Math.round(output);
  },
  startOf: function (key) {
    // Simplify this
    switch (key) {
      case "years":
      case "year" :
        return new PersianDate([this.year(), 1, 1]);
      case "months":
      case "month":
        return new PersianDate([this.year(), this.month(), 1]);
      case "days" :
      case "day" :
        return new PersianDate([this.year(), this.month(), this.date(), 0, 0, 0]);
      case "hours" :
      case "hour" :
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), 0, 0]);
      case "minutes":
      case "minute":
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), 0]);
      case "seconds":
      case "second":
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), this.seconds()]);
      case "weeks":
      case "week":
        var weekDayNumber = this.pDate.weekDayNumber;
        if (weekDayNumber === 0) {
          return new PersianDate([this.year(), this.month(), this.date()]);
        } else {
          return new PersianDate([this.year(), this.month(), this.date()]).subtract("days", weekDayNumber);
        }
      default:
        return this;
    }
  },
  endOf: function (key) {
    // Simplify this
    switch (key) {
      case "years":
      case "year":
        var days = this.isLeapYear() ? 30 : 29;
        return new PersianDate([this.year(), 12, days, 23, 59, 59]);
      case "months":
      case "month":
        var monthDays = this.daysInMonth(this.year(), this.month());
        return new PersianDate([this.year(), this.month(), monthDays, 23, 59, 59]);
      case "days" :
      case "day" :
        return new PersianDate([this.year(), this.month(), this.date(), 23, 59, 59]);
      case "hours" :
      case "hour" :
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), 59, 59]);
      case "minutes":
      case "minute":
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), 59]);
      case "seconds":
      case "second":
        return new PersianDate([this.year(), this.month(), this.date(), this.hours(), this.minutes(), this.seconds()]);
      case "weeks":
      case "week":
        var weekDayNumber = this.pDate.weekDayNumber;
        if (weekDayNumber === 6) {
          weekDayNumber = 7;
        } else {
          weekDayNumber = 6 - weekDayNumber;
        }
        return new PersianDate([this.year(), this.month(), this.date()]).add("days", weekDayNumber);
      default:
        return this;
    }
  },
  sod: function () {
    return this.startOf("day");
  },
  eod: function () {
    return this.endOf("day");
  },
  // Get the timezone offset in minutes.
  zone: function () {
    return this.pDate.timeZoneOffset;
  },
  _utcMode: false,
  local: function () {
    if (!this._utcMode) {
      return this;
    } else {
      var offsetMils = this.pDate.timeZoneOffset * 60 * 1000;
      if (this.pDate.timeZoneOffset < 0) {
        var utcStamp = this.valueOf() - offsetMils;
      } else {
        var utcStamp = this.valueOf() + offsetMils;
      }
      this.gDate = new Date(utcStamp);
      this._updatePDate();
      this._utcMode = false;
      return this;
    }
  },
  // current date/time in UTC mode
  utc: function (input) {
    if (input) {
      return new persianDate(input).utc();
    }
    if (this._utcMode) {
      return this;
    } else {
      var offsetMils = this.pDate.timeZoneOffset * 60 * 1000;
      if (this.pDate.timeZoneOffset < 0) {
        var utcStamp = this.valueOf() + offsetMils;
      } else {
        var utcStamp = this.valueOf() - offsetMils;
      }
      this.gDate = new Date(utcStamp);
      this._updatePDate();
      this._utcMode = true;
      return this;
    }
  },
  isUtc: function () {
    return this._utcMode;
  },
  // version 0.0.1
  isDST: function () {
    // Just Iran Day light saving time
    var output = false;
    if (this.month() >= 1 && this.month() <= 6) {
      output = true;
      switch (this.month()) {
        case(1):
          if (this.date() < 2) {
            output = false
          }
          ;
          break;
        case(6):
          if (this.date() > 30) {
            output = false
          }
          ;
          break;
      }
    }
    ;
    return output;
  },
  isLeapYear: function () {
    return isLeapPersian(this.year());
  },
  daysInMonth: function (yearInput, monthInput) {
    var year = yearInput ? yearInput : this.year();
    var month = monthInput ? monthInput : this.month();
    if (month < 1 || month > 12)
      return 0;
    if (month < 7)
      return 31;
    if (month < 12)
      return 30;
    if (isLeapPersian(year))
      return 30;
    return 29;
  },
  // return Native Javascript Date
  toDate: function () {
    return this.gDate;
  },
  // return Array Of Persian Date
  toArray: function () {
    return [this.year(), this.month(), this.day(), this.hour(), this.minute(), this.second(), this.millisecond()];
  },
  // Return Milliseconds since the Unix Epoch (1318874398806)
  _valueOf: function () {
    return this.gDate.valueOf();
  },
  // Return Unix Timestamp (1318874398)
  unix: function (timestamp) {
    if (timestamp) {
      return new persianDate(timestamp * 1000);
    } else {
      var str = this.gDate.valueOf().toString();
      output = str.substring(0, str.length - 3);
    }
    return parseInt(output);
  },
  isPersianDate: function (obj) {
    return obj instanceof PersianDate;
  },
  // -------------------------------------- Getter Setter
  millisecond: function (input) {
    return this.milliseconds(input)
  },
  milliseconds: function (input) {
    if (input) {
      this.gDate.setMilliseconds(input);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.milliseconds;
    }
  },
  second: function (input) {
    return this.seconds(input);

  },
  seconds: function (input) {
    if (input | input === 0) {
      this.gDate.setSeconds(input);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.seconds;
    }
  },
  minute: function (input) {
    return this.minutes(input);
  },
  minutes: function (input) {
    if (input || input === 0) {
      this.gDate.setMinutes(input);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.minutes;
    }
  },
  hour: function (input) {
    return this.hours(input)
  },
  hours: function (input) {
    if (input | input === 0) {
      this.gDate.setHours(input);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.hours;
    }
  },
  // Day of Months
  dates: function (input) {
    return this.date(input)
  },
  date: function (input) {
    if (input | input == 0) {
      var pDateArray = getPersianArrayFromPDate(this.pDate);
      pDateArray[2] = input;
      this.gDate = persianArrayToGregorianDate(pDateArray);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.date;
    }
  },
  // DAy of week
  days: function () {
    return this.day();
  },
  day: function () {
    return this.pDate.day;
  },
  month: function (input) {
    if (input | input === 0) {
      var pDateArray = getPersianArrayFromPDate(this.pDate);
      pDateArray[1] = input;
      this.gDate = persianArrayToGregorianDate(pDateArray);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.month;
    }
  },
  years: function (input) {
    return this.year(input);
  },
  year: function (input) {
    if (input | input === 0) {
      var pDateArray = getPersianArrayFromPDate(this.pDate);
      pDateArray[0] = input;
      this.gDate = persianArrayToGregorianDate(pDateArray);
      this._updatePDate();
      return this;
    } else {
      return this.pDate.year;
    }
  },
  getFirstWeekDayOfMonth: function (year, month) {
    var dateArray = calcPersian(year, month, 1), pdate = calcGregorian(dateArray[0], dateArray[1], dateArray[2]);
    if (pdate[3] + 2 === 8) {
      return 1;
    } else if (pdate[3] + 2 === 7) {
      return 7;
    } else {
      return pdate[3] + 2;
    }
  },
  clone: function () {
    var self = this;
    return new PersianDate(self.gDate);
  },

  _updatePDate: function () {
    this.pDate = toPersianDate(this.gDate);
  },
  valueOf: function () {
    return this._valueOf();
  }
};