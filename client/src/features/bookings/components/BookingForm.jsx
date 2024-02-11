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

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useFetchNearbyParkingSpotsQuery } from "../bookingApiSlice";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function BookingForm(){

  const [a,setA] = useState(true);

  const [dataa,setDataa] = useState({
    x:0,y:0,from:0,to:0
  })
  

  const { data:nearby, error, status } = useFetchNearbyParkingSpotsQuery(dataa, {
    skip:a,
  })



  //book now or reserve for later
  const [bookNow, setBookNow] = useState(true);
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async ()=>{
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(duration)
      setDataa({
        x:position.coords.latitude,
        y:position.coords.longitude,
        from:new Date(date),
        to:new Date(date.getTime() + duration*60*1000)
      })
      setA(false);
    })
  }

  async function onSubmit(values) {
    return 0;
  }

  const handleDurationChange = (e) =>{
    console.log(e.target.value)
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="card w-96">
        <CardHeader>
          <CardTitle className="mb-7">
            {bookNow ? "Book Now" : "Reserve for Later"}
          </CardTitle>

          <RadioGroup
            defaultValue="option-one"
            value={bookNow ? "option-one" : "option-two"}
            onValueChange={() => setBookNow(!bookNow)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Book Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Reserve for Later</Label>
            </div>
          </RadioGroup>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!bookNow && (
                <input
                  type="datetime-local"
                  id="birthdaytime"
                  name="birthdaytime"
                  style={{color:"white"}}
                  onChange={e=>setDate(new Date(e.target.value))}
                />
              )}

              <input
                  type="number"
                  name="duration"
                  placeholder="Duration (minutes)"
                  style={{color:"white"}}
                  onChange={e=>setDuration(e.target.value)}
                />
              <Button onClick={submit}>Check Availability</Button>
                
                {nearby && nearby.map(
                  (n,i) => {
                    
                  return(<li><b>Option {i+1}</b> <br/> {n.dist.toFixed(2)}km  Rs.{n.cost}</li>)
                }
                )}

              <br />
            </form>
          </Form>
        </CardContent>
       
      </Card>
    </div>
  );
}
