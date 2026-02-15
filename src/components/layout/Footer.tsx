"use client";

import {
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  const footerSections = [
    {
      title: "Shop",
      links: [
        { href: "/", label: "All Products" },
        { href: "/", label: "New Arrivals" },
        { href: "/", label: "Sale" },
        { href: "/", label: "Featured" },
      ],
    },
    {
      title: "Customer Care",
      links: [
        { href: "/", label: "Contact Us" },
        { href: "/", label: "Help Center" },
        { href: "/", label: "Shipping Info" },
        { href: "/", label: "Returns & Exchanges" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/", label: "About Us" },
        { href: "/", label: "Careers" },
        { href: "/", label: "Blog" },
        { href: "/", label: "Press" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/", label: "Privacy Policy" },
        { href: "/", label: "Terms & Conditions" },
        { href: "/", label: "Cookie Policy" },
        { href: "/", label: "Accessibility" },
      ],
    },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Github, label: "GitHub" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            <div className="lg:col-span-2">
              <Link
                className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors font-bold"
                href="/"
                aria-label="YellowStore Home"
              >
                YELLOW<span className="text-primary">STORE</span>
              </Link>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Discover unique products that inspire your lifestyle. Quality
                craftsmanship meets modern design.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>123 Fashion Street, Style City, SC 12345</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>+62 (812) 3456-7890</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>hello@yellowstore.com</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href={href} aria-label={label}>
                      <Icon className="h-4 w-4" />
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            {footerSections.map((section, index) => (
              <div
                key={section.title}
                className={`${index >= 2 ? "lg:col-span-1" : ""}`}
              >
                <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2026 YellowStore.</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
