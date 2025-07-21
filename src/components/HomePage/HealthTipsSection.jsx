import { Link } from 'react-router-dom';

const healthArticles = [
  {
    id: 1,
    title: '5 Tips for a Healthy Heart',
    summary:
      'Learn simple lifestyle changes that can improve your heart health and reduce risk of cardiovascular diseases.',
    url: '/articles/healthy-heart',
  },
  {
    id: 2,
    title: 'How to Boost Your Immunity Naturally',
    summary:
      'Discover natural ways to strengthen your immune system with diet, exercise, and stress management.',
    url: '/articles/boost-immunity',
  },
  {
    id: 3,
    title: 'Understanding Diabetes: What You Need to Know',
    summary:
      'A comprehensive guide to diabetes types, symptoms, prevention, and management.',
    url: '/articles/understanding-diabetes',
  },
];

const HealthTipsSection = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Health Tips & Articles
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {healthArticles.map(({ id, title, summary, url }) => (
          <article
            key={id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {title}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">{summary}</p>
            <Link
              to={url}
              className="text-purple-700 font-medium hover:underline"
            >
              Read More &rarr;
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HealthTipsSection;
