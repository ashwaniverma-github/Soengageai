import BackButton from "@/sm-components/BackButton"

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 text-black p-6 font-sans">
        <BackButton/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">Last updated: March 29, 2025</p>
        <p className="mb-4">
          This Privacy Policy describes Our policies and procedures on the collection, use, and
          disclosure of Your information when You use the Service and tells You about Your privacy
          rights and how the law protects You.
        </p>
        <p className="mb-4">
          We use Your Personal data to provide and improve the Service. By using the Service, You
          agree to the collection and use of information in accordance with this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold mb-2">Interpretation and Definitions</h2>
        <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
        <p className="mb-4">
          The words of which the initial letter is capitalized have meanings defined under the
          following conditions. The following definitions shall have the same meaning regardless of
          whether they appear in singular or in plural.
        </p>

        <h3 className="text-lg font-semibold mb-2">Definitions</h3>
        <p className="mb-4">For the purposes of this Privacy Policy:</p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Account:</strong> A unique account created for You to access our Service or
            parts of our Service.
          </li>
          <li>
            <strong>Affiliate:</strong> An entity that controls, is controlled by, or is under
            common control with a party, where &quot;control&quot; means ownership of 50% or more of the
            shares, equity interest, or other securities entitled to vote for election of directors
            or other managing authority.
          </li>
          <li>
            <strong>Company:</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in
            this Agreement) refers to Soengageai.
          </li>
          <li>
            <strong>Cookies:</strong> Small files that are placed on Your computer, mobile device,
            or any other device by a website, containing the details of Your browsing history on
            that website among its many uses.
          </li>
          <li>
            <strong>Country:</strong> Refers to Uttar Pradesh, India.
          </li>
          <li>
            <strong>Device:</strong> Any device that can access the Service such as a computer, a
            cellphone, or a digital tablet.
          </li>
          <li>
            <strong>Personal Data:</strong> Any information that relates to an identified or
            identifiable individual.
          </li>
          <li>
            <strong>Service:</strong> Refers to the Website.
          </li>
          <li>
            <strong>Service Provider:</strong> Any natural or legal person who processes the data
            on behalf of the Company. It refers to third-party companies or individuals employed by
            the Company to facilitate the Service, to provide the Service on behalf of the Company,
            to perform services related to the Service, or to assist the Company in analyzing how
            the Service is used.
          </li>
          <li>
            <strong>Usage Data:</strong> Data collected automatically, either generated by the use
            of the Service or from the Service infrastructure itself (for example, the duration of a
            page visit).
          </li>
          <li>
            <strong>Website:</strong> Refers to Soengageai, accessible from{" "}
            <a
              href="https://soengageai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://soengageai.com/
            </a>
          </li>
          <li>
            <strong>You:</strong> The individual accessing or using the Service, or the company, or
            other legal entity on behalf of which such individual is accessing or using the Service,
            as applicable.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">Collecting and Using Your Personal Data</h2>
        <h3 className="text-lg font-semibold mb-2">Types of Data Collected</h3>
        <h4 className="text-md font-semibold mb-2">Personal Data</h4>
        <p className="mb-4">
          While using Our Service, We may ask You to provide Us with certain personally identifiable
          information that can be used to contact or identify You. Personally identifiable
          information may include, but is not limited to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Email address</li>
          <li>Usage Data</li>
        </ul>

        <h4 className="text-md font-semibold mb-2">Usage Data</h4>
        <p className="mb-4">
          Usage Data is collected automatically when using the Service. Usage Data may include
          information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser
          type, browser version, the pages of our Service that You visit, the time and date of Your
          visit, the time spent on those pages, unique device identifiers, and other diagnostic
          data.
        </p>

        <h3 className="text-lg font-semibold mb-2">Tracking Technologies and Cookies</h3>
        <p className="mb-4">
          We use Cookies and similar tracking technologies to track the activity on Our Service and
          store certain information. Tracking technologies used are beacons, tags, and scripts to
          collect and track information and to improve and analyze Our Service.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong>Cookies or Browser Cookies:</strong> A cookie is a small file placed on Your
            Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie
            is being sent. However, if You do not accept Cookies, You may not be able to use some
            parts of our Service.
          </li>
          <li>
            <strong>Web Beacons:</strong> Certain sections of our Service and our emails may contain
            small electronic files known as web beacons (also referred to as clear gifs, pixel tags,
            and single-pixel gifs) that permit the Company, for example, to count users who have
            visited those pages or opened an email and for other related website statistics.
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Use of Your Personal Data</h3>
        <p className="mb-4">
          The Company may use Personal Data for the following purposes:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>To provide and maintain our Service, including to monitor the usage of our Service.</li>
          <li>To manage Your Account as a registered user of the Service.</li>
          <li>To contact You via email, phone, or other communication methods.</li>
          <li>To provide You with news, offers, and general information about our services.</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, You can contact us:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>By email: soengageai@gmail.com</li>
        </ul>
      </div>
    </div>
  );
}