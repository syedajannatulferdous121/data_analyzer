class JSDataAnalyzer {
  constructor(dataset) {
    this.dataset = dataset;
  }

  calculateMean(column) {
    const values = this.dataset.map(row => row[column]);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    return mean;
  }

  calculateMedian(column) {
    const values = this.dataset.map(row => row[column]);
    values.sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    const median = values.length % 2 === 0 ? (values[mid - 1] + values[mid]) / 2 : values[mid];
    return median;
  }

  calculateMode(column) {
    const values = this.dataset.map(row => row[column]);
    const counts = {};
    let mode = [];
    let maxCount = 0;

    values.forEach(value => {
      counts[value] = counts[value] ? counts[value] + 1 : 1;
      if (counts[value] > maxCount) {
        mode = [value];
        maxCount = counts[value];
      } else if (counts[value] === maxCount) {
        mode.push(value);
      }
    });

    return mode;
  }

  calculateStandardDeviation(column) {
    const values = this.dataset.map(row => row[column]);
    const mean = this.calculateMean(column);
    const squaredDifferences = values.map(value => (value - mean) ** 2);
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
  }

  calculateCorrelation(column1, column2) {
    const values1 = this.dataset.map(row => row[column1]);
    const values2 = this.dataset.map(row => row[column2]);
    const mean1 = this.calculateMean(column1);
    const mean2 = this.calculateMean(column2);
    const deviations1 = values1.map(value => value - mean1);
    const deviations2 = values2.map(value => value - mean2);
    const sumProductDeviations = deviations1.reduce((acc, val, index) => acc + val * deviations2[index], 0);
    const correlation = sumProductDeviations / (values1.length * this.calculateStandardDeviation(column1) * this.calculateStandardDeviation(column2));
    return correlation;
  }

  detectOutliers(column, threshold = 3) {
    const values = this.dataset.map(row => row[column]);
    const mean = this.calculateMean(column);
    const standardDeviation = this.calculateStandardDeviation(column);
    const lowerThreshold = mean - threshold * standardDeviation;
    const upperThreshold = mean + threshold * standardDeviation;
    const outliers = values.filter(value => value < lowerThreshold || value > upperThreshold);
    return outliers;
  }

  handleMissingData() {
    this.dataset.forEach(row => {
      for (const key in row) {
        if (row[key] === null || row[key] === undefined) {
          row[key] = "N/A";
        }
      }
    });
  }

  plotHistogram(column, bins = 10) {
    const values = this.dataset.map(row => row[column]);
    const histogram = {};
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;

    for (let i = 0; i < bins; i++) {
      const start = min + i * binSize;
      const end = min + (i + 1) * binSize;
      const range = `${start.toFixed(2)} - ${end.toFixed(2)}`;
      histogram[range] = 0;
    }

    values.forEach(value => {
      for (const range in histogram) {
        const [start, end] = range.split(" - ");
        if (value >= parseFloat(start) && value < parseFloat(end)) {
          histogram[range]++;
          break;
        }
      }
    });

    console.log("Histogram:");
    for (const range in histogram) {
      const count = histogram[range];
      console.log(`${range}: ${"*".repeat(count)}`);
    }
  }

  // Additional features

  getUniqueValues(column) {
    const values = this.dataset.map(row => row[column]);
    const uniqueValues = Array.from(new Set(values));
    return uniqueValues;
  }

  calculatePercentile(column, percentile) {
    const values = this.dataset.map(row => row[column]);
    values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * values.length);
    const percentileValue = values[index - 1];
    return percentileValue;
  }

  calculateCovariance(column1, column2) {
    const values1 = this.dataset.map(row => row[column1]);
    const values2 = this.dataset.map(row => row[column2]);
    const mean1 = this.calculateMean(column1);
    const mean2 = this.calculateMean(column2);
    const deviations1 = values1.map(value => value - mean1);
    const deviations2 = values2.map(value => value - mean2);
    const sumProductDeviations = deviations1.reduce((acc, val, index) => acc + val * deviations2[index], 0);
    const covariance = sumProductDeviations / values1.length;
    return covariance;
  }
}

// Usage example
const dataset = [
  { name: "John", age: 25, salary: 50000 },
  { name: "Jane", age: 30, salary: 60000 },
  { name: "Bob", age: 35, salary: 70000 },
  { name: "Alice", age: 40, salary: 80000 },
  { name: "Eve", age: 45, salary: 90000 }
];

const dataAnalyzer = new JSDataAnalyzer(dataset);

console.log("Mean Salary:", dataAnalyzer.calculateMean("salary"));
console.log("Median Age:", dataAnalyzer.calculateMedian("age"));
console.log("Mode Name:", dataAnalyzer.calculateMode("name"));
console.log("Standard Deviation Salary:", dataAnalyzer.calculateStandardDeviation("salary"));
console.log("Correlation between Age and Salary:", dataAnalyzer.calculateCorrelation("age", "salary"));
console.log("Outliers in Salary:", dataAnalyzer.detectOutliers("salary"));
console.log("Unique Names:", dataAnalyzer.getUniqueValues("name"));
console.log("75th Percentile of Age:", dataAnalyzer.calculatePercentile("age", 75));
console.log("Covariance between Age and Salary:", dataAnalyzer.calculateCovariance("age", "salary"));

dataAnalyzer.handleMissingData();
dataAnalyzer.plotHistogram("age", 5);
