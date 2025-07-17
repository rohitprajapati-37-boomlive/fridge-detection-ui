import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="bg-white mb-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        className={`w-full px-6 py-4 text-left flex justify-between items-center transition-all ${
          isOpen ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
        }`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold">{question}</span>
        <Plus 
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-45' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-40' : 'max-h-0'
        }`}
      >
        <p className="px-6 pb-4 text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does FindRecipe work?",
      answer: "Upload a photo of your ingredients, and the tool will automatically detect them to suggest recipes you can cook—sourced from India Food Network's website and YouTube channel."
    },
    {
      question: "Can I find both Indian and global recipes?",
      answer: "Yes, FindRecipe shows you a mix of Indian and international recipes based on the ingredients in your uploaded photo."
    },
    {
      question: "Where do the recipe suggestions come from?",
      answer: "All recipes are pulled directly from trusted content published by India Food Network on its website and YouTube channel."
    },
    {
      question: "Do I need to install anything to use FindRecipe?",
      answer: "No, it's a web-based tool. You can use it on your phone or desktop browser—no app download required."
    },
    {
      question: "Is FindRecipe free to use?",
      answer: "Yes, it's completely free for all users. Just upload your image and start exploring recipes instantly."
    }
  ];

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-4 sm:px-6 max-w-6xl mx-auto py-16 bg-white border-t border-gray-100">
      <div className="ktn-recp-ingdnt bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 mb-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about our recipe finder tool
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;