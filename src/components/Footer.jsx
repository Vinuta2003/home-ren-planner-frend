import logo from "../assets/imgs/logo.png";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f0f4f8] text-[#002169] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand & Socials */}
          <div className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-3 mb-4 cursor-pointer">
              <img src={logo} alt="Renobase logo" className="h-10 w-10 object-cover rounded-md" />
              <span className="text-2xl font-bold">RENOBASE</span>
            </div>
            <p className="text-sm text-gray-700 mb-4 max-w-xs">
              Your one-stop platform for hassle-free renovation and interior design.
            </p>
            <div className="flex gap-3 mt-4">
              <Facebook className="text-white bg-[#005eb8] p-2 rounded-full w-9 h-9 cursor-pointer hover:brightness-110" />
              <Twitter className="text-white bg-[#005eb8] p-2 rounded-full w-9 h-9 cursor-pointer hover:brightness-110" />
              <Instagram className="text-white bg-[#005eb8] p-2 rounded-full w-9 h-9 cursor-pointer hover:brightness-110" />
              <Youtube className="text-white bg-[#005eb8] p-2 rounded-full w-9 h-9 cursor-pointer hover:brightness-110" />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2]">
            <div>
              <h5 className="font-semibold mb-2">Company</h5>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:underline">Press</a></li>
                <li><a href="#" className="hover:underline">How it works</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Policies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Explore</h5>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                <li><a href="#" className="hover:underline">Refer a friend</a></li>
                <li><a href="#" className="hover:underline">About us</a></li>
                <li><a href="#" className="hover:underline">Contact us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Support</h5>
              <ul className="space-y-1 text-sm">
                <li><a href="#" className="hover:underline">FAQ's</a></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Get in touch</h5>
              <div className="space-y-1 text-sm">
                <div>Call us</div>
                <a href="tel:+919148484666" className="text-[#005eb8] hover:underline">
                  +91 9148 484 666
                </a>
                <div className="mt-3">Email us</div>
                <a href="mailto:care@renobase.com" className="text-[#005eb8] hover:underline">
                  care@renobase.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div>© 2025 Renobase.com. All rights reserved.</div>
          <div className="mt-2 md:mt-0">
            Designed with 💙 by the RenoBase Team
          </div>
        </div>
      </div>
    </footer>
  );
}
