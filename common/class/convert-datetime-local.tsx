const convertIsoToLocalDateTime = (dateString: string) => {
  const utcDate = new Date(dateString);
  const localDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );

  const localYear = localDate.getFullYear();
  const localMonth = localDate.getMonth() + 1;
  const localDay = localDate.getDate();
  const localHours = localDate.getHours();
  const localMinutes = localDate.getMinutes();
  const localSeconds = localDate.getSeconds();

  const formattedLocalDate = `${localDay}/${localMonth}/${localYear}`;
  const formattedLocalTime = `${localHours}:${localMinutes}:${localSeconds}`;
  const dateTimeToNew = `${localDay}-${localMonth}-${localYear}`;

  return { formattedLocalDate, formattedLocalTime, dateTimeToNew };
};

export default convertIsoToLocalDateTime;
