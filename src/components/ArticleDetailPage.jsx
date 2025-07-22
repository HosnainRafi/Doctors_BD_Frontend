
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch('/data/healthArticles.json')
      .then(res => res.json())
      .then(data => {
        const found = data.find(item => item.id.toString() === id);
        setArticle(found);
      });
  }, [id]);

  if (!article) {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-purple-700 mb-4">
        {article.title}
      </h1>

      <div className="text-sm text-gray-500 mb-6">
        <span className="mr-3">By {article.author}</span>
        <span className="mr-3">| {article.publishedDate}</span>
        <span className="mr-3">| {article.category}</span>
        <span className="mr-3">| ⏱ {article.readTime}</span>
      </div>

      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-[400px] object-contain rounded-md shadow mb-6"
        />
      )}

      <div className="prose prose-purple max-w-none text-gray-800 whitespace-pre-line">
        {article.content}
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-8">
          <h4 className="font-semibold text-gray-700 mb-2">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;
