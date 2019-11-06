import { useEffect } from 'react';
import moment from 'moment'
import 'moment/locale/es';

moment.fn.getFarmTime = function() {
  return {
    calendar: this.format('YYYY-MM-DD'),
    year: this.isoWeekYear(),
    week: this.week(),
    day: this.weekday()+ 1
  }
}

moment.defineLocale('custom', {parentLocale: 'en', week: {dow: 0}})

export {moment};

export default function useMoment(language, group) {
  let {weekStart = 0} = group || {}
  useEffect(() => {
    moment.updateLocale('custom', {parentLocale: language, week: {dow: weekStart}})
    moment.locale('custom')
  }, [language, weekStart])
  return moment;
}
