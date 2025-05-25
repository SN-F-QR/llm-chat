import reqClient from './requestClient';
import { useState, useEffect } from 'react';

const useListData = <T>(url: string | undefined): T | undefined => {
  const [listData, setListData] = useState<T | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      if (!reqClient.isLogin || !url) {
        setListData(undefined);
        return;
      }
      try {
        const response = await reqClient.client.get<T>(url);
        if (!ignore) {
          setListData(response.data);
        }
      } catch (error) {
        console.error('Error fetching list data:', error);
      }
    };
    void fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return listData;
};

export default useListData;
