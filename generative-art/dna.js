const DNA_LENGTH = 30;

let IndividualCount = 0;

class Individual {
  static count = 0;
  // An individual with some DNA
  constructor() {
    this.idNumber = Individual.count++;
    this.dna = Array.from({ length: DNA_LENGTH }, () => Math.random());
    this.basePosition = new Vector2D();
  }

  loadFromLandmark(landmark) {
    console.log(
      `Setting individual to landmark "${landmark.name}"`,
      landmark.dna.map((s) => s.toFixed(2))
    );
    this.copyDNA(landmark.dna);
  }

  copyDNA(newDNA) {
    // Copy over the DNA, ignore any unused DNA
    for (var i = 0; i < newDNA.length; i++) {
      Vue.set(this.dna, i, newDNA[i]);
    }
  }

  setDNAToWander(t) {
    for (var i = 0; i < this.dna.length; i++) {
      Vue.set(this.dna, i, 0.5 + 0.5 * noise(t, this.idNumber, i));
    }
  }
}

function evolveNewPopulationFrom({ parent, population, mutationRate = 0.2 }) {
  console.log(`Evolve new generation from`, parent);

  // Clone everyone from the partent
  // console.log(parent.dna)

  // FIRST CLONE, THEN MUTATE
  population.forEach((ind) => {
    ind.copyDNA(parent.dna);

    // Go through each dimension, and modify a bit
    for (var i = 0; i < ind.dna.length; i++) {
      let newValue = ind.dna[i] + (Math.random() - 0.5) * mutationRate;
      newValue = Math.min(1, Math.max(0, newValue));
      // ind.dna[i] = newValue
      Vue.set(ind.dna, i, newValue);
    }
  });
}

function createRandomPopulation(count) {
  let pop = Array.from({ length: count }, () => new Individual());
  return pop;
}
