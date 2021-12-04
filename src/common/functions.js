export const getDayOfTheWeekInNumber = (dayOfTheWeek) => {
  let dayInNo = 0;
  switch (dayOfTheWeek) {
    case "sunday":
      return (dayInNo = 0);
      break;
    case "monday":
      return (dayInNo = 1);
      break;
    case "tuesday":
      return (dayInNo = 2);
      break;
    case "wednesday":
      return (dayInNo = 3);
      break;
    case "thursday":
      return (dayInNo = 4);
      break;
    case "friday":
      return (dayInNo = 5);
      break;
    case "saturday":
      return (dayInNo = 6);
      break;
    default:
      break;
  }

  return dayInNo;
};

export const getDayOfTheWeekFromNumber = (dayOfTheWeek) => {
  let dayInString = "";
  switch (dayOfTheWeek) {
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    case 6:
      return "Saturday";
      break;
    default:
      break;
  }

  return dayInString;
};

export const formatNumberWithComma = (number) => {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};
export default {
  getDayOfTheWeekFromNumber,
  getDayOfTheWeekInNumber,
  formatNumberWithComma,
};
