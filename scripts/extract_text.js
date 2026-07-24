import https from 'https';

https.get("https://themorgannyc.com/private/js/fullsite.js", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    console.log("Bundle Length:", data.length);

    // Extract all quoted text strings longer than 10 characters
    const stringMatches = data.match(/"([^"\\]|\\.)*"/g) || [];
    const cleanStrings = stringMatches
      .map(s => s.slice(1, -1))
      .filter(s => s.length > 8 && !s.startsWith('http') && !s.includes('class') && !s.includes('style'));
    
    console.log("Found clean text strings:", cleanStrings.length);
    // Print unique strings that look like titles or headings
    const headings = cleanStrings.filter(s => 
      s.includes('BEAUTY') || 
      s.includes('STILLNESS') || 
      s.includes('SKYLINE') || 
      s.includes('LIFESTYLE') || 
      s.includes('INTERIORS') || 
      s.includes('MANHATTAN') || 
      s.includes('MORGAN') ||
      s.includes('PARK') ||
      s.includes('MADISON') ||
      s.includes('CALM')
    );
    console.log("Headings & Titles:", [...new Set(headings)]);
  });
});
