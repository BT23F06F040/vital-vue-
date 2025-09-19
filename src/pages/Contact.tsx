import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sent');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact</h1>
        <p className="text-gray-600">Email form and social links</p>
      </div>

      {status === 'sent' ? (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded p-4">
          Thanks! Your message has been captured for this demo.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea className="w-full border rounded px-3 py-2 h-32" required />
          </div>
          <button type="submit" className="btn-primary">Send</button>
        </form>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Social</h2>
        <div className="flex gap-3 text-primary-600">
          <a href="#" className="hover:underline">GitHub</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">LinkedIn</a>
        </div>
      </div>
    </div>
  );
};

export default Contact;


