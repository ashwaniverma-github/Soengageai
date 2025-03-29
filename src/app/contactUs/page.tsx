export default function ContactUs() {
  return (
    <div className="bg-gray-100 text-black p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-4">Contact Us</h1>
      <h2 className="text-center text-lg mb-6">
        Wanna connect with us? <br />
        You can do so through the links below.
      </h2>

      <div className="flex justify-center space-x-8 mb-8">
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4213/4213968.png"
            alt="Email Icon"
            height="80"
            width="70"
            className="mx-auto"
          />
          <p className="mt-2">soengageai@gmail.com</p>
        </div>
        <div className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/0/191.png"
            alt="Phone Icon"
            height="80"
            width="70"
            className="mx-auto"
          />
          <p className="mt-2">9250204355</p>
        </div>
      </div>

      <h3 className="text-center text-lg font-semibold mb-4">Find us on social media</h3>
      <div className="flex justify-center space-x-4 mb-8">
        <a
          href="https://twitter.com/ashwanivermax"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Twitter_Logo.png"
            alt="Twitter Logo"
            height="30"
            width="30"
          />
        </a>
      </div>

      <div className="text-center">
        <h3 className="text-blue-600 text-lg font-bold">Thank You!</h3>
        <h3 className="text-blue-600 text-lg">We will get back to you soon...</h3>
      </div>
    </div>
  );
}