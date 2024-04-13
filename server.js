const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static('views'));

// Function to read and parse the CSV file
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Endpoint to serve the parsed questions
app.get('/api/questions', (req, res) => {
  const results = [];
  fs.createReadStream('db/FullyQuestions.csv') // Ensure this is the correct path to your CSV file
      .pipe(csv())
      .on('data', (data) => {
          // Transform the CSV row into the format expected by the frontend
          const question = {
              question: data.question,
              answers: [
                { text: data.choice_1, correct: '1' === data.correct_answer },
                { text: data.choice_2, correct: '2' === data.correct_answer },
                { text: data.choice_3, correct: '3' === data.correct_answer },
                { text: data.choice_4, correct: '4' === data.correct_answer },
              ]
          };
          results.push(question);
      })
      .on('end', () => {
          res.json(results);
      });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
