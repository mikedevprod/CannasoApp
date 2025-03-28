import moment from "moment";

export function getDailyStayTime(fichajes) {
    const lastWeekDays = Array.from({ length: 7 }, (_, i) => {
        const date = moment().subtract(i, "days");
        return {
            day: date.format("dddd"),
            date: date.format("YYYY-MM-DD"),
            value: 0
        };
    }).reverse();

    const stayTimes = {};

    fichajes.forEach(({ fecha, entrada, salida }) => {
        const dayEntry = moment(`${fecha} ${entrada}`, "YYYY-MM-DD HH:mm:ss");
        let dayExit = moment(`${fecha} ${salida}`, "YYYY-MM-DD HH:mm:ss");
        
        // Si la salida es después de la medianoche, ajustar la fecha de salida
        if (dayExit.isBefore(dayEntry)) {
            dayExit.add(1, "day");
        }
        
        const duration = dayExit.diff(dayEntry, "seconds");
        const weekday = dayEntry.format("dddd");
        
        if (!stayTimes[weekday]) {
            stayTimes[weekday] = 0;
        }
        stayTimes[weekday] += duration;
    });

    return lastWeekDays.map(({ day, date }) => {
        const totalSeconds = stayTimes[day] || 0;
        const totalHours = totalSeconds / 3600;
        return { day, value: parseFloat(totalHours.toFixed(2)) };
    });
}