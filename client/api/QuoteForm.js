fetch('/api/submit-quote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    quote: ['Quote 1', 'Quote 2', 'Quote 3'],
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
