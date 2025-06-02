const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTycIgcx5txH28a-ourZUA5MClM-6PrCEsJhzY7i_FDvWqISv4NImxIQSnK4uUQVcPmkK645dJW6hHD/pub?gid=0&single=true&output=csv";

const seatingData = [
  { row: "A", seatsLeft: 15, seatsRight: 15, rate: 800 },
  { row: "B", seatsLeft: 14, seatsRight: 14, rate: 800 },
  { row: "C", seatsLeft: 15, seatsRight: 15, rate: 700 },
  { row: "D", seatsLeft: 14, seatsRight: 14, rate: 700 },
  { row: "E", seatsLeft: 15, seatsRight: 15, rate: 600 },
  { row: "F", seatsLeft: 14, seatsRight: 14, rate: 600 },
  { row: "G", seatsLeft: 15, seatsRight: 15, rate: 500 },
  { row: "H", seatsLeft: 14, seatsRight: 14, rate: 500 },
  { row: "J", seatsLeft: 15, seatsRight: 15, rate: 500 },
  { row: "K", seatsLeft: 14, seatsRight: 14, rate: 500 },
  { row: "L", seatsLeft: 15, seatsRight: 15, rate: 400 },
  { row: "M", seatsLeft: 14, seatsRight: 14, rate: 400 },
  { row: "N", seatsLeft: 15, seatsRight: 15, rate: 400 },
  { row: "O", seatsLeft: 14, seatsRight: 14, rate: 400 },
  { row: "P", seatsLeft: 15, seatsRight: 15, rate: 300 },
  { row: "Q", seatsLeft: 14, seatsRight: 14, rate: 300 },
  { row: "R", seatsLeft: 15, seatsRight: 15, rate: 300 },
  { row: "S", seatsLeft: 14, seatsRight: 14, rate: 300 },
  { row: "T", seatsLeft: 15, seatsRight: 15, rate: 300 },
  { row: "U", seatsLeft: 14, seatsRight: 14, rate: 300 },
  { row: "V", seatsLeft: 15, seatsRight: 15, rate: 200 },
  { row: "W", seatsLeft: 14, seatsRight: 14, rate: 200 },
  // { row: "X", seatsLeft: 13, seatsRight: 13, rate: 200 },
  // { row: "Y", seatsLeft: 6, seatsRight: 5, rate: 200 },
];

const tableData = [
  {
    rows: "A-B",
    price: 800,
  },
  {
    rows: "C-D",
    price: 700,
  },
  {
    rows: "E-F",
    price: 600,
  },
  {
    rows: "G-H-J-K",
    price: 500,
  },
  {
    rows: "L-M-N-O",
    price: 400,
  },
  {
    rows: "P-Q-R-S-T-U",
    price: 300,
  },
  {
    rows: "V-W",
    price: 200,
  },
];

const auditorium = document.getElementById("auditorium");
const bookedCount = document.getElementById("booked-count");
const vacantCount = document.getElementById("vacant-count");
// const reservedCount = document.getElementById("reserved-count");
const table = document.getElementById("details-table");
const loader = document.querySelector(".loader");
const main = document.querySelector(".main");

let currentRate = null;
let groupDiv = null;
let sheetData = [];

const dateTime = document.querySelector(".date-time");

async function getBookedSeats() {
  try {
    loader.style.display = "flex";
    main.style.display = "none";
    // bookingContainer.style.display = "none";

    sheetData = await fetchData();
    bookedCount.innerHTML = sheetData.filter(
      (item) => item.BookingStatus === "Booked"
    ).length;

    vacantCount.innerHTML = sheetData.filter(
      (item) => item.BookingStatus === "Vacant"
    ).length;

    // reservedCount.innerHTML = sheetData.filter(
    //   (item) => item.BookingStatus === "Reserved"
    // ).length;

    displayCurrentDateTime();
    generateTableData(sheetData);
    renderAuditorium(sheetData);
  } catch (error) {
    console.log("Error fetching API data", error);
  } finally {
    loader.style.display = "none";
    main.style.display = "block";
  }
}

function renderAuditorium(inputSeats) {
  seatingData.forEach(({ row, seatsLeft, seatsRight, rate }) => {
    if (rate !== currentRate) {
      currentRate = rate;

      groupDiv = document.createElement("div");
      groupDiv.className = `price-group-border`;

      const priceLabel = document.createElement("div");
      priceLabel.className = "price-label";
      priceLabel.innerText = `₹${rate} Seats`;
      groupDiv.appendChild(priceLabel);

      auditorium.appendChild(groupDiv);
    }

    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    // Left side seats (descending)
    for (let i = seatsLeft; i >= 1; i--) {
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.innerText = i;

      let res1 = checkBookingStatus(row, i, inputSeats, "Booked");
      if (res1.length > 0) {
        seat.classList.add("booked");
      }

      let res2 = checkBookingStatus(row, i, inputSeats, "Vacant");
      if (res2.length > 0) {
        seat.classList.add("vacant");
      }

      // let res3 = checkBookingStatus(row, i, inputSeats, "Reserved");
      // if (res3.length > 0) {
      //   seat.classList.add("reserved");
      // }

      seat.setAttribute("data-tooltip", `${row}${i} - ₹${rate}`);
      rowDiv.appendChild(seat);
    }

    // Row label in center
    const gap = document.createElement("div");
    gap.className = "row-gap";
    gap.innerText = row;
    rowDiv.appendChild(gap);

    // Right side seats (ascending)
    for (let i = 21; i < 21 + seatsRight; i++) {
      const seat = document.createElement("div");
      seat.className = "seat";
      seat.innerText = i;
      let res1 = checkBookingStatus(row, i, inputSeats, "Booked");
      if (res1.length > 0) {
        seat.classList.add("booked");
      }

      let res2 = checkBookingStatus(row, i, inputSeats, "Vacant");
      if (res2.length > 0) {
        seat.classList.add("vacant");
      }

      // let res3 = checkBookingStatus(row, i, inputSeats, "Reserved");
      // if (res3.length > 0) {
      //   seat.classList.add("reserved");
      // }

      seat.setAttribute("data-tooltip", `${row}${i} - ₹${rate}`);
      rowDiv.appendChild(seat);
    }

    groupDiv.appendChild(rowDiv);
  });
}

function generateTableData(inputSeatsArray) {
  const tickets800 = inputSeatsArray.filter(
    (item) => item.Price === "800" && item.BookingStatus === "Booked"
  );
  const tickets700 = inputSeatsArray.filter(
    (item) => item.Price === "700" && item.BookingStatus === "Booked"
  );
  const tickets600 = inputSeatsArray.filter(
    (item) => item.Price === "600" && item.BookingStatus === "Booked"
  );
  const tickets500 = inputSeatsArray.filter(
    (item) => item.Price === "500" && item.BookingStatus === "Booked"
  );
  const tickets400 = inputSeatsArray.filter(
    (item) => item.Price === "400" && item.BookingStatus === "Booked"
  );
  const tickets300 = inputSeatsArray.filter(
    (item) => item.Price === "300" && item.BookingStatus === "Booked"
  );
  const tickets200 = inputSeatsArray.filter(
    (item) => item.Price === "200" && item.BookingStatus === "Booked"
  );

  tableData.forEach((item) => {
    if (item.price === 800) {
      item.bookedCount = tickets800?.length;
      item.vacantCount = 56 - tickets800?.length;
    }
    if (item.price === 700) {
      item.bookedCount = tickets700?.length;
      item.vacantCount = 48 - tickets700?.length;
    }
    if (item.price === 600) {
      item.bookedCount = tickets600?.length;
      item.vacantCount = 58 - tickets600?.length;
    }
    if (item.price === 500) {
      item.bookedCount = tickets500?.length;
      item.vacantCount = 116 - tickets500?.length;
    }
    if (item.price === 400) {
      item.bookedCount = tickets400?.length;
      item.vacantCount = 116 - tickets400?.length;
    }
    if (item.price === 300) {
      item.bookedCount = tickets300?.length;
      item.vacantCount = 174 - tickets300?.length;
    }
    if (item.price === 200) {
      item.bookedCount = tickets200?.length;
      item.vacantCount = 58 - tickets200?.length;
    }
  });
  console.log(tableData);
  table.innerHTML += ` <tr>
                          <th>Rows</th>
                          <th>Price(₹)</th>
                          <th>Booked</th>
                          <th>Available</th>
                      </tr>`;

  tableData.map((t) => {
    table.innerHTML += `
      <td>${t.rows}</td>
      <td>${t.price}</td>
      <td>${t?.bookedCount}</td>
      <td>${t?.vacantCount}</td>
      </tr>
    
      `;
  });
}

function checkBookingStatus(row, i, inputArray, status) {
  const statusResult = inputArray.filter(
    (item) =>
      item?.RowNumber === row.toString() &&
      item?.SeatNumber === i.toString() &&
      item?.BookingStatus === status
  );

  return statusResult;
}

async function fetchData() {
  console.time("fetching api data");
  const response = await fetch(url);
  const data = await response.text();
  console.timeEnd("fetching api data");
  console.log(data);
  const filteredData = parseCSV(data);
  console.log(filteredData, "filtered data");
  return filteredData;
}

function parseCSV(csvText) {
  const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
  const headers = rows[0].split(","); // Extract headers (assumes the first row is the header row)
  const data = []; // Initialize an array to store parsed data
  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(","); // Split the row, handling '\r' characters
    const rowObject = {};
    for (let j = 0; j < headers.length; j++) {
      rowObject[headers[j]] = rowData[j];
    }
    data.push(rowObject);
  }
  return data;
}

function displayCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  dateTime.textContent = formattedDateTime;
}

function getLatestUpdate() {
  window.location.reload();
}

getBookedSeats();
