"use client";
import FormInput from "@/components/osisi-ui/inputs/input";
import FormTextArea from "@/components/osisi-ui/inputs/Textarea";
import { useMutation } from "convex/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { c_CreateFeedback } from "@/fullstack/PublicConvexFunctions";
import { Button } from "@/components/ui/button";

type FeedbackFormData = {
  title: string;
  message: string;
};

export default function Form() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    title: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = useMutation(c_CreateFeedback);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback({
        title: formData.title.trim(),
        message: formData.message.trim(),
        eventType: "create_feedback",
      });

      toast.success("Feedback submitted successfully!");
      setFormData({ title: "", message: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-6 sm:mb-8 p-4 sm:p-6 rounded border  shadow-sm">
      <h5 className="text-lg sm:text-xl font-medium mb-4">Feedback Form</h5>
      <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter feedback title"
          required
        />

        <FormTextArea
          label="Message"
          name="message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          maxLength={1000}
          placeholder="Enter your feedback message"
          required
        />

        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </section>
  );
}
