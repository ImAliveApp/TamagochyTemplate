interface ICalendarManager {

   /**
    * This method will return an array that contains the events the user has this week.
    */
    getWeeklyEvents(): ICalendarEvent[];
}