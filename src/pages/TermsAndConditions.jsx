import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last Updated: 15/02/2025
        </Typography>

        <Typography paragraph>
          These Terms and Conditions ("Terms") govern your access to and use of the services 
          provided by THAI Services Pvt. Ltd. ("we," "our," or "us"), including investment 
          recommendations and credit bureau report retrieval. By using our services, you agree to 
          comply with these Terms. If you do not agree, please do not use our services.
        </Typography>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          1. Eligibility
        </Typography>
        <ul>
          <li>You must be at least 18 years old and a resident of India to use our services.</li>
          <li>You must provide accurate and complete information for account registration and 
              investment profiling.</li>
        </ul>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          2. Services Provided
        </Typography>
        <ul>
          <li>We provide investment recommendations based on your risk profile and financial data.</li>
          <li>With your explicit consent, we retrieve your credit bureau report from authorized bureaus.</li>
          <li>Our platform may offer access to third-party financial products, subject to their 
              respective terms and conditions.</li>
        </ul>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          3. User Obligations
        </Typography>
        <ul>
          <li>You agree to provide true and accurate information for financial assessment and recommendations.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must comply with all applicable financial regulations and laws.</li>
        </ul>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          4. Consent and Data Usage
        </Typography>
        <ul>
          <li>By using our services, you consent to the collection, processing, and sharing of your 
              personal and financial data as outlined in our Privacy Policy.</li>
          <li>You may withdraw consent for credit bureau retrieval at any time by contacting us.</li>
        </ul>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          5. Investment and Financial Risks
        </Typography>
        <ul>
          <li>We do not guarantee returns on any investment recommendations.</li>
          <li>Market risks apply, and you acknowledge that investment decisions are your sole responsibility.</li>
          <li>We do not provide personalized tax or legal advice; consult a professional before 
              making investment decisions.</li>
        </ul>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          6. Fees and Payments
        </Typography>
        <ul>
          <li>Certain services may involve fees, which will be communicated transparently.</li>
          <li>Payments for premium services are non-refundable unless stated otherwise.</li>
        </ul>
      </Box>
    </Container>
  );
};

export default TermsAndConditions; 