export const formatDate = (d: number, inFuture = true) => {
  const roundDay = (n: number) => Math.floor((new Date(n).getTime() - new Date(n).getTimezoneOffset()*60*1000) / 86400000);

  if (inFuture && (roundDay(d * 1000) - roundDay(Date.now()) === 0)) {
    return 'today ' + (new Date(d * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }));
  } else if (inFuture && (roundDay(d * 1000) - roundDay(Date.now()) === 1)) {
    return 'tomorrow ' + (new Date(d * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
    }));
  }

  let f = new Date(d * 1000).toLocaleDateString('en-US', {
    weekday: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'short' : 'long',
    year: (new Date(d * 1000).getFullYear() === new Date().getFullYear()) ? undefined : 'numeric',
    month: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'long' : undefined,
    day: ((roundDay(d * 1000) - roundDay(Date.now())) * (inFuture ? 1 : -1) > 7) ? 'numeric' : undefined,
    hour: inFuture ? 'numeric' : undefined,
    minute: inFuture ? 'numeric' : undefined,
  });
  if (!inFuture && (roundDay(d * 1000) - roundDay(Date.now())) * (-1) <= 7) {
    if (roundDay(d * 1000) - roundDay(Date.now()) === 0) {
      return 'today';
    }
    if (roundDay(d * 1000) - roundDay(Date.now()) === -1) {
      return 'yesterday';
    }
    f = 'last ' + f;
  }
  return f;
}

export const formatInterval = (d: number) => {
  return d === 1 ? 'daily' :
    d == 7 ? 'weekly' :
      'once every ' + d + ' days';
}

// export const formatDate = (date: Date): string => {
//   const today = new Date();
//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);
//   const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
//   const oneWeek = 7 * oneDay; // One week in milliseconds

//   if (isSameDay(date, today)) {
//     return `Today at ${formatTime(date)}`;
//   } else if (isSameDay(date, yesterday)) {
//     return `Yesterday at ${formatTime(date)}`;
//   } else if (date.getTime() > today.getTime() - oneWeek) {
//     return `${getDayOfWeek(date)} ${formatTime(date)}`;
//   } else {
//     return formatDateOnly(date);
//   }
// };

// const isSameDay = (date1: Date, date2: Date): boolean => {
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// };

// const formatTime = (date: Date): string => {
//   return date.toLocaleTimeString(navigator.language, {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const formatDateOnly = (date: Date): string => {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//   };
//   return date.toLocaleDateString(navigator.language, options);
// };

// const getDayOfWeek = (date: Date): string =>
//   date.toLocaleDateString(navigator.language, { weekday: "long" });
