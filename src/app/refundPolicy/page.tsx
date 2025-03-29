export default function RefundPolicy() {
  return (
    <div className="bg-gray-100 text-black p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Refund Policy</h1>
        <p className="mb-4 text-gray-600">Last Updated: [28/03/2025]</p>

        <h2 className="text-xl font-semibold mb-2">1. General Refund Policy</h2>
        <p className="mb-4">
          All digital purchases, including credits, subscriptions, and any in-app purchases, are
          non-refundable. Once the purchase is complete and the credits are applied to your account,
          we are unable to reverse the transaction.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Exceptions</h2>
        <p className="mb-4">
          We may consider refund requests on a case-by-case basis if:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Technical Errors:</strong> There is a proven technical issue that prevented you
            from accessing the purchased credits or subscription.
          </li>
          <li>
            <strong>Duplicate Transactions:</strong> In the rare event that a duplicate transaction
            occurs, please contact our support team with proof of the duplicate charge.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">3. Requesting a Refund</h2>
        <p className="mb-4">
          If you believe your refund request falls under an exception, please contact our support
          team at <a href="mailto:soengageai@gmail.com" className="text-blue-600 underline">soengageai@gmail.com</a> within 14 days of your purchase. Provide the following details:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Order number and purchase date.</li>
          <li>Description of the issue.</li>
          <li>Any relevant screenshots or documentation.</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">4. Refund Process</h2>
        <p className="mb-4">
          Upon receipt of your refund request, our team will review your case. If approved, refunds
          will be processed to your original payment method within 7-10 business days. You will
          receive an email confirmation once the refund has been initiated.
        </p>

        <h2 className="text-xl font-semibold mb-2">5. Changes to This Policy</h2>
        <p className="mb-4">
          We reserve the right to update this refund policy from time to time. Any changes will be
          posted on this page with an updated effective date.
        </p>

        <h2 className="text-xl font-semibold mb-2">6. Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns regarding this Refund Policy, please contact us at:{" "}
          <a href="mailto:soengageai@gmail.com" className="text-blue-600 underline">soengageai@gmail.com</a>
        </p>
      </div>
    </div>
  );
}