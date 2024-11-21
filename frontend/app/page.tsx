"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MultiSelect } from '@/components/multi-select';

interface ApiResponse {
  is_success: boolean;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
  error?: string;
}

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateJson = (input: string) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Invalid JSON format');
      }
      return parsed;
    } catch (e) {
      setError('Invalid JSON input');
      return null;
    }
  };

  const handleSubmit = async () => {
    const validatedInput = validateJson(jsonInput);
    if (!validatedInput) return;

    try {
      const apiResponse = await fetch('http://localhost:3001/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonInput
      });

      const data = await apiResponse.json();
      console.log('API Response:', data);
      setResponse(data);
      setError(null);
    } catch (e) {
      console.error('Error submitting request:', e);
      setError('Failed to submit request');
    }
  };

  const renderSelectedData = () => {
    if (!response) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
            selectedOptions.map(option => (
              <div key={option}>
                <h3 className="font-bold">{option}:</h3>
                <pre>{JSON.stringify(response[option.toLowerCase() as keyof ApiResponse], null, 2)}</pre>
              </div>
            ))
          ) : (
            <p>No options selected.</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ROLL_NUMBER Challenge</h1>
      
      <Input 
        placeholder="Enter JSON input" 
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="mb-4"
      />
      
      <Button onClick={handleSubmit} className="mb-4">Submit</Button>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {response && (
        <MultiSelect 
          options={['Alphabets', 'Numbers', 'Highest Lowercase Alphabet']}
          selected={selectedOptions}
          onSelectedChange={setSelectedOptions}
          className="mb-4"
        />
      )}

      {renderSelectedData()}
    </div>
  );
}