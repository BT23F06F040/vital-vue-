import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-600 text-sm">© {new Date().getFullYear()} Vital Vue</div>
        <div className="flex gap-4 text-sm">
          <Link to="/contact" className="text-gray-600 hover:text-primary-600">Contact</Link>
          <a href="https://opensource.org/licenses" className="text-gray-600 hover:text-primary-600" target="_blank" rel="noreferrer">Open Source</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


