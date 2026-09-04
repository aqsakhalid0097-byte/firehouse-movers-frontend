import React from 'react';
import { FileText, ArrowRight, Clock, FileCheck, CheckCircle2, XCircle, CalendarX, Truck, Calendar, DollarSign, FileQuestion } from 'lucide-react';

export interface CustomerQuote {
  id: number | string;
  quote_number: string;
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  service_name: string;
  created_at: string;
  quoted_price?: number | string | null;
}

interface CustomerRecentQuotesProps {
  quotes?: CustomerQuote[];
}

export const CustomerRecentQuotes: React.FC<CustomerRecentQuotesProps> = ({
  quotes = [],
}) => {
  const getStatusBadge = (status: CustomerQuote['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'quoted':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/30 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5" /> Quoted
          </span>
        );
      case 'accepted':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      case 'expired':
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded-full border border-gray-500/30 flex items-center gap-1.5">
            <CalendarX className="w-3.5 h-3.5" /> Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800/90 rounded-xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-red-500" />
          Recent Quote Requests
        </h2>
        {quotes.length > 0 && (
          <a
            href="#my-quotes"
            className="text-red-500 hover:text-red-400 text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            View All <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {quotes.length > 0 ? (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-[#262626] border border-gray-800 hover:border-red-500/40 rounded-xl p-5 transition-all duration-300 shadow-md hover:-translate-y-0.5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-white font-bold text-base tracking-wide">
                      {quote.quote_number}
                    </span>
                    {getStatusBadge(quote.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-gray-400">
                    <span className="flex items-center gap-1.5 text-gray-200">
                      <Truck className="w-4 h-4 text-red-400" />
                      {quote.service_name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Requested: {quote.created_at}
                    </span>
                    {quote.quoted_price && (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        Quoted: ${quote.quoted_price}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <a
                    href={`#quote-${quote.id}`}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#141414] border border-gray-800 rounded-xl p-10 text-center space-y-3">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-gray-500">
            <FileQuestion className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">No Quote Requests Yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Request a quote to get started with our professional moving and storage services.
          </p>
          <div className="pt-2">
            <a
              href="#request-quote"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-600/20 cursor-pointer"
            >
              Request Quote
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRecentQuotes;
