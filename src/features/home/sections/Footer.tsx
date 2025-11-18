// Footer.jsx
import React from "react";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" py-12 border-t border-primary/20 md:px-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="size-6 text-primary" />
              <h3 className="text-xl font-semibold">Osisi</h3>
            </div>
            <p className="opacity-75 mb-6 max-w-md">
              Remember your roots.
            </p>
            {/* <div className="flex space-x-4">
              <a href="#" className="opacity-75 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-75 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-75 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-75 hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div> */}
          </div>

          <div>
            <h4 className=" mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="opacity-75 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="opacity-75 hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className=" mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="privacy-policy"
                  className="opacity-75 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="terms-and-conditions"
                  className="opacity-75 hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link href="#" className="opacity-75 hover:text-primary transition-colors">Contact Us</Link>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Osisi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
