import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import RssFeedService from '../../services/rssfeed';

const RSSFeedList = () => {
  const [rssStatus, setRssStatus ] = useState("init");
  const [rssFeedList, setRssFeedList ] = useState([]);
  useEffect(() => {
    const _fetch = async () => {
      try {
        let data = await RssFeedService.list();
        console.log("rssFeedList", data);
        if (data.length == 0) {
          setRssStatus("noData");
        } else {
          setRssFeedList(data);
          setRssStatus("showData");
        }
        
      } catch (error) {
        console.log(error);
      }
    };
    _fetch();
    // eslint-disable-next-line
  }, []);

  if (rssStatus === "init") {
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <div>...</div>
        </section>
      </div>
    )

  } else if (rssStatus === "noData") {
    
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
            <div>No Data.</div>
        </section>
      </div >
    )

  } else if (rssStatus === "showData") {
    
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <ul className="list-group">
            {rssFeedList.map((item,index) =>
              <li key={index} className="list-group-item clearfix">
                <div className="float-left">
                  <a href={`${item.link}`} target="_blank">
                    {item.title}
                  </a>
                </div>
                <div className="float-right small">
                  {item.pubDate}
                </div>
              </li>
            )}
          </ul>
        </section>
      </div>
    )
  }
};

export default RSSFeedList;