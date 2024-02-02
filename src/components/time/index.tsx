"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: string }) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => setFormattedDate(format(new Date(time), "h:mm a")), [time]);

  return <time>{formattedDate}</time>;
};

export default Time;
