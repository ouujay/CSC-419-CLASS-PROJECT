"use client";
import NumberFlow, { Value } from "@number-flow/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUp } from "@/features/account/components/Socials";
const plans = [
  {
    id: "free",
    name: "Free Plan",
    price: {
      monthly: "₦0.00",
      yearly: "₦0.00",
    },
    description: "The perfect starting place for your family tree.",
    features: [
      "2 Family Trees",
      "100 Members per Family Tree",
      "5 Collaborators per Family Tree",
      "Community Support",
      "Family Tree Certificate",
    ],
    cta: "Get started for free",
    popular: true,
  },
  {
    id: "family",
    name: "Family Plan",
    price: {
      monthly: "₦10,000",
      yearly: "₦8,000",
    },
    description: "Everything you need to build and scale your family tree.",
    features: [
      "5 Family Trees",
      "1000 Members per Family Tree",
      "10 Collaborators per Family Tree",
      "Priority Support",
      "10% off our Physical Products",
    ],
    cta: "Notify Me",
  },
  {
    id: "clan",
    name: "Clan Plan",
    price: {
      monthly: "₦50,000",
      yearly: "₦40,000",
    },
    description: "Manage a group of families with ease",
    features: [
      "Unlimited Family Trees",
      "Unlimited Members per Family Tree",
      "Unlimited per Family Tree",
      "Advanced Member Management",
      "Verified Family Members",
      "Activity Logs",
      "25% off our Physical Products",
    ],
    cta: "Notify Me",
  },
];
export const Pricing = () => {
  const [frequency, setFrequency] = useState<"monthly" | "yearly">("monthly");
  // const lol = use
  return (
    <div className="not-prose flex flex-col gap-16 px-8 py-24 text-center @container border-y">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter! text-primary">
          Choose the Right Plan for Your Family.
        </h1>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground">
          {
            " From small households to large clans, find the perfect way to connect, preserve, and grow your family's legacy."
          }
        </p>
        <Tabs
          defaultValue={frequency}
          onValueChange={(value) => {
            setFrequency(value as "monthly" | "yearly");
          }}
        >
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary">20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-8 grid w-full max-w-4xl gap-4 @2xl:grid-cols-3">
          {plans.map((plan) => (
            <Card
              className={cn(
                "relative w-full text-left flex flex-col justify-between",
                plan.popular && "ring-2 ring-primary"
              )}
              key={plan.id}
            >
              {plan.popular && (
                <Badge className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full">
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="font-medium text-xl grid gap-2">
                  {plan.name}
                  {typeof plan.price[frequency as keyof typeof plan.price] === "number" ? (
                    <NumberFlow
                      className="font-medium text-foreground"
                      value={plan.price[frequency] as Value}
                    />
                  ) : (
                    <span className="font-medium text-foreground">
                      {plan.price[frequency as keyof typeof plan.price]}.
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  <p>{plan.description}</p>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {plan.features.map((feature, index) => (
                  <div
                    className="flex items-center gap-2 text-muted-foreground text-xs font-sora"
                    key={index}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {feature}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <SignUp
                  className="w-full"
                  size="lg"
                  returnTo={
                    typeof window !== "undefined" ? window.location.origin + "/payments" : "/payments"
                  }
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </SignUp>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
