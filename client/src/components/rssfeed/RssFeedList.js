import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
//import { NavLink } from 'react-router-dom';
import RssFeedService from '../../services/rssfeed';

const RSSFeedList = () => {
  const [rssStatus, setRssStatus ] = useState("init");
  const [rss, setRss ] = useState([]);

  const fetchData = async (topic) => {
    try {
      let data = await RssFeedService.list(topic);
      console.log("data:", data);
      if (data.length == 0) {
        setRssStatus("noData");
      } else {
        setRss(data);
        setRssStatus("showData");
      }
      
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const changeTopic = (topic) => {
    fetchData(topic);
    window.scrollTo(0, 0);
  }

  const listByTopic = () => {

    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <div className="row">
            <div className="col-md-10 col-xs-12 mb-5">
              <ul className="list-group">
                {rss.listByTopic.map((item, i) =>
                  <li key={`topic-item-${i}`} className="list-group-item">
                    <a href={`${item.link}`} target="_blank">
                      {item.title}
                    </a>
                    <div className="clearfix">
                      {item.topics &&
                        <div className="float-left">
                          <ul className="d-inline ml-0 pl-0">
                            {item.topics.map((topic, j) =>
                              <li key={`topic2-${i}-${j}`} 
                                className="d-inline-block mr-2 text-capitalize">

                                <Link to={`/rss?topic=${topic}`}
                                  className={`badge badge font-weight-light ${topic===rss.topic?"badge-primary":"badge-secondary"}`}
                                  onClick={() => { changeTopic(`${topic}`) }}
                                >
                                  {topic}
                                </Link>

                              </li>
                            )}
                          </ul>
                        </div>
                      }
                      <div className="small float-right">
                        {item.pubDate}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="col-md-2 col-xs-12">
              <h2 className="h5">Topics</h2>
              <ul className="list-group d-md-flex d-sm-inline-block">
                <li className="list-group-item pl-0 border-0 d-sm-inline-block">
                  <Link to="/" onClick={() => { fetchData() }}
                    className="badge badge font-weight-light badge-secondary"
                  >
                    ALL
                  </Link>
                </li>
                <li key={`topiclist-${rss.topic}`}
                    className="list-group-item text-capitalize pl-0 border-0 d-sm-inline-block">
                      <Link to={`/rss?topic=${rss.topic}`} 
                        className="badge badge font-weight-light badge-primary"
                        onClick={() => { changeTopic(`${rss.topic}`) }}
                      >
                        {rss.topic}
                      </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const listAll = () => {
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <div className="row">
            <div className="col-md-9 col-xs-12 mb-5">
              <ul className="list-group">
                {rss.list.map((item, i) =>
                  <li key={`item-${i}`} className="list-group-item">
                    <a href={`${item.link}`} target="_blank">
                      {item.title}
                    </a>
                    <div className="clearfix">
                      {item.topics &&
                        <div className="float-left">
                          <ul className="d-inline ml-0 pl-0">
                            {item.topics.map((topic, j) =>
                              <li key={`topic-${i}-${j}`} className="d-inline-block mr-2 text-capitalize">
                                  <Link to={`/rss?topic=${topic}`}
                                    className="badge badge badge-secondary font-weight-light" 
                                    onClick={() => { changeTopic(`${topic}`) }}
                                  >
                                    {topic}
                                  </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      }
                      <div className="small float-right">
                        {item.pubDate}
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <div className="col-md-3 col-xs-12">
              <h2 className="h5">Topics</h2>
              <ul className="list-group d-inline-block">
                <li className="list-group-item pl-0 border-0 d-inline-block">
                  <Link to="/" onClick={() => { fetchData() }}
                    className="badge badge font-weight-light badge-primary"
                  >
                    ALL
                  </Link>
                </li>
                {rss.topicList.map((topic, i) =>
                  <li key={`topiclist-${i}`} 
                    className="list-group-item text-capitalize pl-0 border-0 d-inline-block">
                      <Link to={`/rss?topic=${topic}`} 
                        className="badge badge font-weight-light badge-secondary"
                        onClick={() => { changeTopic(`${topic}`) }}
                      >
                        {topic}
                      </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    )

  }

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
    
    if (rss.topic) {
      return listByTopic();
    } else {
      return listAll();
    }

  }
};

export default RSSFeedList;