const shifts = {};  // Store shifts in the format { date: [{start, end, hours}] }
const weeklyLimit = 28;

// Generate calendar for the current month
function generateCalendar() {
  const calendar = document.getElementById("calendar");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";  // Clear previous calendar entries
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");
    dayDiv.innerText = day;
    dayDiv.onclick = () => displayShifts(date);
    calendar.appendChild(dayDiv);
  }
}

function addShift() {
  const date = document.getElementById("shiftDate").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  
  if (!date || !startTime || !endTime) return alert("Please complete all fields");

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const hours = (end - start) / (1000 * 60 * 60);
  if (hours <= 0) return alert("End time must be after start time");

  if (!shifts[date]) shifts[date] = [];
  shifts[date].push({ start: startTime, end: endTime, hours });
  
  calculateWeeklyHours();
  generateCalendar();
  alert("Shift added!");
}

function displayShifts(date) {
  const dayShifts = shifts[date];
  if (dayShifts) {
    let message = `Shifts on ${date}:\n`;
    dayShifts.forEach((shift, i) => {
      message += `Shift ${i + 1}: ${shift.start} - ${shift.end} (${shift.hours} hours)\n`;
    });
    alert(message);
  } else {
    alert("No shifts on this date.");
  }
}

function calculateWeeklyHours() {
  const warningDiv = document.getElementById("warning");
  warningDiv.innerText = "";

  const dates = Object.keys(shifts).sort();
  let weeklyHours = 0;

  for (let i = 0; i < dates.length; i++) {
    const currentWeek = dates.slice(i, i + 7);
    weeklyHours = currentWeek.reduce((total, date) => {
      return total + shifts[date].reduce((sum, shift) => sum + shift.hours, 0);
    }, 0);

    if (weeklyHours > weeklyLimit) {
      warningDiv.innerText = "Warning: Exceeding 28-hour limit in a 7-day period!";
      break;
    }
  }
}

window.onload = generateCalendar;
