import reqClient from './requestClient';
import { useState, useEffect } from 'react';

/**
 * Fetch and manage a list of data
 * @param url url to fetch the list data
 * @param keyOfList the key in the response data that contains the list
 * @returns listData and a function to set data in the list
 */
const useListMessage = <T>(url?: string, keyOfList?: string) => {
  const [listData, setListData] = useState<T[]>([]);

  const setData = (type: 'push' | 'pop' | 'set' | 'reset', data?: T) => {
    if (!data) {
      if (type === 'reset') {
        setListData([]);
      } else if (type === 'pop') {
        setListData((prevData) => prevData.slice(0, -1));
      }
    } else {
      setListData((prevData) => {
        if (type === 'push') {
          return [...prevData, data];
        } else if (type === 'set') {
          return [...prevData.slice(0, -1), data];
        }
        return prevData;
      });
    }
  };

  useEffect(() => {
    let ignore = false;
    const abortController = new AbortController();
    const fetchData = async () => {
      if (!reqClient.isLogin || !url) {
        setListData([]);
        return;
      }
      try {
        const response = await reqClient.client.get<object>(url, {
          signal: abortController.signal,
        });
        if (!ignore) {
          if (response.data !== null) {
            const data = response.data;
            if (keyOfList && keyOfList in data) {
              setListData(() => [...(data[keyOfList as keyof typeof data] as T[])]);
            } else {
              throw new Error(`Key "${keyOfList}" not found in response data`);
            }
          } else {
            throw new TypeError('response is not an object');
          }
        }
      } catch (error) {
        console.error('Error fetching list data:', error);
      }
    };
    void fetchData();

    return () => {
      ignore = true;
      abortController.abort();
    };
  }, [url, keyOfList]);

  return { listData, setData };
};

export default useListMessage;
