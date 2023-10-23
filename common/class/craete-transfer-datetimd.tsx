import convertIsoToLocalDateTime from "./convert-datetime-local";

const craeteTransferDatetime = (strDate: string): string => {
  const { formattedLocalDate, formattedLocalTime } =
    convertIsoToLocalDateTime(strDate);

  return `${formattedLocalDate} ${formattedLocalTime}`;
};

export default craeteTransferDatetime;
