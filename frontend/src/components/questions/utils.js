export const getCategoryString = (categories) => {
  if (categories.length === 1) {
    return (
      categories[0]?.name.charAt(0).toUpperCase() + categories[0]?.name.slice(1)
    );
  } else if (categories.length === 2) {
    return (
      categories[0]?.name.charAt(0).toUpperCase() +
      categories[0]?.name.slice(1) +
      ", " +
      categories[1]?.name.charAt(0).toUpperCase() +
      categories[1]?.name.slice(1)
    );
  } else if (categories.length > 2) {
    return (
      categories[0]?.name.charAt(0).toUpperCase() +
      categories[0]?.name.slice(1) +
      " and " +
      (categories.length - 1) +
      " others"
    );
  }
  return "";
};

export const getCategoryListString = (categories) => {
  let categoriesListString = "";
  for (let i = 0; i < categories?.length; i++) {
    categoriesListString +=
      categories[i]?.name.charAt(0).toUpperCase() +
      categories[i]?.name.slice(1) +
      "<br/>";
  }
  return categoriesListString;
};

export const getDateString = (date) => {
  date = new Date(Date.parse(date));
  const currentDate = new Date();
  const differenceInSeconds = Math.floor((currentDate - date) / 1000);
  if (differenceInSeconds < 60) {
    return (
      differenceInSeconds +
      (differenceInSeconds === 1 ? " second ago" : " seconds ago")
    );
  } else if (differenceInSeconds < 3600) {
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    return (
      differenceInMinutes +
      (differenceInMinutes === 1 ? " minute ago" : " minutes ago")
    );
  } else if (differenceInSeconds < 86400) {
    const differenceInHours = Math.floor(differenceInSeconds / (60 * 60));
    return (
      differenceInHours + (differenceInHours === 1 ? " hour ago" : " hours ago")
    );
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === currentDate.toDateString()) {
      return "yesterday";
    }
  }

  const options = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  if (date.getFullYear() !== currentDate.getFullYear()) {
    options.year = "numeric";
  }
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};
