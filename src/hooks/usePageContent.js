import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for managing dynamic page content
 * Fetches content from Supabase and allows updates
 */
export const usePageContent = (pageName = 'about', language = 'en') => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch content from Supabase
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        console.log('Fetching page content for:', { pageName, language });
        
        const { data, error: fetchError } = await supabase
          .from('page_content')
          .select('key, value, language')
          .eq('page_name', pageName)
          .eq('language', language);

        console.log('Fetch result:', { data, error: fetchError });

        if (fetchError) throw fetchError;

        // Convert array to object with key-value pairs
        const contentObj = {};
        if (data) {
          data.forEach(item => {
            contentObj[item.key] = item.value;
          });
        }

        setContent(contentObj);
        setError(null);
      } catch (err) {
        console.error('Error fetching page content:', err);
        setError(err.message);
        setContent({});
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageName, language]);

  // Update content in Supabase
  const updateContent = useCallback(async (key, value) => {
    try {
      console.log('Updating content:', { key, value, pageName, language });
      
      const { data: existingData } = await supabase
        .from('page_content')
        .select('id')
        .eq('key', key)
        .eq('language', language)
        .eq('page_name', pageName)
        .single();

      console.log('Existing data:', existingData);

      let result;
      if (existingData) {
        // Update existing record
        console.log('Updating existing record');
        result = await supabase
          .from('page_content')
          .update({ value })
          .eq('key', key)
          .eq('language', language)
          .eq('page_name', pageName);
      } else {
        // Insert new record
        console.log('Inserting new record');
        result = await supabase
          .from('page_content')
          .insert({
            key,
            value,
            language,
            page_name: pageName,
          });
      }

      console.log('Update result:', result);

      if (result.error) throw result.error;

      // Update local state
      setContent(prev => ({
        ...prev,
        [key]: value,
      }));

      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error updating content:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [pageName, language]);

  // Get content by key with fallback
  const getText = useCallback((key, fallback = '') => {
    return content[key] || fallback;
  }, [content]);

  return {
    content,
    loading,
    error,
    getText,
    updateContent,
  };
};

export default usePageContent;
