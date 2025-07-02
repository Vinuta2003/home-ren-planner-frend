import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import logo from '../assets/imgs/logo.png';
import pinkSectionImg from '../assets/imgs/pink-section-img.png';
import homepageVideo from '/homepage_video.mp4';
import Fullhomeweb from "../assets/imgs/Full home interior_web.jpg"
import modularweb from "../assets/imgs/modular_web.jpg"
import catalogue from "../assets/imgs/catalogue.webp"
import custom from "../assets/imgs/custom.webp"
import civilwork from "../assets/imgs/civilwork_web.jpg.1589529780297.webp"
import installation from "../assets/imgs/installation_web.jpg.1589548087826.webp"
import chevronr from "../assets/imgs/chevron-right-solid.svg"
import chevronl from "../assets/imgs/chevron-left-solid.svg"
import movein from "../assets/imgs/movein.png"
import book from "../assets/imgs/book.png"
import placeorder from "../assets/imgs/place order.png"
import meetdesigner from "../assets/imgs/meet.png"
import execution from "../assets/imgs/installation.png"
import location from "../assets/imgs/location.png"
import catalogue2 from "../assets/imgs/catalog.png"
import designer from "../assets/imgs/designer.png"
import booking from "../assets/imgs/booking.png"
import k1 from "../assets/imgs/2017_05_13_EMERALD_HILLS_ST01_KT1_C1_SU.jpg"
import k2 from "../assets/imgs/2018_09_11_BRIGADE_COSMOPOLIS_481_KT1_SA_02.jpg"
import k3 from "../assets/imgs/b0c7754d-b91c-4cd5-a1e5-18cf225826d2.jpg"
import B1 from "../assets/imgs/guest bedroom.jpg"
import B2 from "../assets/imgs/fusion.jpg"
import B3 from "../assets/imgs/chic.jpg"
import L1 from "../assets/imgs/aqua.jpg"
import L2 from "../assets/imgs/serene.jpg"
import L3 from "../assets/imgs/artistic.jpg"
import Kid1 from "../assets/imgs/vibrant.jpg"
import Kid2 from "../assets/imgs/alluring.jpg"
import Kid3 from "../assets/imgs/cosy.jpg"
import w1 from "../assets/imgs/brick.jpg"
import w2 from "../assets/imgs/raymond.jpg"
import w3 from "../assets/imgs/october.jpg"
import blog1 from "../assets/imgs/Blog-cover_Clean-rugs-and-carpets-scaled.jpg";
import blog2 from "../assets/imgs/Cover.png";
import blog3 from "../assets/imgs/Blog-2.png";
import banner from "../assets/imgs/banner.png";


import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from 'react-icons/fa';

const tabData = [
  {
    title: "Modular kitchens",
    heading: "Popular Modular Kitchens",
    
    designs: [
      { name: "Estelle L-shaped Kitchen", img:k1  },
      { name: "Aspen L-shaped Kitchen", img: k2 },
      { name: "Chloe Kitchen With Island Counter", img:k3 }
    ]
  },
  {
    title: "Living rooms",
    heading: "Popular Living Rooms",
    
    designs: [
      { name: "Aqua Delight", img:L1  },
      { name: "Serene Summer", img: L2 },
      { name: "Artistic Intrigue", img:L3 }
    ]
  },
  {
    title: "Bedrooms",
    heading: "Popular Bedrooms",
   
    designs: [
      { name: "Contemporary Cluster Guest Bedroom", img:B1},
      { name: "Contemporary Fusion Guest Room", img:B2  },
      { name: "Serene Chic Guest Bedroom", img:B3 }
    ]
  },
  {
    title: "Kid's room",
    heading: "Popular Kid's Room",
    
    designs: [
      { name: "Vibrant Kids Bedroom Interior Design", img:Kid1},
      { name: "Alluring Kids Bedroom Interior Design", img: Kid2 },
      { name: "Cosy Kids Bedroom Interior Design", img: Kid3 }
    ]
  },
  {
    title: "Modular wardrobes",
    heading: "Popular Modular Wardrobes",
    designs: [
      { name: "Brick Beauty", img:w1  },
      { name: "Raymond High", img: w2 },
      { name: "October Skies", img: w3 }
    ]
  }
];
export default function App() {
     const carouselRef = useRef(null);
  const currentIndex = useRef(0);
  const totalSlides = 5;
  const [activeTab, setActiveTab] = useState(0);

  const moveSlide = (direction) => {
    currentIndex.current = (currentIndex.current + direction + totalSlides) % totalSlides;
    const offset = -100 * currentIndex.current;
    carouselRef.current.style.transform = `translateX(${offset}%)`;
  };
  useEffect(() => {
    const chatButton = document.querySelector(".open-button");
    const chatPopup = document.querySelector(".chat-popup");
    const close = document.querySelector(".headsec img");

    chatButton?.addEventListener("click", () => {
      chatPopup.style.display = "block";
    });

    close?.addEventListener("click", () => {
      chatPopup.style.display = "none";
    });
    carouselRef.current = document.getElementById("carousel-track");
    
  }, []);
  

  return (
    <div className="font-sans overflow-x-hidden">
      {/* Navbar */}
       <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-6 h-20 text-black">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10" />
            <span className="text-xl font-bold text-[#002169]">RENOBASE</span>
          </div>
          <ul className="flex space-x-6 items-center text-sm">
            
            <li>
              <button className="bg-[#005eb8] text-white text-xs font-semibold px-6 py-2 rounded-full">
                Create project 
              </button>
            </li>
            <li><a href="#" className="hover:text-[#005eb8]">Sign in/Sign up</a></li>
          </ul>
        </div>
      </nav>

      {/* Video Section */}
      <div className="relative pt-20">
        <video
          className="w-full h-auto object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={homepageVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center bg-black/25 pointer-events-none">
          <h1 className="text-5xl font-bold shadow-md">Start designing your home, from your home</h1>
          <h5 className="mt-2">Begin your home interior journey from the comfort of your home today</h5>
          <button className="bg-[#005eb8] mt-4 px-8 py-3 rounded-full text-white font-medium">
            Create Project
          </button>
        </div>
      </div>

      {/* Pink Section */}
      <div className="bg-[#f0f4f8] py-24 px-10">
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-4xl font-bold text-[#002169]">Our experts are just a click away — get started without leaving your couch.</h1>
          
          </div>
          <div className="md:w-1/2">
            <img src={pinkSectionImg} alt="pink section" className="w-full" />
          </div>
        </div>
      </div>
      {/* Services Section */}
<section className="bg-[#f8f9fa] py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-semibold text-center mb-8 text-[#002169]">
      One-stop shop for everything interiors
    </h1>

    {/* We Design */}
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-[#002169] mb-2">We design</h2>
      <p className="text-[#002169] mb-6">
        We know you are unique, and we make sure your home is too!
      </p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img src={Fullhomeweb} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Full home interiors</h4>
            <p className="text-[#002169]">
              Your convenience is our priority. Our ergonomic kitchens and wardrobes will make your life easy.
            </p>
          </div>
        </div>
        <div className="flex-1">
          <img src={modularweb} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Modular solutions</h4>
            <p className="text-[#002169]">
              Want a minimalistic foyer, a bohemian bedroom or a vertical garden? Your wish is our command!
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* We Curate */}
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-[#002169] mb-2">We Curate</h2>
      <p className="text-[#002169] mb-6">You'll love our vast range of furniture, furnishings and decor!</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img src={catalogue} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Catalogue products</h4>
            <p className="text-[#002169]">
              With over 2.5 lakh products on our catalogue, we have everything you need!!
            </p>
          </div>
        </div>
        <div className="flex-1">
          <img src={custom} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Custom products</h4>
            <p className="text-[#002169]">
              Looking for something exclusive? We will design and make it specially for you!
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* We Deliver */}
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-[#002169] mb-2">We deliver</h2>
      <p className="text-[#002169] mb-6">Once your design is ready, we'll turn your home into reality.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img src={civilwork} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Civil work</h4>
            <p className="text-[#002169]">
              We'll do all the heavy-lifting–flooring, painting, false ceiling, plumbing and everything else in between!
            </p>
          </div>
        </div>
        <div className="flex-1">
          <img src={installation} alt="" className="w-full h-auto" />
          <div className="py-4">
            <h4 className="text-xl font-semibold text-[#002169]">Installation</h4>
            <p className="text-[#002169]">
              We make sure everything is in place before we deliver your dream home to you!
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Button */}
    <div className="flex justify-center">
      <button className="bg-[#005eb8] text-white font-semibold px-6 py-3 rounded-full">
        Create Project
      </button>
    </div>
  </div>
</section>

{/* Simple Steps Section */}
<section className="bg-white py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-bold text-center text-[#002169] mb-10">
      It's simpler than you think
    </h1>

    {/* Carousel */}
    <div className="relative">
      <div className="overflow-hidden relative">
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(0%)` }} id="carousel-track">
          {/* Slide 1 */}
          <div className="min-w-full relative">
            <img src={meetdesigner} alt="Meet Designer" className="w-full h-auto" />
            <div className="absolute bottom-0 bg-black/50 text-white p-4 w-full md:w-2/3">
              <h5 className="text-xl font-bold">Meet Vendors</h5>
              <p>Let's get to know you better and we'll share design concepts and a quote</p>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="min-w-full relative">
            <img src={book} alt="Seal the Deal" className="w-full h-auto" />
            <div className="absolute bottom-0 bg-black/50 text-white p-4 w-full md:w-2/3">
              <h5 className="text-xl font-bold">Seal the deal</h5>
              <p>Once you're happy with the design and the quote, book Renobase</p>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="min-w-full relative">
            <img src={placeorder} alt="Place Order" className="w-full h-auto" />
            <div className="absolute bottom-0 bg-black/50 text-white p-4 w-full md:w-2/3">
              <h5 className="text-xl font-bold">Place the order</h5>
              <p>It's execution time! Here's where you pay 45% to kickstart the order process</p>
            </div>
          </div>

          {/* Slide 4 */}
          <div className="min-w-full relative">
            <img src={execution} alt="Installation Begins" className="w-full h-auto" />
            <div className="absolute bottom-0 bg-black/50 text-white p-4 w-full md:w-2/3">
              <h5 className="text-xl font-bold">Installation begins</h5>
              <p>watch your home come alive</p>
            </div>
          </div>

          {/* Slide 5 */}
          <div className="min-w-full relative">
            <img src={movein} alt="Move In" className="w-full h-auto" />
            <div className="absolute bottom-0 bg-black/50 text-white p-4 w-full md:w-2/3">
              <h5 className="text-xl font-bold">Move in</h5>
              <p>Your Renobase home is now ready! It's time to make new memories!</p>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => moveSlide(-1)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          <img src={chevronl} alt="Previous" className="w-4 h-4" />
        </button>
        <button
          onClick={() => moveSlide(1)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          <img src={chevronr} alt="Next" className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</section>

{/* Comparison Table Section */}
<section className="bg-[#f0f4f8] py-20 px-4">
  <div className="max-w-6xl mx-auto text-center">
    <h1 className="text-4xl font-bold text-[#002169] mb-10">The Renobase Edge</h1>

    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse border border-gray-300 bg-white shadow-md rounded-md">
        <thead>
          <tr className="bg-[#005eb8] text-white">
            <th className="p-4"></th>
            <th className="p-4 font-semibold bg-[#004a9f]">Renobase experience</th>
            <th className="p-4 font-semibold">Typical experience</th>
          </tr>
        </thead>
        <tbody className="text-[#002169]">
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">PRICE</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>No hidden costs</li>
                <li>Price Match Guarantee</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>45% hike between first quote & final cost</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">CONVENIENCE</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>One-stop shop for all interior needs</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>Approx 27 market trips to find everything</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">DESIGN</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>Personalised design with 3D visuals</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>Cookie-cutter designs with 2D visuals</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">TIMELINES</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>45-day installation³</li>
                <li>Regular updates with project tracking</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>Unreliable timelines</li>
                <li>No communication on updates/delays</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">QUALITY</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>Branded materials</li>
                <li>146 quality checks</li>
                <li>100% in-house team</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>Inferior materials used to cut costs</li>
                <li>No quality checks</li>
                <li>Outsourced to small contractors</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">WARRANTY</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>Up to 10-year warranty⁴</li>
                <li>India’s first & only on-site service warranty</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>No warranty offered for products or services</li>
              </ul>
            </td>
          </tr>
          <tr className="border-t border-gray-200">
            <td className="p-4 font-semibold">AFTER-SALES SUPPORT</td>
            <td className="p-4 bg-[#e6f2ff] font-medium shadow-inner">
              <ul className="list-disc ml-4">
                <li>Dedicated team for prompt response & support</li>
              </ul>
            </td>
            <td className="p-4">
              <ul className="list-disc ml-4">
                <li>No after-sales support</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button className="mt-8 px-8 py-3 bg-[#005eb8] text-white font-medium rounded-full hover:bg-[#004a9f] transition">
      Create Project
    </button>
  </div>
</section>


{/* Stats Section */}
<section className="bg-white py-16">
  <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6">
    
    <div className="bg-[#f0f4f8] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
      <img src={booking} alt="Booking Icon" className="w-16 h-16 mb-4" />
      <p className="font-medium text-[#002169]">1 booking every hour*</p>
    </div>

    <div className="bg-[#f0f4f8] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
      <img src={designer} alt="Designer Icon" className="w-16 h-16 mb-4" />
      <p className="font-medium text-[#002169]">3,500+ expert designers</p>
    </div>

    <div className="bg-[#f0f4f8] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
      <img src={catalogue2} alt="Catalogue Icon" className="w-16 h-16 mb-4" />
      <p className="font-medium text-[#002169]">2.5 lakh+ catalogue products</p>
    </div>

    <div className="bg-[#f0f4f8] rounded-xl p-6 flex flex-col items-center text-center shadow-sm">
      <img src={location} alt="Location Icon" className="w-16 h-16 mb-4" />
      <p className="font-medium text-[#002169]">10 cities & 2 countries</p>
    </div>

  </div>
</section>


<section className="bg-[#f0f4f8] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#002169]">Looking for design inspiration?</h1>
        <p className="mt-2 text-[#002169]">Browse thousands of looks that we've curated specially for you.</p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {tabData.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeTab === index
                  ? "bg-[#005eb8] text-white"
                  : "bg-white text-[#002169] border-[#005eb8] hover:bg-[#e6f2ff]"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#002169]">{tabData[activeTab].heading}</h3>
            <a href="#" className="text-[#005eb8] hover:underline text-sm font-medium">
              {tabData[activeTab].viewAll}
            </a>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {tabData[activeTab].designs.map((design, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <img src={design.img} alt={design.name} className="w-full h-48 object-cover" />
                <div className="p-4 text-[#002169] font-medium">{design.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

<section className="bg-white py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <h1 className="text-4xl font-bold text-[#002169] mb-4">
      Stay updated with the latest design trends!
    </h1>
    <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
      <p className="text-[#002169] text-lg">Find everything from design fixes to expert tips on Renobase Magazine</p>
    </div>

    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Blog Card 1 */}
      <div className="w-full md:w-[346px] bg-white shadow-md rounded-md overflow-hidden">
        <img src={blog1} alt="Clean rugs" className="w-full h-56 object-cover" />
        <div className="p-4">
          <p className="text-[#002169] font-semibold mb-2">
            The Easy & Free Way to Clean Your Carpets & Rugs
          </p>
          
        </div>
      </div>

      {/* Blog Card 2 */}
      <div className="w-full md:w-[346px] bg-white shadow-md rounded-md overflow-hidden">
        <img src={blog2} alt="Kalinga Stone" className="w-full h-56 object-cover" />
        <div className="p-4">
          <p className="text-[#002169] font-semibold mb-2">
            What is Kalinga Stone and How Can it Make Your Kitchen Better?
          </p>
          
        </div>
      </div>

      {/* Blog Card 3 */}
      <div className="w-full md:w-[346px] bg-white shadow-md rounded-md overflow-hidden">
        <img src={blog3} alt="PVC Kitchen Cabinets" className="w-full h-56 object-cover" />
        <div className="p-4">
          <p className="text-[#002169] font-semibold mb-2">
            What is PVC and Why Should You Use it In Your Kitchen Cabinets?
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="semi-footer" className="relative w-full h-[400px] md:h-[500px]">
  <img
    src={banner}
    alt="Dream Home Banner"
    className="absolute inset-0 w-full h-full object-cover z-0"
  />
  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 bg-black/20">
    <h1 className="text-3xl md:text-4xl font-bold text-white">
      Your dream home is just a click away
    </h1>
    <button className="mt-6 bg-[#005eb8] text-white font-medium px-6 py-3 rounded-full hover:bg-[#004a9f] transition">
      GET STARTED
    </button>
  </div>
</section>


<footer className="bg-[#f0f4f8] text-[#002169] pt-10 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <img src={logo} alt="Renobase logo" className="h-10 mb-4" />
            <span className="text-xl font-bold">RENOBASE</span>
            <div className="flex gap-4">
              <FaFacebookF className="text-white bg-[#005eb8] p-2 rounded-full text-xl" />
              <FaTwitter className="text-white bg-[#005eb8] p-2 rounded-full text-xl" />
              <FaInstagram className="text-white bg-[#005eb8] p-2 rounded-full text-xl" />
              <FaPinterestP className="text-white bg-[#005eb8] p-2 rounded-full text-xl" />
              <FaYoutube className="text-white bg-[#005eb8] p-2 rounded-full text-xl" />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-6 text-sm md:grid-cols-3 lg:grid-cols-4 w-full">
            <div>
              <h5 className="font-semibold mb-2">Company</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Press</a></li>
                <li><a href="#" className="hover:underline">How it works</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Policies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="invisible">.</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
                <li><a href="#" className="hover:underline">Refer a friend</a></li>
                <li><a href="#" className="hover:underline">About us</a></li>
                <li><a href="#" className="hover:underline">Contact us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Support</h5>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">FAQ’s</a></li>
                <li><a href="#" className="hover:underline">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Get in touch</h5>
              <div className="space-y-1">
                <div>Call us</div>
                <a href="tel:+919112345678" className="text-[#005eb8] hover:underline">+91 9148 484 666</a>
                <div className="mt-2">Email Us</div>
                <a href="mailto:care@Renobase.com" className="text-[#005eb8] hover:underline">care@Renobase.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-300" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <div>© 2025 Renobase.com All Rights Reserved</div>
        </div>
      </div>
    </footer>
    </div>
    
  );
}
