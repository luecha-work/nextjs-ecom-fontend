const formatDateThai = (strDate: string): string => {
  const utcDate = new Date(strDate);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );

  const localYear = localDate.getFullYear() + 543;
  const localMonth = localDate.getMonth() + 1;
  const localDay = localDate.getDate();

  const formattedMonth = localMonth < 10 ? `0${localMonth}` : `${localMonth}`;
  const formattedDay = localDay < 10 ? `0${localDay}` : `${localDay}`;

  return `${formattedDay}/${formattedMonth}/${localYear}`;
};

export default formatDateThai;
