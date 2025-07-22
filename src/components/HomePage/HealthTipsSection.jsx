import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HealthTipsSection = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/data/healthArticles.json')
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error('Error loading articles:', err));
  }, []);

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">
        Health Tips & Articles
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {articles.map(
          ({ id, title, summary, image, author, publishedDate }) => (
            <article
              key={id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {image && (
                <img
                  src={image}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  By {author} | {new Date(publishedDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4 text-sm">{summary}</p>
                <Link
                  to={`/article/${id}`}
                  className="text-purple-700 font-medium hover:underline text-sm"
                >
                  Read More &rarr;
                </Link>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default HealthTipsSection;
