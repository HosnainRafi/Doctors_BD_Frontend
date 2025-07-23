import { FaFacebook, FaLinkedin, FaGlobe } from 'react-icons/fa';

const devTeam = [
  {
    name: 'Hosnain Rafi',
    role: 'Backend Developer',
    image: 'https://i.postimg.cc/XJQ9DGD5/rafi.jpg',
    bio: 'Focused on server-side logic, API architecture, and database systems using Node.js and Express.',
    facebook: 'https://web.facebook.com/hosnain.rafi',
    linkedin: 'https://www.linkedin.com/in/hosnain-rafi1/',
    portfolio: 'https://hosnainrafi.dev',
  },
  {
    name: 'Asadul Islam Imran',
    role: 'Frontend Developer',
    image: 'https://i.postimg.cc/wMrL9KzT/profile.jpg',
    bio: 'Specializes in building modern, responsive UIs using React and Tailwind CSS.',
    facebook: 'https://web.facebook.com/asad9340/',
    linkedin: 'https://www.linkedin.com/in/asad9340/',
    portfolio: 'https://asad-dev-portfolio.web.app/',
  },
  {
    name: 'Tanvir Ahmmed Sifat',
    role: 'Frontend Developer',
    image: 'https://i.postimg.cc/0Q2wm52y/sifat.jpg',
    bio: 'Frontend enthusiast passionate about user experience and interactive design.',
    facebook: 'https://web.facebook.com/sifat.7847',
    linkedin: 'https://linkedin.com/in/tanvirsifat',
    portfolio: 'https://www.linkedin.com/in/sifat26/',
  },
];

const DevTeam = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-purple-700 mb-4">
          Meet the Developers
        </h2>
        <p className="text-gray-600 mb-12">
          The team behind this platform—building seamless user experiences and
          robust backend services.
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          {devTeam.map((member, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {member.name}
              </h3>
              <p className="text-purple-600 text-sm font-medium mb-2">
                {member.role}
              </p>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-purple-600 rounded-md px-3 py-1 text-sm text-purple-600
                             hover:bg-purple-600 hover:text-white hover:scale-105 transform transition duration-300"
                >
                  Facebook <FaFacebook />
                </a>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-purple-600 rounded-md px-3 py-1 text-sm text-purple-600
                             hover:bg-purple-600 hover:text-white hover:scale-105 transform transition duration-300"
                >
                  LinkedIn <FaLinkedin />
                </a>
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 border border-purple-600 rounded-md px-3 py-1 text-sm text-purple-600
                             hover:bg-purple-600 hover:text-white hover:scale-105 transform transition duration-300"
                >
                  Portfolio <FaGlobe />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevTeam;
