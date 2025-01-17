let rowCount = 0;
let savedResults = [];

function addRow() {
    rowCount++;
    const table = document.getElementById('gradesTable');
    const row = table.insertRow();
    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="number" id="coefficient${rowCount}" min="1" step="1" required></td>
        <td>
            <select id="type${rowCount}" onchange="toggleInputs(${rowCount})">
                <option value="both">كلاهما</option>
                <option value="tp">أعمال تطبيقية فقط</option>
                <option value="exam">امتحان فقط</option>
            </select>
        </td>
        <td><input type="number" id="tp${rowCount}" min="0" max="20" step="0.01" oninput="calculateGrade(${rowCount})" required></td>
        <td><input type="number" id="exam${rowCount}" min="0" max="20" step="0.01" oninput="calculateGrade(${rowCount})" required></td>
        <td id="grade${rowCount}">-</td>
    `;
}

function toggleInputs(row) {
    const type = document.getElementById(`type${row}`).value;
    const tpInput = document.getElementById(`tp${row}`);
    const examInput = document.getElementById(`exam${row}`);

    if (type === 'tp') {
        tpInput.disabled = false;
        examInput.disabled = true;
        examInput.value = '';
    } else if (type === 'exam') {
        tpInput.disabled = true;
        tpInput.value = '';
        examInput.disabled = false;
    } else {
        tpInput.disabled = false;
        examInput.disabled = false;
    }

    calculateGrade(row);
}

function calculateGrade(row) {
    const type = document.getElementById(`type${row}`).value;
    const tp = parseFloat(document.getElementById(`tp${row}`).value);
    const exam = parseFloat(document.getElementById(`exam${row}`).value);
    let grade = 0;

    if (type === 'tp' && !isNaN(tp)) {
        grade = tp;
    } else if (type === 'exam' && !isNaN(exam)) {
        grade = exam;
    } else if (type === 'both' && !isNaN(tp) && !isNaN(exam)) {
        grade = (tp * 0.4) + (exam * 0.6);
    }

    document.getElementById(`grade${row}`).innerText = !isNaN(grade) ? grade.toFixed(2) : '-';
}

function calculateAverage() {
    let totalWeightedGrades = 0;
    let totalCoefficients = 0;

    for (let i = 1; i <= rowCount; i++) {
        const coefficient = parseFloat(document.getElementById(`coefficient${i}`).value);
        const grade = parseFloat(document.getElementById(`grade${i}`).innerText);

        if (!isNaN(coefficient) && !isNaN(grade)) {
            totalWeightedGrades += grade * coefficient;
            totalCoefficients += coefficient;
        }
    }

    const average = totalWeightedGrades / totalCoefficients;
    document.getElementById('result').innerText = `معدل السداسي: ${average.toFixed(2)}`;
}

function saveResult() {
    const studentName = document.getElementById('studentName').value;
    const average = document.getElementById('result').innerText.split(': ')[1];
    
    if (studentName && average) {
        const result = {
            name: studentName,
            average: average
        };
        savedResults.push(result);
        updateSavedResults();
        document.getElementById('studentName').value = '';
    } else {
        alert('يرجى إدخال الاسم وحساب المعدل قبل الحفظ.');
    }
}

function updateSavedResults() {
    const savedResultsList = document.getElementById('savedResults');
    savedResultsList.innerHTML = '';
    savedResults.forEach((result, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${result.name}: ${result.average}`;
        savedResultsList.appendChild(li);
    });
}

function generatePDF() {
    const doc = new jsPDF();
    doc.text("كشف نقاط معدل الجامعة", 70, 10);
    
    let yPos = 20;
    savedResults.forEach((result, index) => {
        doc.text(`${index + 1}. ${result.name}: ${result.average}`, 10, yPos);
        yPos += 10;
    });

    doc.save("كشف_نقاط.pdf");
}