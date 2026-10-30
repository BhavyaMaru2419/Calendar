const monthYear = document.getElementById("monthYear");
const dates = document.getElementById("dates");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const todayBtn = document.getElementById("todayBtn");

const today = new Date();

const MIN_YEAR = 1980;
const MAX_YEAR = 2080;

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();


if (currentYear < MIN_YEAR || currentYear > MAX_YEAR) {
    currentMonth = 0;
    currentYear = MIN_YEAR;
}

function displayCalendar() {
    const  firstDay = new Date(
        currentYear,
        currentMonth,
        1
    ).getDay();

    const lastDay = new Date(
    currentYear,
    currentMonth + 1,
    0
    ).getDate();

    const months = [
        "January", "February", "March",
        "April", "May", "June", 
        "July", "August", "September",
        "October", "November", "December"
    ];


    monthYear.innerHTML =
    months[currentMonth] + " " + currentYear;


    dates.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        dates.appendChild(empty);
    }

    for(let day = 1; day <= lastDay; day++){
        const date = document.createElement("div");

        date.innerHTML = day;


        const dayOfWeek = new Date(
            currentYear,
            currentMonth,
            day
        ).getDay();


        if(dayOfWeek === 0) {
            date.classList.add("sunday");
        }

        if(
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ){
            date.classList.add("today");
        }

        dates.appendChild(date);
    }


    prev.disabled =
    currentYear === MIN_YEAR &&
    currentMonth === 0;

    next.disabled =
    currentYear === MAX_YEAR &&
    currentMonth === 11;
}

prev.addEventListener("click", function(){

    if(currentYear === MIN_YEAR && currentMonth === 0){
        return;
    }

    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    displayCalendar();
});

next.addEventListener("click", function() {
    if(currentYear === MAX_YEAR && currentMonth === 11) {
        return;
    }

    currentMonth++;

    if(currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    displayCalendar();
});

todayBtn.addEventListener("click", function () {
    if (
        today.getFullYear() >= MIN_YEAR &&
        today.getFullYear() <= MAX_YEAR
    ) {

        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
    } else {
        currentMonth = 0;
        currentYear = MIN_YEAR;
    }
    displayCalendar();
});

displayCalendar();