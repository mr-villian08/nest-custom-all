// ? ************************** Convert Time to 12 Hour Format **************************
export const convertTimeTo12HourFormat = (time: string): string => {
  const [hours, minutes] = time.split(':');

  let hour = parseInt(hours, 10);

  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour > 12) {
    hour -= 12;
  }

  return `${hour}:${minutes} ${period}`;
};

// ? ************************** Convert Time to 24 Hour Format **************************
export const convertTimeTo24HourFormat = (time: string): string => {
  const [hours, minutes] = time.split(':');

  let hour = parseInt(hours, 10);

  if (time.includes('PM') && hour < 12) {
    hour += 12;
  } else if (time.includes('AM') && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

// ? ************************** Convert Seconds to Duration **************************
export const secondsToDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);

  const mins = Math.floor((seconds % 3600) / 60);

  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};
