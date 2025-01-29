"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().transform(Number).pipe(
    z.number().min(18, "Must be at least 18 years old").max(100)
  ),
  currentSavings: z.string().transform(Number).pipe(
    z.number().min(0, "Current savings must be positive")
  ),
  monthlySavings: z.string().transform(Number).pipe(
    z.number().min(0, "Monthly savings must be positive")
  ),
  investmentHorizon: z.string().transform(Number).pipe(
    z.number().min(1, "Investment horizon must be at least 1 year").max(50)
  ),
  financialGoal: z.string({
    required_error: "Please select your financial goal",
  }),
})

interface InvestmentFormProps {
  onSubmit: (data: any) => void;
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 0,
      currentSavings: 0,
      monthlySavings: 0,
      investmentHorizon: 0,
      financialGoal: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/portfolio-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          age: Number(values.age),
          current_savings: Number(values.currentSavings),
          monthly_savings: Number(values.monthlySavings),
          investment_horizon_years: Number(values.investmentHorizon),
          financial_goal: values.financialGoal
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log('API Response:', data);
      onSubmit(data);
      
    } catch (error) {
      console.error('Error details:', error);
      setError('Failed to get investment advice. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financialGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your primary financial goal?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your financial goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="retirement">Saving for Retirement</SelectItem>
                  <SelectItem value="emergency">Building Emergency Fund</SelectItem>
                  <SelectItem value="debt">Paying off Debt</SelectItem>
                  <SelectItem value="house">Buying a House</SelectItem>
                  <SelectItem value="education">Education Savings</SelectItem>
                  <SelectItem value="wealth">Wealth Building</SelectItem>
                  <SelectItem value="income">Passive Income</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentSavings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Savings Uptil Now (in INR)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlySavings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Savings Going Forward (in INR)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="500" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="investmentHorizon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Horizon (years)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Calculating...' : 'Calculate'}
        </Button>

        {error && (
          <div className="text-red-500 mt-2 text-sm">
            {error}
          </div>
        )}
      </form>
    </Form>
  )
} 