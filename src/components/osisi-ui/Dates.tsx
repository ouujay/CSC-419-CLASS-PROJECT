import React from "react";
import { Calendar, Minus } from "lucide-react";

interface DateObject {
  year?: number;
  month?: number;
  day?: number;
}

interface DateRangeProps {
  birthDate?: DateObject;
  deathDate?: DateObject;
  isDeceased?: boolean;
  className?: string;
  showIcon?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export default function DateRange({ 
  birthDate, 
  deathDate, 
  isDeceased,
  className = "", 
  showIcon = false,
  variant = "default" 
}: DateRangeProps) {
  
  const formatDateForRange = (dateObj?: DateObject): string | null => {
    if (!dateObj) return null;
    
    // If we have a year, that's the minimum we need for a range
    if (dateObj.year) {
      return dateObj.year.toString();
    }
    
    return null;
  };

  const formatDetailedDate = (dateObj?: DateObject): string | null => {
    if (!dateObj) return null;
    
    if (dateObj.year) {
      if (dateObj.day && dateObj.month) {
        return `${dateObj.day}/${dateObj.month}/${dateObj.year}`;
      } else if (dateObj.month) {
        return `${dateObj.month}/${dateObj.year}`;
      } else {
        return `${dateObj.year}`;
      }
    }
    
    return null;
  };

  const renderRange = () => {
    const birthYear = formatDateForRange(birthDate);
    const deathYear = formatDateForRange(deathDate);

    // No birth date available
    if (!birthYear) {
      return (
        <span className="text-muted-foreground italic">
          Date unknown
        </span>
      );
    }

    // Has birth date but person is deceased with unknown death date
    if (birthYear && !deathYear && isDeceased) {
      return (
        <span className="font-medium">
          {birthYear} - <span className="text-muted-foreground">Unknown</span>
        </span>
      );
    }

    // Has birth date and person is alive (or status unknown)
    if (birthYear && !deathYear) {
      return (
        <span className="font-medium">
          {birthYear} - Present
        </span>
      );
    }

    // Has both birth and death dates
    if (birthYear && deathYear) {
      return (
        <span className="font-medium">
          {birthYear} - {deathYear}
        </span>
      );
    }

    return (
      <span className="text-muted-foreground italic">
        Date unknown
      </span>
    );
  };

  const renderDetailed = () => {
    const formattedBirth = formatDetailedDate(birthDate);
    const formattedDeath = formatDetailedDate(deathDate);

    if (!formattedBirth) {
      return (
        <div className="text-center">
          <span className="text-muted-foreground italic text-sm">
            Birth date unknown
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 text-sm">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Born</div>
          <div className="font-medium">{formattedBirth}</div>
        </div>
        
        {formattedDeath ? (
          <>
            <Minus className="size-3 text-muted-foreground mx-2" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Died</div>
              <div className="font-medium">{formattedDeath}</div>
            </div>
          </>
        ) : isDeceased ? (
          <>
            <Minus className="size-3 text-muted-foreground mx-2" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Died</div>
              <div className="font-medium text-muted-foreground italic">Unknown</div>
            </div>
          </>
        ) : (
          <>
            <Minus className="size-3 text-muted-foreground mx-2" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Present</div>
              <div className="font-medium text-green-600">Living</div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderCompact = () => {
    const birthYear = formatDateForRange(birthDate);
    const deathYear = formatDateForRange(deathDate);

    if (!birthYear) return "-";
    if (birthYear && !deathYear && isDeceased) return `${birthYear} - ?`;
    if (birthYear && !deathYear) return `${birthYear} - Present`;
    if (birthYear && deathYear) return `${birthYear} - ${deathYear}`;
    return "-";
  };

  const baseClasses = "flex items-center gap-2";
  const finalClassName = `${baseClasses} ${className}`;

  if (variant === "compact") {
    return (
      <span className={className}>
        {showIcon && <Calendar className="size-3" />}
        {renderCompact()}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={finalClassName}>
        {showIcon && <Calendar className="size-4 text-muted-foreground" />}
        <div className="flex-1">
          {renderDetailed()}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={finalClassName}>
      {showIcon && <Calendar className="size-4 text-muted-foreground" />}
      {renderRange()}
    </div>
  );
}

// Usage Examples Component
export function DateRangeExamples() {
  const sampleDates = {
    living: {
      birth: { year: 1990, month: 5, day: 15 },
    },
    deceased: {
      birth: { year: 1950, month: 3, day: 22 },
      death: { year: 2020, month: 12, day: 8 },
    },
    deceasedUnknownDate: {
      birth: { year: 1925, month: 8, day: 12 },
    },
    partialDates: {
      birth: { year: 1985 },
      death: { year: 2022, month: 6 },
    },
    unknown: {},
  };

  return (
    <div className="space-y-6 p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold">DateRange Component Examples</h3>
      
      <div className="space-y-4">
        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Living Person (Default)</p>
          <DateRange 
            birthDate={sampleDates.living.birth} 
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Deceased Person (Default)</p>
          <DateRange 
            birthDate={sampleDates.deceased.birth} 
            deathDate={sampleDates.deceased.death}
            isDeceased={true}
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Deceased - Unknown Death Date</p>
          <DateRange 
            birthDate={sampleDates.deceasedUnknownDate.birth} 
            isDeceased={true}
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Compact - Deceased Unknown</p>
          <DateRange 
            birthDate={sampleDates.deceasedUnknownDate.birth} 
            isDeceased={true}
            variant="compact"
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Detailed - Deceased Unknown</p>
          <DateRange 
            birthDate={sampleDates.deceasedUnknownDate.birth} 
            isDeceased={true}
            variant="detailed"
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Compact Variant</p>
          <DateRange 
            birthDate={sampleDates.deceased.birth} 
            deathDate={sampleDates.deceased.death}
            variant="compact"
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Detailed Variant</p>
          <DateRange 
            birthDate={sampleDates.deceased.birth} 
            deathDate={sampleDates.deceased.death}
            variant="detailed"
            showIcon={true}
          />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Unknown Dates</p>
          <DateRange showIcon={true} />
        </div>

        <div className="p-3 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Partial Dates (Detailed)</p>
          <DateRange 
            birthDate={sampleDates.partialDates.birth} 
            deathDate={sampleDates.partialDates.death}
            variant="detailed"
            showIcon={true}
          />
        </div>
      </div>
    </div>
  );
}