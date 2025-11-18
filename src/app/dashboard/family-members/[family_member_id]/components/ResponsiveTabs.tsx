"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookUser, Calendar, Contact, FileText, Users } from "lucide-react";
import Names from "./Names";
import AboutMe from "./AboutMe";
import Families from "./Families";
import Dates from "./Dates";
import ContactInformation from "./ContactInformation";
import { Doc } from "@/convex/_generated/dataModel";

const tabsDetails = [
  {
    value: "names",
    label: "Names",
    icon: FileText,
    component: Names,
  },
  {
    value: "about-me",
    label: "About Me",
    icon: BookUser,
    component: AboutMe,
  },
  {
    value: "families",
    label: "Families",
    icon: Users,
    component: Families,
  },
  {
    value: "dates",
    label: "Dates",
    icon: Calendar,
    component: Dates,
  },
  {
    value: "contacts",
    label: "Contacts",
    icon: Contact,
    component: ContactInformation,
  },
  // {
  //   value: "favorites",
  //   label: "Favorites",
  //   icon: Contact,
  // component: Names
  // },
  // {
  //   value: "works",
  //   label: "Works",
  //   icon: Contact,
  // component: Names
  // },
  // {
  //   value: "locations",
  //   label: "Locations",
  //   icon: MapPin,
  // component: Names
  // }
];

type ResponsiveTabsProps = {
  familyMember?: Doc<"family_members">;
};

export default function ResponsiveTabs({ familyMember }: ResponsiveTabsProps) {
  const [selectedTab, setSelectedTab] = useState(tabsDetails[0].value);

  return (
    <div className="w-full space-y-4">
      <div className="block sm:hidden">
        <Select value={selectedTab} onValueChange={setSelectedTab}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {tabsDetails.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                <div className="flex items-center gap-2 ">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Tab Buttons */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="hidden sm:block w-full"
      >
        <TabsList className="grid grid-cols-fluid-xs gap-2 mb-4 w-full">
          {tabsDetails.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      <div>
        {tabsDetails.map(
          (tab) =>
            tab.value === selectedTab && (
              <div key={tab.value} className="space-y-6">
                <tab.component familyMember={familyMember} />
              </div>
            )
        )}
      </div>
    </div>
  );
}
