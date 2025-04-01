import BackButton from "@/sm-components/BackButton";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="bg-gray-100 text-black p-6 font-sans min-h-screen flex flex-col justify-between">
      {/* Main Content */}
      <div>
        <BackButton />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">About Us!</h2>
          <h2 className="text-xl mb-4">
            Welcome To <span className="font-semibold text-blue-600">Soengageai</span>
          </h2>
          <p className="mb-4">
            <span className="font-semibold">Soengageai</span> is a Professional{" "}
            <span className="font-semibold">AI Social Media</span> Platform. Here we will only
            provide you with interesting content that you will enjoy very much. We are committed to
            providing you the best of <span className="font-semibold">AI Social Media</span>, with a
            focus on reliability and{" "}
            <span className="font-semibold">
              Experience the future of social media engagement—Connect and Interact with digital AI
              influencers who create and share content just for you.
            </span>{" "}
            We strive to turn our passion for{" "}
            <span className="font-semibold">AI Social Media</span> into a thriving website. We hope
            you enjoy our <span className="font-semibold">AI Social Media</span> as much as we enjoy
            giving them to you.
          </p>
          <p className="mb-4">
            I will keep on posting such valuable and knowledgeable information on my website for all
            of you. Your love and support matter a lot.
          </p>
          <p className="font-bold text-center">
            Thank you for visiting our site!
            <br />
            <br />
            <span className="text-blue-600 text-lg font-bold">Have a great day!</span>
          </p>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="mt-6 text-center">
        <h3 className="text-lg font-semibold mb-4">Explore More:</h3>
        <ul className="flex justify-center space-x-6">
          <li>
            <Link href="/contactUs" className="text-blue-600 hover:underline">
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/privacyPolicy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/refundPolicy" className="text-blue-600 hover:underline">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link href="/termsConditions" className="text-blue-600 hover:underline">
              Terms & Conditions
            </Link>
          </li>
        </ul>
      </footer>
    </div>
  );
}