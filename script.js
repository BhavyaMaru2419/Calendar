const dates = document.getElementById("dates");

const selectedDateText = document.getElementById("selectedDate");
const eventForm = document.getElementById("eventForm");

const eventTitle = document.getElementById("eventTitle");
const eventTime = document.getElementById("eventTime");
const eventDescription = document.getElementById("eventDescription");
const eventReminder = document.getElementById("eventReminder");
const eventList = document.getElementById("eventList");

const prev = document.getElementById("prev");
const next = document.getElementById("next");
const todayBtn = document.getElementById("todayBtn");

const monthSelect = document.getElementById("monthSelect");
const yearSelect = document.getElementById("yearSelect");

const today = new Date();

const MIN_YEAR = 1980;
const MAX_YEAR = 2080;

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let events = JSON.parse(
    localStorage.getItem("calendarEvents") || "[]"
);

let selectedDate = null;

function getDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}


if (currentYear < MIN_YEAR || currentYear > MAX_YEAR) {
    currentMonth = 0;
    currentYear = MIN_YEAR;
}

for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    const option = document.createElement("option");

    option.value = year;
    option.textContent = year;

    yearSelect.appendChild(option);
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



    monthSelect.value = currentMonth + 1;
    yearSelect.value = currentYear;


    dates.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        dates.appendChild(empty);
    }

    for(let day = 1; day <= lastDay; day++){
        const date = document.createElement("div");

        date.innerHTML = day;

        const dateKey = getDateKey(
            currentYear,
            currentMonth,
            day
        );

        date.dataset.date = dateKey;

        if(selectedDate === dateKey) {
            date.classList.add("selected");
        }

        if(events.some(event => event.date === dateKey)) {
            date.classList.add("has-event");
        }

        date.addEventListener("click", function(){
            
            selectedDate = dateKey;

            displayCalendar();
        });


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

    renderEvents();
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

monthSelect.addEventListener("change", function() {

    currentMonth = Number(monthSelect.value) - 1;

    displayCalendar();
});

yearSelect.addEventListener("change", function() {
    
    currentYear = Number(yearSelect.value);
    
    displayCalendar();
});

function renderEvents() {
    eventList.innerHTML = "";

    if(!selectedDate) {
        selectedDateText.textContent = "Select a date";
        return;
    }

    const [year, month, day] = selectedDate.split("-");

    selectedDateText.textContent = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
    ).toDateString();

    const dayEvents = events.filter(
        event => event.date === selectedDate
    );
    
    if(dayEvents.length === 0) {
        eventList.textContent = "No events for this date.";
        return;
    }

    dayEvents.forEach(function(event) {
        const card = document.createElement("div");
        card.classList.add("event-card");
        const title = document.createElement("h4");
        title.textContent = event.title;
        const time = document.createElement("p");
        time.textContent = "Time: " + event.time;
        const description = document.createElement("p");
        description.textContent = event.description;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete Event";
        deleteBtn.classList.add("delete-event");

        deleteBtn.addEventListener("click", function() {
            events = events.filter(
                item => item.id !== event.id
            );

            localStorage.setItem(
                "calendarEvents",
                JSON.stringify(events)
            );
            displayCalendar();
        });

        card.appendChild(title);
        card.appendChild(time);
        card.appendChild(description);
        card.appendChild(deleteBtn);

        eventList.appendChild(card);

    });
}

eventForm.addEventListener("submit", function(e) {
    e.preventDefault();

    if(!selectedDate) {
        alert("Please select a date first.");
        return;
    }

    const newEvent = {

        id: Date.now(),
        title: eventTitle.value.trim(),
        date: selectedDate,
        time: eventTime.value,
        description: eventDescription.value.trim(),
        reminder: eventReminder.value
    };

    events.push(newEvent);

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

    eventForm.reset();

displayCalendar();
});
displayCalendar();
