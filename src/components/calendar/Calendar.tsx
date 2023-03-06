import { add, format } from "date-fns";
import { type Dispatch, type SetStateAction } from "react";
import ReactCalenadar from "react-calendar";
import {
  BOOKING_INTERVAL,
  CLOSING_HOURS,
  OPENING_HOURS,
} from "~/constants/config";
import { type DateType } from "~/utils/types";

interface indexProps {
  date: DateType;
  setDate: Dispatch<SetStateAction<DateType>>;
}

const Calendar = ({ date, setDate }: indexProps) => {
  const getTimes = () => {
    if (!date.justDate) return;

    const { justDate } = date;

    // Restaurant opening time
    const beginning = add(justDate, { hours: OPENING_HOURS });
    // Restaurant closing time
    const end = add(justDate, { hours: CLOSING_HOURS });

    // Interval time of booking
    const interval = BOOKING_INTERVAL;

    const times = [];

    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i);
    }
    return times;
  };

  const times = getTimes();
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      {date.justDate ? (
        <div className="gap-4> flex">
          {times?.map((time, i) => (
            <div key={`time-${i}`} className="rounded-sm bg-gray-100 p-2">
              <button
                type="button"
                onClick={() =>
                  setDate((prevState) => ({ ...prevState, dateTime: time }))
                }
              >
                {format(time, "kk:mm")}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <ReactCalenadar
          minDate={new Date()}
          className="REACT_CALENDAR p-2"
          view="month"
          locale="EN-US"
          onClickDay={(day) =>
            setDate((prev) => ({
              ...prev,
              justDate: day,
            }))
          }
        />
      )}
    </div>
  );
};

export default Calendar;
