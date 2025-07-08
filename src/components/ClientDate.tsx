"use client";

import { format } from "date-fns";

interface ClientDateProps {
  date: Date | string;
}

const ClientDate: React.FC<ClientDateProps> = ({ date }) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return (
    <time dateTime={dateObj.toISOString()}>
      {format(dateObj, "MMM d, h:mm a")}
    </time>
  );
};

export default ClientDate;
