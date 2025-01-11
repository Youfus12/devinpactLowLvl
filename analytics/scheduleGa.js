/*******************************************************
 * Genetic Algorithm for Scheduling
 *******************************************************/

/**
 * Each chromosome is a 35-element array (7 days × 5 slots).
 * Each element = { moduleId: "CS101", professor: "Dr. X" }
 */

/*******************************************************
 * generateRandomChromosome()
 *******************************************************/
function generateRandomChromosome() {
    let chromosome = [];
    for (let day = 0; day < 7; day++) {
      for (let slot = 0; slot < 5; slot++) {
        const val = schd.days[day][slot];
        if (val === id.sess.lnch) {
          chromosome.push({ moduleId: id.sess.lnch, professor: null });
          continue;
        }
        if (val === id.sess.nose) {
          chromosome.push({ moduleId: id.sess.nose, professor: null });
          continue;
        }
        // Otherwise random
        const mod = allModules[Math.floor(Math.random() * allModules.length)];
        const profs = professors.filter(p => p.canTeach.includes(mod.id));
        let chosenProf = "(No Prof)";
        if (profs.length > 0) {
          chosenProf = profs[Math.floor(Math.random() * profs.length)].name;
        }
        chromosome.push({ moduleId: mod.id, professor: chosenProf });
      }
    }
    return chromosome;
  }
  
  /*******************************************************
   * computeFitness(chromosome)
   *  - Penalize invalid professor–module combos
   *  - Penalize double booking of same professor in same day
   *******************************************************/
  function computeFitness(chromosome) {
    let penalty = 0;
  
    // Check professor validity
    for (let i = 0; i < chromosome.length; i++) {
      const slot = chromosome[i];
      if (slot.moduleId !== id.sess.lnch && slot.moduleId !== id.sess.nose) {
        const validProf = professors.some(
          p => p.name === slot.professor && p.canTeach.includes(slot.moduleId)
        );
        if (!validProf && slot.professor !== "(No Prof)") {
          penalty += 10;
        }
      }
    }
  
    // Double booking check
    for (let day = 0; day < 7; day++) {
      let seenProf = new Set();
      for (let slot = 0; slot < 5; slot++) {
        const idx = day * 5 + slot;
        const slotData = chromosome[idx];
        if (
          slotData.moduleId !== id.sess.lnch &&
          slotData.moduleId !== id.sess.nose
        ) {
          if (seenProf.has(slotData.professor) && slotData.professor !== "(No Prof)") {
            penalty += 5;
          }
          seenProf.add(slotData.professor);
        }
      }
    }
  
    return 1 / (1 + penalty);
  }
  
  /*******************************************************
   * crossover(parentA, parentB)
   *******************************************************/
  function crossover(parentA, parentB) {
    const crossPoint = Math.floor(Math.random() * parentA.length);
    const child1 = parentA.slice(0, crossPoint).concat(parentB.slice(crossPoint));
    const child2 = parentB.slice(0, crossPoint).concat(parentA.slice(crossPoint));
    return [child1, child2];
  }
  
  /*******************************************************
   * mutate(chromosome)
   *******************************************************/
  function mutate(chromosome) {
    const mutationRate = 0.02; // 2%
    for (let i = 0; i < chromosome.length; i++) {
      if (Math.random() < mutationRate) {
        if (
          chromosome[i].moduleId === id.sess.lnch ||
          chromosome[i].moduleId === id.sess.nose
        ) {
          continue; 
        }
        const mod = allModules[Math.floor(Math.random() * allModules.length)];
        const profs = professors.filter(p => p.canTeach.includes(mod.id));
        let chosenProf = "(No Prof)";
        if (profs.length > 0) {
          chosenProf = profs[Math.floor(Math.random() * profs.length)].name;
        }
        chromosome[i] = { moduleId: mod.id, professor: chosenProf };
      }
    }
  }
  
  /*******************************************************
   * runGeneticAlgorithmSchedule(popSize, maxGen)
   *******************************************************/
  async function runGeneticAlgorithmSchedule(popSize = 20, maxGen = 50) {
    let population = [];
    for (let i = 0; i < popSize; i++) {
      population.push(generateRandomChromosome());
    }
  
    let bestChromosome = null;
    let bestFitness = -Infinity;
  
    for (let gen = 0; gen < maxGen; gen++) {
      const fitnessScores = population.map(ch => computeFitness(ch));
  
      // Find best in current pop
      for (let i = 0; i < popSize; i++) {
        if (fitnessScores[i] > bestFitness) {
          bestFitness = fitnessScores[i];
          bestChromosome = population[i];
        }
      }
  
      // Early exit if fitness is high enough
      if (bestFitness >= 0.99) {
        break;
      }
  
      let newPopulation = [];
      while (newPopulation.length < popSize) {
        const parentA = selectOne(population, fitnessScores);
        const parentB = selectOne(population, fitnessScores);
        const [child1, child2] = crossover(parentA, parentB);
        mutate(child1);
        mutate(child2);
        newPopulation.push(child1, child2);
      }
      population = newPopulation;
    }
  
    return bestChromosome;
  }
  
  /*******************************************************
   * selectOne(population, fitnessScores)
   *  - Roulette wheel selection
   *******************************************************/
  function selectOne(population, fitnessScores) {
    const sum = fitnessScores.reduce((a, b) => a + b, 0);
    const r = Math.random() * sum;
    let running = 0;
    for (let i = 0; i < population.length; i++) {
      running += fitnessScores[i];
      if (running >= r) return population[i];
    }
    return population[population.length - 1];
  }
  
  /*******************************************************
   * chromosomeToSchedule(chromosome, schedule)
   *******************************************************/
  function chromosomeToSchedule(chromosome, schedule) {
    // Reset schedule to initial
    schedule.days = [
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "LUNCH_BREAK", "", ""],
      ["", "", "NO_SESSION",  "", ""]
    ];
    assignedModules = {};
  
    let idx = 0;
    for (let day = 0; day < 7; day++) {
      for (let slot = 0; slot < 5; slot++) {
        const gene = chromosome[idx++];
        if (gene.moduleId === id.sess.lnch) {
          schedule.days[day][slot] = id.sess.lnch;
        } else if (gene.moduleId === id.sess.nose) {
          schedule.days[day][slot] = id.sess.nose;
        } else {
          schedule.days[day][slot] = gene.moduleId + "<br>" + gene.professor;
          // Track modules
          if (!assignedModules[gene.moduleId]) {
            const modRef = allModules.find(m => m.id === gene.moduleId);
            const modName = modRef ? modRef.name : gene.moduleId;
            assignedModules[gene.moduleId] = {
              name: modName,
              exam: 0,
              test: 0
            };
          }
        }
      }
    }
  }
  