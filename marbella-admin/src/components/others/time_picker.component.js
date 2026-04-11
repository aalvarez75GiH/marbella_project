import React, { useState, useContext, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Container } from "../containers/general.containers";
import { Spacer } from "../spacers and globals/optimized.spacer.component";
import { Text } from "../../infrastructure/typography/text.component";

import { WarehouseContext } from "../../infrastructure/services/warehouse/warehouse.context";

const parseTimeStringToDate = (timeString, fallback = "08:00 AM") => {
  const value = timeString || fallback;

  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

  if (!match) {
    const fallbackMatch = fallback.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!fallbackMatch) return new Date();

    const [, fh, fm, fperiod] = fallbackMatch;
    let hours = Number(fh);
    const minutes = Number(fm);

    if (fperiod.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (fperiod.toUpperCase() === "AM" && hours === 12) hours = 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const [, h, m, period] = match;
  let hours = Number(h);
  const minutes = Number(m);

  if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatDateToTimeString = (date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const Time_Picker_Component = ({ type, coming_from }) => {
  const { warehouseSelected, setWarehouseSelected } =
    useContext(WarehouseContext);

  const isOpening = type === "opening_time";
  const caption = isOpening ? "Opening time" : "Closing time";

  const defaultTime =
    coming_from === "add_cta"
      ? isOpening
        ? "08:00 AM"
        : "05:00 PM"
      : isOpening
      ? warehouseSelected?.warehouse_information?.opening_time || "08:00 AM"
      : warehouseSelected?.warehouse_information?.closing_time || "05:00 PM";

  const [pickerValue, setPickerValue] = useState(
    parseTimeStringToDate(defaultTime, isOpening ? "08:00 AM" : "05:00 PM")
  );

  useEffect(() => {
    const nextTime = isOpening
      ? warehouseSelected?.warehouse_information?.opening_time || "08:00 AM"
      : warehouseSelected?.warehouse_information?.closing_time || "05:00 PM";

    setPickerValue(
      parseTimeStringToDate(nextTime, isOpening ? "08:00 AM" : "05:00 PM")
    );
  }, [
    isOpening,
    warehouseSelected?.warehouse_information?.opening_time,
    warehouseSelected?.warehouse_information?.closing_time,
  ]);

  return (
    <Container width="95%" height={"10%"} color="#F5F5F5" direction="row">
      <Container
        width="40%"
        padding_vertical="5%"
        // height={"100%"}
        color="#F5F5F5"
        justify="center"
        align="flex-start"
      >
        <Spacer position="left" size="large">
          <Text variant="raleway_bold_16">{caption}</Text>
        </Spacer>
      </Container>

      <Container width="60%" color="#F5F5F5" padding_vertical="5%">
        <DateTimePicker
          value={pickerValue}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={(event, selectedDate) => {
            if (!selectedDate) return;

            const formatted = formatDateToTimeString(selectedDate);
            setPickerValue(selectedDate);

            setWarehouseSelected({
              ...warehouseSelected,
              warehouse_information: {
                ...warehouseSelected.warehouse_information,
                opening_time: isOpening
                  ? formatted
                  : warehouseSelected?.warehouse_information?.opening_time ||
                    "08:00 AM",
                closing_time: isOpening
                  ? warehouseSelected?.warehouse_information?.closing_time ||
                    "05:00 PM"
                  : formatted,
              },
            });
          }}
        />
      </Container>
    </Container>
  );
};
