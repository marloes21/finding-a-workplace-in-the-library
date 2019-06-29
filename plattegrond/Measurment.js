class Measurement {

  constructor(id, apID, dateTime, estimatedPeople) {
    this.id = id;
    this.apID = apID;
    this.estimatedPeople = estimatedPeople;
    this.date = new Date(dateTime);
  }
  
  isFromDayAndHour(year, month, day, hour) {
    return (this.date.getFullYear() == year && this.date.getMonth() == (month-1) && this.date.getDate() == day && this.date.getHours() == hour);
  }

}
