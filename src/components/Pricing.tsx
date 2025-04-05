"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Star, Zap} from "lucide-react";
import { motion } from "framer-motion";

interface CreditPackage {
  credits: number;
  price: number;
  features: string[];
  title: string;
  paymentType: string;
}

interface CreditPricingProps {
  onBuy: (pkg: CreditPackage) => void;
}

const Pricing: FC<CreditPricingProps> = ({ onBuy }) => {
  const packages: CreditPackage[] = [
    {
      title: "Starter Plan",
      credits: 200,
      price: 0.1,
      paymentType: "one-time",
      features: [
        "200 credits",
        "Access to every AI Influencer",
        "chats"
      ]
    },
    {
      title: "Basic Plan",
      credits: 500,
      price: 10,
      paymentType: "one-time",
      features: [
        "500 Credits",
        "Access to every AI influencer",
        "Chats",
      ]
    },
    {
      title: "Discounted Plan",
      credits: 1000,
      price: 15,
      paymentType: "one-time",
      features: [
        "1000 Credits",
        "Access to every AI influencer",
        "Chats",
      ]
    }
  ];

  // Plan icons
  const icons = [
    <Zap className="h-6 w-6" key="zap" />, 
    <Star className="h-6 w-6" key="star" />, 
    <Sparkles className="h-6 w-6" key="sparkles" />
  ];

  return (
    <div className="mx-auto min-h-screen p-4 md:p-6 lg:p-8 bg-gradient-to-b from-black to-gray-900 max-w-6xl">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find the perfect plan for your needs. Every plan includes access to our core features.
          </p>
          <div className="my-8 border-b border-purple-500/30 w-24 mx-auto" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 max-w-5xl mx-auto">
        {packages.map((pkg, index) => {
          // Determine the styling based on the card index
          
          const isMiddleCard = index === 1;
          const isDiscountedCard = index === 2;
          
          return (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                boxShadow: isDiscountedCard 
                  ? "0px 8px 30px rgba(168, 85, 247, 0.25)" 
                  : isMiddleCard 
                    ? "0px 8px 30px rgba(255, 255, 255, 0.2)"
                    : "0px 8px 30px rgba(75, 85, 99, 0.25)"
              }}
              className={`bg-gradient-to-b ${
                isDiscountedCard 
                  ? "from-purple-950/80 to-gray-900 border-purple-500/50" 
                  : isMiddleCard 
                    ? "from-gray-800/80 to-gray-900 border border-gray-500/30"
                    : "from-gray-800/80 to-gray-900 border-gray-700/50"
              } rounded-2xl overflow-hidden shadow-xl`}
            >
              {/* Card Header */}
              <div className={`p-6 ${
                isDiscountedCard 
                  ? "bg-purple-900/20" 
                  : isMiddleCard 
                    ? "bg-gray-800/40" 
                    : "bg-gray-800/20"
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDiscountedCard 
                      ? "bg-purple-500/20 text-purple-400" 
                      : isMiddleCard 
                        ? "bg-gray-700/40 text-white" 
                        : "bg-gray-700/40 text-gray-300"
                  }`}>
                    {icons[index]}
                  </div>
                  <h3 className="text-xl font-bold text-white">{pkg.title}</h3>
                </div>
                
                <div className="flex items-baseline mb-1">
                  <span className="text-4xl font-bold text-white">${pkg.price}</span>
                  <span className="text-gray-400 ml-2">/{pkg.paymentType}</span>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  Get <span className={isMiddleCard ? "text-white font-semibold" : "text-purple-400 font-semibold"}>
                    {pkg.credits}
                  </span> credits
                </p>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-gray-700/50"></div>
              
              {/* Features List */}
              <div className="p-6">
                <p className="text-gray-300 font-medium mb-4">Includes:</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <motion.li
                      key={feature}
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-300"
                    >
                      <Check className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    onClick={() => onBuy(pkg)}
                    className={`w-full py-5 text-center text-white font-medium rounded-xl ${
                      isDiscountedCard 
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-900/30" 
                        : isMiddleCard 
                          ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg shadow-gray-900/30" 
                          : "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                    }`}
                  >
                    Get {pkg.credits} Credits
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;