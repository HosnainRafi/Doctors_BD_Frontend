import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";

const Contact = () => {
  const handleContactSubmit = (event) => {
    event.preventDefault();
    const name=event.target.name.value;
    const email=event.target.email.value;
    const message=event.target.message.value;
    console.log("Form submitted",{name, email, message});
  }
  return (
    <div>
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-24">
            <div className="flex items-center lg:mb-0 mb-10">
              <div className="">
                <h4 className="text-indigo-600 text-base font-medium leading-6 mb-4 lg:text-left text-center">
                  Contact Us
                </h4>
                <h2 className="text-gray-900 font-manrope text-4xl font-semibold leading-10 mb-9 lg:text-left text-center">
                  Reach Out To Us
                </h2>
                <form onSubmit={handleContactSubmit} action="">
                  <input
                    name="name"
                    type="text"
                    className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-lg border border-gray-200 focus:outline-none py-2 px-4 mb-8"
                    placeholder="Name"
                  />
                  <input
                    name="email"
                    type="email"
                    className="w-full h-14 shadow-sm text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-lg border border-gray-200 focus:outline-none py-2 px-4 mb-8"
                    placeholder="Email"
                  />
                  <textarea
                    name="message"
                    id="text"
                    className="w-full h-48 shadow-sm resize-none text-gray-600 placeholder-text-400 text-lg font-normal leading-7 rounded-lg border border-gray-200 focus:outline-none px-4 py-4 mb-8"
                    placeholder="Phone"
                  ></textarea>
                  <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition w-full" type="submit">
                    Submit
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:max-w-xl w-full h-[600px] flex items-center justify-center bg-cover bg-no-repeat bg-[url('https://i.postimg.cc/nzCpqG8q/17818.jpg')]">
              <div className="">
                <div className="lg:w-96 w-auto h-auto bg-white shadow-xl lg:p-6 p-4">
                  {/* Logo SVG remains as it's complex */}
                  <h2 className="text-purple-700 text-3xl font-semibold leading-7 mb-4 text-center">
                    Care Point
                  </h2>
                  <div className="flex items-center mb-6">
                    <FaPhone className="text-black text-xl" />
                    <h5 className="text-black text-base font-normal leading-6 ml-5">
                      01521565259
                    </h5>
                  </div>
                  <div className="flex items-center mb-6">
                    <FaEnvelope className="text-black text-xl" />
                    <h5 className="text-black text-base font-normal leading-6 ml-5">
                      care.point24@gmail.com
                    </h5>
                  </div>
                  <div className="flex items-center mb-6">
                    <FaMapMarkerAlt className="text-black text-xl" />
                    <h5 className="text-black text-base font-normal leading-6 ml-5">
                      Los Sontosh,Tangail
                    </h5>
                  </div>

                  {/* Social media icons with React Icons */}
                  <div className="flex items-center justify-center border-t border-gray-100 pt-6">
                    <a href="javascript:;" className="mr-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <FaFacebook className="text-white text-lg" />
                      </div>
                    </a>
                    <a href="javascript:;" className="mr-6">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 flex items-center justify-center">
                        <FaInstagram className="text-white text-lg" />
                      </div>
                    </a>
                    <a href="javascript:;" className="mr-6">
                      <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
                        <FaTwitter className="text-white text-lg" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
