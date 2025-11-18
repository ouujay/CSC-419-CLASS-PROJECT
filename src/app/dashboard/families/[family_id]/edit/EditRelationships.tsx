"use client";

import React from "react";
import Relationship, { MobileRelationshipCard } from "./Relationship";
import AddRelationship from "./AddRelationship";
import { useFamilyData } from "@/contexts/DashboardFamilyContext";

export default function EditRelationships() {
  const { data } = useFamilyData();
  const family = data.details;
  const relationships = data.relationships;

  if (!family) {
    return <div>Family not found</div>;
  }

  return (
    <div className="pt-8">
      <h5 className="mb-2">Family Relationships</h5>

      <div className="p-2 rounded border">
        <>
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="font-sora">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      From
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Relationship
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3">
                      Position
                    </th>
                    <th scope="col" className="px-3 py-3">
                      To
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      Save
                    </th>
                    <th scope="col" className="px-3 py-3 text-center">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {relationships?.map((rel, index) => (
                    <Relationship
                      key={index}
                      index={index}
                      relationship={rel}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet Horizontal Scroll View */}
            <div className="hidden md:block lg:hidden relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="font-sora">
                  <tr>
                    <th scope="col" className="px-2 py-3 text-xs">
                      From
                    </th>
                    <th scope="col" className="px-2 py-3 text-xs">
                      Relationship
                    </th>
                    <th scope="col" className="px-2 py-3 text-xs">
                      Type
                    </th>
                    <th scope="col" className="px-2 py-3 text-xs">
                      To
                    </th>
                    <th scope="col" className="px-2 py-3 text-xs text-center">
                      Save
                    </th>
                    <th scope="col" className="px-2 py-3 text-xs text-center">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {relationships?.map((rel, index) => (
                    <Relationship
                      key={index}
                      index={index}
                      relationship={rel}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {relationships?.map((rel, index) => (
                <MobileRelationshipCard
                  key={index}
                  index={index}
                  relationship={rel}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <AddRelationship />
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
