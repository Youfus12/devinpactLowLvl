/*******************************************************
 * 1) The data object (example using your specified structure)
 *******************************************************/
const data = {
    "grades": {
      "year(2024)": {
        "semester": {
          "userid123": {
            "CS101": { "exam": 20, "test": 10 },
            "CS102": { "exam": 18, "test": 15 }
          },
          "userid456": {
            "CS101": { "exam": 16, "test": 12 }
          }
        }
      }
    }
  };
  
  /*******************************************************
   * 2) Helper function to create the grade report table
   *******************************************************/
  function createGradeReport(targetId, data, yearKey, semKey) {
    // 1) Get the relevant portion of the data:
    //    data.grades["year(2024)"]["semester"] => e.g. all userIDs under that semester
    const targetDiv = document.getElementById(targetId);
  
    // Safety check: ensure the data path exists
    if (
      !data.grades ||
      !data.grades[yearKey] ||
      !data.grades[yearKey][semKey]
    ) {
      targetDiv.innerHTML = "<p>No data found for the specified year/semester.</p>";
      return;
    }
  
    const semesterData = data.grades[yearKey][semKey];
  
    // 2) Build a list of all modules encountered, so we can create columns
    //    (We look across all users for all possible module codes)
    let allModules = new Set();
    for (let userId in semesterData) {
      const userModules = semesterData[userId];
      for (let modCode in userModules) {
        allModules.add(modCode);
      }
    }
    // Convert Set to array and sort (optional, but neat)
    allModules = Array.from(allModules).sort();
  
    // 3) Start building the HTML for our table
    let html = "<table>";
    // Header row
    html += "<tr><th>User ID</th>";
    allModules.forEach(mod => {
      html += `<th>${mod}<br>Exam/Test</th>`;
    });
    html += "</tr>";
  
    // 4) For each user, create a row
    for (let userId in semesterData) {
      html += `<tr>`;
      html += `<td><strong>${userId}</strong></td>`;
  
      // For each module in the allModules list
      allModules.forEach(mod => {
        const userHasMod = semesterData[userId][mod];
        if (userHasMod) {
          // Display exam and test scores
          html += `<td>${userHasMod.exam} / ${userHasMod.test}</td>`;
        } else {
          // If user doesn't have this module, leave blank or put '-'
          html += `<td>-</td>`;
        }
      });
  
      html += `</tr>`;
    }
  
    html += "</table>";
  
    // 5) Place the resulting table in the target div
    targetDiv.innerHTML = html;
  }
  