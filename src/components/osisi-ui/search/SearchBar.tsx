"use client"

import * as React from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  list: { label: string; value: string }[];
  label: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}

export function SearchBar({ list, onChange, label, onSelect }: SearchBarProps) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button className="text-muted-foreground text-sm" variant="outline" onClick={() => setOpen(true)}>
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Search</span>
        <span className="ml-2">⌘K</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." onValueChange={onChange} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {list.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  onSelect(item.value)
                  setOpen(false)
                }}
              >
                {item.label}
                <CommandShortcut>{"lol"}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
