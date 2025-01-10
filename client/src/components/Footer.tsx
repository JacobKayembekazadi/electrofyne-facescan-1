import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">About Electrofyne</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-muted-foreground hover:text-primary">About Us</a></Link></li>
              <li><Link href="/contact"><a className="text-muted-foreground hover:text-primary">Contact</a></Link></li>
              <li><Link href="/careers"><a className="text-muted-foreground hover:text-primary">Careers</a></Link></li>
              <li><Link href="/press"><a className="text-muted-foreground hover:text-primary">Press</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog"><a className="text-muted-foreground hover:text-primary">Blog</a></Link></li>
              <li><Link href="/tutorials"><a className="text-muted-foreground hover:text-primary">Tutorials</a></Link></li>
              <li><Link href="/faq"><a className="text-muted-foreground hover:text-primary">FAQs</a></Link></li>
              <li><Link href="/support"><a className="text-muted-foreground hover:text-primary">Support</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy"><a className="text-muted-foreground hover:text-primary">Privacy Policy</a></Link></li>
              <li><Link href="/terms"><a className="text-muted-foreground hover:text-primary">Terms of Service</a></Link></li>
              <li><Link href="/cookie-policy"><a className="text-muted-foreground hover:text-primary">Cookie Policy</a></Link></li>
              <li><Link href="/disclaimer"><a className="text-muted-foreground hover:text-primary">Disclaimer</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div>
              <h4 className="font-medium mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest updates on skincare and AI technology
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {year} Electrofyne. All rights reserved.</p>
            <p className="mt-2">
              Empowering your skincare journey with AI technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
