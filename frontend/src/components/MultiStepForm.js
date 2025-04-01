import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box, CircularProgress } from '@mui/material';

// MultiStepForm Component
const MultiStepForm = () => {
  const [sectionData, setSectionData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Simulate an API call to fetch form data (you would replace this with an actual API call)
  const fetchFormSection = async () => {
    const response = await fetch(`/api/getNextSectionData`);
    const data = await response.json();
    return data;
  };

  // Fetch form data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFormSection();
      setSectionData(data.section);
      setLoading(false); // Data is now loaded
    };

    fetchData();
  }, []);

  // Handle input change for the dynamic forms
  const handleInputChange = (e, fieldName) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  // Handle the Next and Previous buttons
  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, sectionData.forms.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Handle form submission (save data)
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/saveSection", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Sending form data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      const result = await response.json();
      console.log("Form data submitted successfully:", result);
      alert("Form Submitted Successfully!");

      setLoading(true); // Data is now loaded
      // Re-fetch data for next section
      const newSectionData = await fetchFormSection();
      setSectionData(newSectionData.section);
      setFormData({});  // Reset form data
      setCurrentStep(0);  // Reset to the first step
      setLoading(false); // Data is now loaded
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  // If the section data hasn't been fetched yet, return a loading message
  if (loading) {
    return <CircularProgress />;
  }

  // Get the current form based on the current step
  const currentForm = sectionData.forms[currentStep];

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {currentForm.title}
      </Typography>

      <form>
        {/* Render form fields dynamically */}
        {currentForm.fields.map((field, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label={field.label}
              variant="outlined"
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(e, field.name)}
            />
          </Box>
        ))}
      </form>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        {currentStep > 0 && (
          <Button variant="contained" color="secondary" onClick={prevStep}>
            Previous
          </Button>
        )}
        {currentStep < sectionData.forms.length - 1 ? (
          <Button variant="contained" color="primary" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default MultiStepForm;