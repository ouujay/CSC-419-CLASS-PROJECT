import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const faqData = [
  {
    question: "How is Osisi different from other family tree apps?",
    answer:
      "Unlike generic genealogy tools, Osisi focuses on African families, supporting local naming traditions, extended family structures, and unique cultural heritage.",
  },
  {
    question: "Who can see my family tree?",
    answer:
      "You control privacy. You can keep it private, share with specific family members, or make parts of it public.",
  },
  {
    question: "Do I need to know my full family history before using Osisi?",
    answer:
      "Not at all. You can start with what you know today and add more family members and stories over time. Osisi is designed for gradual discovery.",
  },
  {
    question: "Can I connect my family tree with relatives in other families?",
    answer:
      "Yes. Osisi allows you to search for and link with family members across different trees, creating a wider network of connections.",
  },
  {
    question: "Can I add photos, videos, and stories?",
    answer:
      "Not yet. We are working on the ability to attach photos, videos, and written memories to family members so your family's history feels alive and personal.",
  },
  {
    question: "Is Osisi free?",
    answer:
      "Osisi offers a free plan to get started, with paid plans for advanced features, Higher limits and support.",
  },
  {
    question: "Can I use Osisi on my phone?",
    answer:
      "We don't have an app yet. However, Osisi the osisi website works on mobile, tablet, and desktop, so you can add and view family information anywhere.",
  },
  {
    question: "What if I'm not tech-savvy?",
    answer:
      "Osisi is designed to be simple and intuitive — if you can use messaging apps, you can use Osisi.",
  },
];
export default function FAQ() {
  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-cardo text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg max-w-2xl mx-auto  ">
            Find answers to common questions about Osisi
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqData.map((item, index) => (
            <Accordion type="single" collapsible className="w-full" key={index}>
              <AccordionItem value="item-1" className="border-primary/20">
                <AccordionTrigger className="text-lg md:text-xl font-light font-cardo  ">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className=" md:text-lg font-sora">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
