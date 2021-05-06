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
            {rssFeedList.map((item, i) =>
              <li key={`item-${i}`} className="list-group-item">
                <div class="clearfix">
                <div className="float-left">
                  <a href={`${item.link}`} target="_blank">
                    {item.title}
                  </a>
                </div>
                <div className="float-right small">
                  {item.pubDate}
                </div>
                </div>
                {item.topics &&
                  <div className="small">
                    Topic: 
                    <ul className="d-inline ml-0 pl-0">
                      {item.topics.map((topic, j) =>
                        <li key={`topic-${i}-${j}`} className="d-inline-block ml-2 text-capitalize">
                            {topic}
                        </li>
                      )}
                    </ul>
                  </div>
                }
              </li>
            )}
          </ul>
        </section>
      </div>
    )
  }
};

export default RSSFeedList;