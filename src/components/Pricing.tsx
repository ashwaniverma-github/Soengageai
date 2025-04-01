"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
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
      title: "Discounted plan",
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

  return (
    <div className="mx-auto min-h-screen  md:p-6 lg:p-2 bg-black max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Choose Your Plan</h1>
        <p className="text-gray-300 text-base md:text-lg">
          Find the perfect plan for your needs. Every plan includes access to our core features.
        </p>
        <div className="my-6 border-t border-gray-700 w-16 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 4px 20px rgba(168, 85, 247, 0.3)"
            }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-purple-500 cursor-pointer"
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
              <p className="text-gray-400 text-sm mb-3">One-time payment for {pkg.credits} credits</p>
              <div className="text-3xl font-bold text-purple-400 mb-1">${pkg.price}</div>
              <p className="text-gray-400 uppercase text-xs">{pkg.paymentType}</p>
            </div>

            <div className="border-t border-gray-700 pt-4 mb-6">
              <ul className="space-y-2">
                {pkg.features.map((feature) => (
                  <motion.li
                    key={feature}
                    whileHover={{ x: 5 }}
                    className="flex items-center text-gray-300 text-sm"
                  >
                    <Check className="h-4 w-4 text-green-400 mr-2" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onBuy(pkg)}
                className=" w-full py-4 text-center flex justify-center p-6 bg-purple-600 hover:bg-purple-700 text-base rounded-full"
              >
                Get {pkg.credits} Credits
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;