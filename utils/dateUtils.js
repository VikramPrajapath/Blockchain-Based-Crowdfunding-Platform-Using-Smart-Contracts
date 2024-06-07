// utils/dateUtils.js
export const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Use 12-hour format
    };
    return dateObj.toLocaleString("en-US", options); // Adjust the locale as needed
  };