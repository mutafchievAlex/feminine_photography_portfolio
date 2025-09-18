import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';

const swaggerUrl = import.meta.env.VITE_SWAGGER_UI_URL || 'http://localhost:8080/swagger-ui';

const DocsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>API Documentation | Elena Rose Photography</title>
        <meta name="description" content="Embedded Swagger UI for the Elena Rose Photography API." />
        <link rel="canonical" href="/docs" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-surface-elevation border border-border rounded-3xl shadow-medium overflow-hidden">
              <iframe
                src={swaggerUrl}
                title="API Documentation"
                className="w-full h-[80vh] bg-background"
                loading="lazy"
              />
            </div>
            <p className="mt-6 text-sm text-hierarchy-secondary text-center">
              Swagger UI is loaded from the backend at {swaggerUrl}.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default DocsPage;
