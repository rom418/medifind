// state
let selectedBodyPart = null;
let selectedDoctor = null;
let selectedSlot = null;

// element references (initialised after DOM load)
let contentDisplay;
let dateInput;
let timeSlotsContainer;
let doctorListContainer;
let bookBtn;

const TIMES = ['09:00','10:00','11:00','13:00','14:00','15:00'];

// helper to wire events once DOM is ready
function init() {
    contentDisplay = document.getElementById("content-display");
    dateInput = document.getElementById('appt-date');
    timeSlotsContainer = document.getElementById('time-slots');
    doctorListContainer = document.getElementById('doctor-list');
    // remove book button reference since booking will trigger after selection



    dateInput && dateInput.addEventListener('change', () => {
        populateTimeSlots();
    });

    // book button toggling
    bookBtn = document.getElementById('book-btn');
    if (bookBtn) {
        bookBtn.addEventListener('click', () => {
            doctorListContainer && doctorListContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // prescription history toggle
    const histToggle = document.getElementById('history-toggle');
    const histPanel = document.getElementById('prescription-history');
    if (histToggle && histPanel) {
        histToggle.addEventListener('click', () => {
            histPanel.style.display = histPanel.style.display === 'none' ? 'block' : 'none';
        });
    }

}

document.addEventListener('DOMContentLoaded', init);

function showContent(bodyPart) {
    selectedBodyPart = bodyPart;
    selectedDoctor = null;
    selectedSlot = null;
    contentDisplay.innerHTML = `<h3>Fetching details...</h3>`;
    // show book button
    if (bookBtn) bookBtn.classList.remove('hidden');
    // load table data from backend
    fetchDoctors();
}

function populateTimeSlots() {
    timeSlotsContainer.innerHTML = '';
    TIMES.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t;
        btn.addEventListener('click', () => {
            selectedSlot = t;
            submitAppointment();
        });
        timeSlotsContainer.appendChild(btn);
    });
}

function fetchDoctors() {
    doctorListContainer.innerHTML = 'Loading records...';
    if (!selectedBodyPart) {
        doctorListContainer.textContent = 'Choose body part first';
        return;
    }
    fetch(`/api/doctors?category=${selectedBodyPart}`)
        .then(resp => resp.json())
        .then(data => {
            if (data.error) {
                doctorListContainer.textContent = data.error;
                return;
            }
            // integrate by showing entire table results
            renderTable(data.doctors);
        })
        .catch(err => {
            doctorListContainer.textContent = 'Failed to load data';
            console.error(err);
        });
}

// render full table data
function renderTable(rows) {
    doctorListContainer.innerHTML = '';
    if (!rows || !rows.length) {
        doctorListContainer.textContent = 'No records found.';
        return;
    }
    // build a simple HTML table
    const table = document.createElement('table');
    table.border = 1;
    // header row: columns indexes
    const header = table.insertRow();
    const cols = rows[0].length;
    for (let c = 0; c < cols; c++) {
        const th = document.createElement('th');
        th.textContent = `Col ${c+1}`;
        header.appendChild(th);
    }
    // body rows
    rows.forEach(r => {
        const tr = table.insertRow();
        r.forEach(val => {
            const td = tr.insertCell();
            td.textContent = val;
        });
    });
    doctorListContainer.appendChild(table);
    // also provide booking buttons per row if desired
    // for now show table only
}

// show booking form inline (replacing modal)
function showBookingForm(doctorName) {
    selectedSlot = null;
    // hide book button top
    if (bookBtn) bookBtn.classList.add('hidden');
    // append simple booking block under doctor list
    const container = document.createElement('div');
    container.id = 'inline-booking';
    container.innerHTML = `
        <h3>Book with ${doctorName}</h3>
        <label>Date: <input type="date" id="appt-date"></label>
        <div id="time-slots"></div>
        <button id="cancel-booking">Cancel</button>
    `;
    doctorListContainer.after(container);
    dateInput = document.getElementById('appt-date');
    timeSlotsContainer = document.getElementById('time-slots');
    const cancelBtn = document.getElementById('cancel-booking');
    cancelBtn.addEventListener('click', () => {
        container.remove();
    });
}

function submitAppointment() {
    if (!selectedDoctor || !dateInput.value || !selectedSlot) return;
    const payload = {
        doctor: selectedDoctor,
        body_part: selectedBodyPart,
        appt_date: dateInput.value,
        appt_time: selectedSlot
    };
    fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.error) {
            alert('Booking failed: ' + data.error);
        } else {
            alert('Booked successfully');
            // remove inline form if exists
            const f = document.getElementById('inline-booking');
            if (f) f.remove();
        }
    })
    .catch(e => {
        alert('Booking error');
        console.error(e);
    });
}

