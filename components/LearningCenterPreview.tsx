import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

interface Article {
  title: string;
  description: string;
  path: string;
  category: string;
  icon: string;
  date: string;
}

const articles: Article[] = [
  {
    title: "Understanding Taxable Income",
    description: "Learn how to calculate your taxable income and understand various income heads",
    path: "/learning-center/personal-finance/taxable-income",
    category: "Personal Finance",
    icon: "💰",
    date: "Mar 15, 2024"
  },
  {
    title: "Credit Card Interest Calculation",
    description: "Understand how credit card interest is calculated and ways to minimize charges",
    path: "/learning-center/credit-cards/interest-calculation",
    category: "Credit Cards",
    icon: "💳",
    date: "Mar 12, 2024"
  },
  {
    title: "Mutual Funds Types",
    description: "Learn about different types of mutual funds and their risk levels",
    path: "/learning-center/mutual-funds/types",
    category: "Mutual Funds",
    icon: "📈",
    date: "Mar 10, 2024"
  }
];

const LearningCenterPreview = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Learning Center</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Expand your financial knowledge with our latest articles and guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link href={article.path} key={index}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer bg-white">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{article.icon}</span>
                      <span className="text-sm text-blue-600 font-medium">
                        {article.category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{article.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 flex-grow">
                    {article.description}
                  </p>
                  <div className="mt-4 text-blue-500 font-medium text-sm flex items-center">
                    Read more 
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/learning-center"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearningCenterPreview; 