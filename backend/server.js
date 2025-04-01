const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/getNextSectionData',(req,res)=>{

    

    let section= {
        forms: [
          {
            id: 1,
            title: 'Personal Information',
            fields: [
              { 
                type: 'text', 
                label: 'First Name', 
                name:'firstName' 
              },
              { 
                type: 'text', 
                label: 'Middle Name', 
                name: 'middleName' 
              },
              { 
                type: 'text', 
                label: 'Last Name', 
                name: 'lastName' 
              }
            ]
          },
          {
            id: 2,
            title: 'Contact Information',
            fields: [
              { type: 'text', label: 'Phone Country', name: 'phoneCountry' }, { type: 'text', label: 'Number', name: 'number' }
            ]
          },
          {
            id: 3,
            title: 'Employment Info',
            fields: [
              { type: 'text', label: 'Employment Status', name: 'status' }
            ]
          }
        ]
    };

    setTimeout(() => {
        return res.json({
            section
        });
    }, 2000);

    
})

app.get('/api/getSectionData', (req, res) => {
    const { sectionId } = req.query;
    if (!sectionId) {
        return res.json({ sections }); // Initial section fetch
    }

    const nextSection = sections.find(section => section.id === sectionId);
    if (nextSection) {
        const nextIndex = sections.indexOf(nextSection) + 1;
        if (nextIndex < sections.length) {
            return res.json({ sections: [sections[nextIndex]] });
        }
    }

    return res.status(404).json({ message: 'No more sections.' });
});

app.post('/api/saveSection', (req, res) => {
    const formData = req.body;
    console.log(`Saving data for section :`, formData);

    // Simulate saving data...
    setTimeout(() => {
        res.json({ success: true });
      }, 2000);
});

app.get('*', (req, res) => {
    res.send('React app will be served by the React development server');
  });

app.listen(5000, () => console.log('Server running on port 5000'));
