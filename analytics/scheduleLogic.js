/*******************************************************
 * fillScheduleRandomly(schedule)
 *******************************************************/
function fillScheduleRandomly(schedule) {
  schedule.days.forEach(daySlots => {
    for (let i = 0; i < daySlots.length; i++) {
      if (daySlots[i] === id.sess.lnch || daySlots[i] === id.sess.nose) {
        continue; // skip lunch / no_session
      }
      const mod = allModules[Math.floor(Math.random() * allModules.length)];
      const profs = professors.filter(p => p.canTeach.includes(mod.id));
      let chosenProf = "(No Prof)";
      if (profs.length > 0) {
        chosenProf = profs[Math.floor(Math.random() * profs.length)].name;
      }
      daySlots[i] = `${mod.id}<br>${chosenProf}`;

      // Track module in assignedModules
      if (!assignedModules[mod.id]) {
        assignedModules[mod.id] = { name: mod.name, exam: 0, test: 0 };
      }
    }
  });
}

/*******************************************************
 * assignRandomGrades(modulesObj)
 *******************************************************/
function assignRandomGrades(modulesObj) {
  for (let modId in modulesObj) {
    modulesObj[modId].exam = Math.floor(Math.random() * 21); // 0..20
    modulesObj[modId].test = Math.floor(Math.random() * 11); // 0..10
  }
}

/*******************************************************
 * displaySchedule(tblId, schedule)
 *******************************************************/
function RmDot(val) {
  const cl = Math.ceil(val);
  return [cl, (cl - val).toFixed(2)];
}

function GetSessTime(keys, i) {
  let h = RmDot(
    keys.start +
    (keys.lidx === i ? i - 1 : i) * keys.sdur +
    (keys.lidx === i ? keys.lnch : keys.lidx < i ? -keys.sdur + keys.lnch : 0)
  );
  h[0] = h[0] < 10 ? "0" + h[0] : h[0];
  h[1] = Math.ceil(h[1] * 60);
  h[1] = h[1] === 0 ? "00" : h[1];
  let res = h.join(":");

  i++;
  h = RmDot(
    keys.start +
    (keys.lidx === i ? i - 1 : i) * keys.sdur +
    (keys.lidx === i ? keys.lnch : keys.lidx < i ? -keys.sdur + keys.lnch : 0)
  );
  h[0] = h[0] < 10 ? "0" + h[0] : h[0];
  h[1] = Math.ceil(h[1] * 60);
  h[1] = h[1] === 0 ? "00" : h[1];
  res += "<br>" + h.join(":");
  return res;
}

function displaySchedule(tblId, schedule) {
  const tbl = document.getElementById(tblId);
  let html = "<tr><th>Days<br>Hours</th>";

  const len = schedule.keys.days.length;
  // Header row => day names
  for (let i = 0; i < len; i++) {
    html += `<th>${id.day["d" + schedule.keys.days[i]]}</th>`;
  }
  html += "</tr>";

  for (let i = 0; i < schedule.keys.times; i++) {
    html += `<tr><td>${GetSessTime(schedule.keys, i)}</td>`;
    for (let j = 0; j < len; j++) {
      const cellVal = schedule.days[j][i] || "";
      if (cellVal.includes("<br>")) {
        const [modulePart, profPart] = cellVal.split("<br>");
        html += `
          <td>
            <span class="moduleCell">${modulePart}</span><br>
            <span class="profCell">${profPart}</span>
          </td>
        `;
      } else {
        html += `<td>${cellVal}</td>`;
      }
    }
    html += "</tr>";
  }
  tbl.innerHTML = html;
}

/*******************************************************
 * displayGradeReport(tblId, modulesObj)
 *******************************************************/
function displayGradeReport(tblId, modulesObj) {
  const tbl = document.getElementById(tblId);
  let html = `
    <tr>
      <th>Module</th>
      <th>Exam (0–20)</th>
      <th>Test (0–10)</th>
      <th>Grade (0–20)</th>
    </tr>
  `;

  let sumGrades = 0, count = 0;

  for (let modId in modulesObj) {
    const m = modulesObj[modId];
    const finalGrade = (m.exam + 2 * m.test) / 2;
    html += `
      <tr>
        <td>${modId} - ${m.name}</td>
        <td>${m.exam}</td>
        <td>${m.test}</td>
        <td>${finalGrade.toFixed(2)}</td>
      </tr>
    `;
    sumGrades += finalGrade;
    count++;
  }

  const overall = count ? (sumGrades / count).toFixed(2) : "0.00";
  html += `
    <tr>
      <td colspan="3"><strong>General Moyenne (0–20)</strong></td>
      <td><strong>${overall}</strong></td>
    </tr>
  `;
  tbl.innerHTML = html;
}

/*******************************************************
 * plotModuleGrades(canvasId, modulesObj)
 *******************************************************/
function plotModuleGrades(canvasId, modulesObj) {
  const labels = [];
  const dataPoints = [];

  for (let modId in modulesObj) {
    const exam = modulesObj[modId].exam;
    const test = modulesObj[modId].test;
    const grade = (exam + 2 * test) / 2; // => 0..20
    labels.push(modId);
    dataPoints.push(grade);
  }

  const backgroundColors = dataPoints.map(g =>
    g < 10 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'
  );

  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Module Grade (0–20)',
        data: dataPoints,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 20
        }
      }
    }
  });
}
