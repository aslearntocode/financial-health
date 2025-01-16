// Add proper typing instead of any
interface FormData {
  // Add your form data types here
  [key: string]: string | number | boolean;
}

// Use the interface instead of any
const handleSubmit = (data: FormData) => {
  // ... rest of the function
} 