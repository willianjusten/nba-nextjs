"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

const Time = ({ time }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => setFormattedDate(format(new Date(time), "h:mm a")), [time]);

  return <time>{formattedDate}</time>;
};

export default Time;
