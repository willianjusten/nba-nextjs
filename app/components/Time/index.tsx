"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";

type TimeProps = {
  time: Date;
};

function Time({ time }: TimeProps) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => setFormattedDate(format(new Date(time), "h:mm a")), [time]);

  return <time suppressHydrationWarning={true}>{formattedDate}</time>;
}

export default Time;
