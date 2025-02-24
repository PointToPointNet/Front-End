import style from "../styles/total-datepicker.module.scss";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

const TotalDatepicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Date>(new Date("2025-02-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2025-02-07"));

  const handleStartDateChange = (date: Date) => {
    //일주일 범위 유지를 위한 코드
    const oneWeekLater = new Date(date?.getTime() + 6 * 24 * 60 * 60 * 1000);

    if (endDate < date || endDate > oneWeekLater) {
      setEndDate(oneWeekLater);
      setStartDate(date);
      onDateChange(date, oneWeekLater);
    } else {
      setStartDate(date);
      onDateChange(date, endDate);
    }
  };

  const handleEndDateChange = (date: Date) => {
    //일주일 범위 유지를 위한 코드
    const oneWeekBefore = new Date(date.getTime() - 6 * 24 * 60 * 60 * 1000);
    if (startDate > date || startDate < oneWeekBefore) {
      setStartDate(oneWeekBefore);
      setEndDate(date);
      onDateChange(oneWeekBefore, date);
    } else {
      setEndDate(date);
      onDateChange(startDate, date);
    }
  };
  return (
    <div className={style.container}>
      {/* <div> */}
      <div>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
        />
      </div>
      <div>~</div>
      <div>
        <label></label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
        />
      </div>
    </div>
  );
};

export default TotalDatepicker;
