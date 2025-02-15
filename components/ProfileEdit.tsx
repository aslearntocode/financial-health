"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from '@/lib/supabase'
import { auth } from '@/lib/firebase'

const profileSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
  income_range: z.enum([
    "0-5L", "5L-10L", "10L-15L", "15L-25L", "25L+"
  ], {
    required_error: "Please select an income range",
  }),
  employment_category: z.enum([
    "Salaried", "Self-Employed", "Business Owner", "Retired", "Student"
  ], {
    required_error: "Please select an employment category",
  }),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileEdit() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      mobile: "",
      income_range: undefined,
      employment_category: undefined,
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('mobile, income_range, employment_category')
          .eq('id', currentUser.uid)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          console.log('Fetched profile:', profile);
          form.reset({
            mobile: profile.mobile || "",
            income_range: profile.income_range as "0-5L" | "5L-10L" | "10L-15L" | "15L-25L" | "25L+" || undefined,
            employment_category: profile.employment_category as "Salaried" | "Self-Employed" | "Business Owner" | "Retired" | "Student" || undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.uid,
          mobile: data.mobile,
          income_range: data.income_range,
          employment_category: data.employment_category,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="income_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Range</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0-5L">0-5 Lakhs</SelectItem>
                      <SelectItem value="5L-10L">5-10 Lakhs</SelectItem>
                      <SelectItem value="10L-15L">10-15 Lakhs</SelectItem>
                      <SelectItem value="15L-25L">15-25 Lakhs</SelectItem>
                      <SelectItem value="25L+">Above 25 Lakhs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="employment_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Salaried">Salaried</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Business Owner">Business Owner</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 