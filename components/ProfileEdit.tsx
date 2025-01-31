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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from '@/lib/supabase'

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date"),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileEdit() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      dob: "",
      mobile: "",
    },
  })

  useEffect(() => {
    console.log("Dialog state:", isOpen)
    if (isOpen) {
      const fetchProfile = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          console.log("Current user:", user)
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .single()

            console.log("Fetched profile:", profile)
            if (profile) {
              form.reset({
                name: profile.name || "",
                dob: profile.dob || "",
                mobile: profile.mobile || "",
              })
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
      fetchProfile()
    }
  }, [isOpen, supabase, form])

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: data.name,
          dob: data.dob,
          mobile: data.mobile,
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log("Dialog triggered:", open)
      setIsOpen(open)
    }}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault()
            console.log("Button clicked")
            setIsOpen(true)
          }}
        >
          Edit Profile
        </button>
      </DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  )
} 