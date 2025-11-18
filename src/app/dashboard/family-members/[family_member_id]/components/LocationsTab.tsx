import React from 'react'
import { Home, MapPin } from 'lucide-react'
import { Doc } from '@/convex/_generated/dataModel'


type LocationsTabProps = {
  familyMember?: Doc<'family_members'> | null   
}
export default function LocationsTab({ familyMember }: LocationsTabProps) {
  return (
     <>
            <div className="bg-card rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </h3>
              {familyMember?.locations &&
              (familyMember.locations.current_address ||
                familyMember.locations.place_of_birth ||
                familyMember.locations.place_of_death) ? (
                <div className="space-y-4">
                  {familyMember.locations.current_address && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Home className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Current Address
                        </p>
                        <p className="text-base">
                          {familyMember.locations.current_address.formatted_address || ""}
                        </p>
                      </div>
                    </div>
                  )}
                  {familyMember.locations.place_of_birth && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="p-2 rounded-full bg-green-100">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Place of Birth
                        </p>
                        <p className="text-base">
                          {familyMember.locations.place_of_birth.formatted_address || ""} 
                        </p>
                      </div>
                    </div>
                  )}
                  {familyMember.locations.place_of_death && (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                      <div className="p-2 rounded-full bg-red-100">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Place of Death
                        </p>
                        <p className="text-base">
                          {familyMember.locations.place_of_death.formatted_address || ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No location information recorded
                  </p>
                </div>
              )}
            </div>
          </>
  )
}
