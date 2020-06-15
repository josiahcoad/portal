import React, { useEffect } from "react";
import { useState } from "react";
import { ReminderInterface } from "../../Set/interfaces";
import * as UI from "./style";
import PropTypes from "prop-types";

/**
 * Reminder component
 */
export const Reminder: React.FC<ReminderInterface> = ({
  startTime,
  duration,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  /* Updates the reminder every 15 seconds */
  useEffect(() => {
    const checker = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(checker);
  }, []);

  /* Displays the reminder status if start time is less than 15 minutes away */
  if (startTime.getTime() - currentTime.getTime() < 15 * 60000) {
    const mins = Math.ceil(
      (startTime.getTime() - currentTime.getTime()) / 60000
    );
    let message = "Starts in " + mins.toString() + " minutes";
    if (mins < 0) {
      if (duration + mins > 0) {
        message = "Ongoing";
      } else {
        message = "Ended";
        return <UI.StyledExpiredReminder>{message}</UI.StyledExpiredReminder>;
      }
    }
    return <UI.StyledReminder>{message}</UI.StyledReminder>;
  } else {
    return <></>;
  }
};

Reminder.propTypes = {
  startTime: PropTypes.any.isRequired,
};
