"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {useRegisterUserMutation} from '../authApiSlice.js'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Link, redirect } from "react-router-dom";

const formSchema = z.object({
  uname: z.string(),
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
});

export function RegisterForm() {

  const [registerUser,{data,isLoading,isSuccess}] = useRegisterUserMutation()

  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values) {
    console.log(values);
    const reg = await registerUser(values).unwrap
    if(reg){
      console.log(reg)
      redirect('/login')
    }else{
      console.log('error')
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      
    <Card className="card w-96">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <FormField
              control={form.control}
              name="uname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Name" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-gray-500 text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            SignIn
          </Link>
        </p>
      </CardFooter>
    </Card>
    </div>

  );
}
