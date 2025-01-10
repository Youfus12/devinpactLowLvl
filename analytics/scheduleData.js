console.log("Loading scheduleData.js...");

// IDs for day/session references
const id = {
  day: {
    d1: "SATURDAY",
    d2: "SUNDAY",
    d3: "MONDAY",
    d4: "TUESDAY",
    d5: "WEDNESDAY",
    d6: "THURSDAY",
    d7: "FRIDAY",
  },
  sess: {
    lnch: "LUNCH_BREAK",
    nose: "NO_SESSION"
  },
};

// Example modules
const allModules = [
  { id: "CS101",  name: "Intro to CS" },
  { id: "CS102",  name: "Data Structures" },
  { id: "CS201",  name: "OOP" },
  { id: "CS202",  name: "Databases" },
  { id: "AI101",  name: "AI Fundamentals" },
  { id: "MATH201",name: "Advanced Math" },
  { id: "PHYS201",name: "Physics II" }
];

// Professors with modules they can teach
const professors = [
  {
    name: "Dr. Jones",
    canTeach: ["CS101", "CS102", "CS201", "CS202"]
  },
  {
    name: "Dr. Brown",
    canTeach: ["AI101"]
  },
  {
    name: "Dr. Smith",
    canTeach: ["MATH201", "PHYS201"]
  }
];

// Our schedule skeleton (7 days × 5 timeslots)
const schd = {
  keys: {
    days: [1,2,3,4,5,6,7],   // => d1..d7
    times: 5,               // 5 timeslots
    start: 8.5,             // 8:30
    end: 15.5,              // 15:30
    sdur: 1.5,              // 1h30 per slot
    lnch: 1,                // 1h lunch
    lidx: 2                 // lunch at the 3rd slot
  },
  // Each day => 5 slots
  days: [
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "LUNCH_BREAK", "", ""],
    ["", "", "NO_SESSION",  "", ""]
  ]
};

// We store assigned modules and their random grades here:
let assignedModules = {}; 

console.log("Finished loading scheduleData.js");
