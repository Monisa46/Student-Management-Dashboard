
// ========== Global Variables ==========
let students = JSON.parse(localStorage.getItem("students")) || [];

// ========== DOM Elements ==========
const form = document.getElementById("studentForm");
const nameInput = document.getElementById("name");
const regnoInput = document.getElementById("regno");
const deptInput = document.getElementById("dept");
const yearInput = document.getElementById("year");
const marksInput = document.getElementById("marks");
const editIndexInput = document.getElementById("editIndex");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");

// ========== Render Table ==========
function renderTable(data = students) {
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-muted">No records found.</td></tr>`;
    return;
  }

  data.forEach((student, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.regno}</td>
        <td>${student.dept}</td>
        <td>${student.year}</td>
        <td>${student.marks}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editStudent(${index})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// ========== Save to LocalStorage ==========
function saveToLocal() {
  localStorage.setItem("students", JSON.stringify(students));
}

// ========== Reset Form ==========
function resetForm() {
  form.reset();
  editIndexInput.value = "";
}

// ========== Add / Update Student ==========
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const regno = regnoInput.value.trim();
  const dept = deptInput.value.trim();
  const year = yearInput.value;
  const marks = marksInput.value.trim();
  const editIndex = editIndexInput.value;

  if (!name || !regno || !dept || !year || !marks) {
    alert("All fields are required!");
    return;
  }

  const student = { name, regno, dept, year, marks };

  if (editIndex === "") {
    students.push(student);
  } else {
    students[editIndex] = student;
  }

  saveToLocal();
  renderTable();
  resetForm();
});

// ========== Edit Student ==========
function editStudent(index) {
  const student = students[index];
  nameInput.value = student.name;
  regnoInput.value = student.regno;
  deptInput.value = student.dept;
  yearInput.value = student.year;
  marksInput.value = student.marks;
  editIndexInput.value = index;
  scrollToForm();
}

// ========== Delete Student ==========
function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    saveToLocal();
    renderTable();
  }
}

// ========== Search Functionality ==========
searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(keyword) ||
      s.regno.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
});

// ========== Scroll to Form ==========
function scrollToForm() {
  form.scrollIntoView({ behavior: "smooth" });
}

// ========== Initialize ==========
window.onload = function () {
  renderTable();
};

// ========== Optional: Clear All ==========
function clearAllRecords() {
  if (confirm("Delete ALL student records? This cannot be undone.")) {
    students = [];
    saveToLocal();
    renderTable();
  }
}

// ========== Optional: Sort by Marks ==========
function sortByMarks(order = "desc") {
  students.sort((a, b) =>
    order === "asc" ? a.marks - b.marks : b.marks - a.marks
  );
  saveToLocal();
  renderTable();
}

// ========== Optional: Filter by Department ==========
function filterByDept(dept) {
  const filtered = students.filter((s) => s.dept === dept);
  renderTable(filtered);
}

// ========== Optional: Export to CSV ==========
function exportToCSV() {
  if (students.length === 0) return alert("No data to export!");

  const headers = ["Name", "RegNo", "Dept", "Year", "Marks"];
  const rows = students.map((s) =>
    [s.name, s.regno, s.dept, s.year, s.marks].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
}

// ========== Hook for Debugging (optional) ==========
window.dashboard = {
  renderTable,
  clearAllRecords,
  sortByMarks,
  filterByDept,
  exportToCSV,
  get students() {
    return students;
  }
};
