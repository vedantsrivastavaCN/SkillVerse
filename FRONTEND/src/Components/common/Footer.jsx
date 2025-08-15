import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";
import { FaFacebook, FaLinkedin, FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms of Service"];
const Resources = [
  "Articles",
  "Blog",
  "Documentation",
  "Code Challenges",
  "Projects",
  "Videos",
  "Tutorials",
  "Workspaces",
];
const Plans = ["Pro Membership", "For Students", "Business Solutions", "Enterprise"];
const Community = ["Forums", "Discord Server", "Events", "Meetups"];

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="SkillVerse Icon" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold">SkillVerse</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate platform for learning and mastering new skills through interactive courses.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaDiscord className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/catalog" className="hover:text-white transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              {Resources.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().split(" ").join("-")}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/help-center" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Categories - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-800">
          {/* Plans */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
              Plans
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {Plans.map((plan, index) => (
                <li key={index}>
                  <Link
                    to={`/${plan.toLowerCase().split(" ").join("-")}`}
                    className="hover:text-white transition-colors"
                  >
                    {plan}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
              Community
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {Community.map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item.toLowerCase().split(" ").join("-")}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Categories from FooterLink2 */}
          {FooterLink2.length > 0 && FooterLink2[0] && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-300 uppercase tracking-wider">
                {FooterLink2[0].title}
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                {FooterLink2[0].links.slice(0, 4).map((link, index) => (
                  <li key={index}>
                    <Link to={link.link} className="hover:text-white transition-colors">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap items-center mb-4 md:mb-0">
              {BottomFooter.map((item, index) => (
                <React.Fragment key={index}>
                  <Link
                    to={`/${item.toLowerCase().split(" ").join("-")}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </Link>
                  {index < BottomFooter.length - 1 && (
                    <span className="mx-3 text-gray-600">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              &copy; 2024 SkillVerse. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;