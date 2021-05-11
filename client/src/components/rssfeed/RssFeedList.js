import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import RssFeedService from '../../services/rssfeed';
import './rssfeed.css';
import { useAtom } from "jotai";
import { rssAtom, rssSearchAtom } from "../../store/rssfeed";

const RSSFeedList = () => {
  const [rss, setRss] = useAtom(rssAtom);
  const [rssSearch, setRssSearch] = useAtom(rssSearchAtom);

  const fetchData = async (dataObj) => {
    try {
      setRss({...rss, status:"loading"});
      let data = await RssFeedService.list(dataObj);
      data.status = "loaded";
      setRss(data);
    } catch (err) {
      console.log("err", err);
    }
  };
  
  useEffect(() => {
    console.log("init page");
    let dataObj = {}
    fetchData(dataObj);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("useEffect rssSearch:", rssSearch);
    if (rssSearch.search!=="") {
      fetchData({search:rssSearch.search});
    }
    // eslint-disable-next-line
  }, [rssSearch]);

  const changeTopic = (topic) => {
    fetchData({topic});
    window.scrollTo(0, 0);
    setRssSearch({search:""})
  }

  const listByTopic = () => {

    return (
      <div>
        {console.log("listByTopic rendered")}
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
                          <ul className="d-block pl-0 topic">
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
                    className="list-group-item text-capitalize pl-0 border-0 d-block">
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

  const listBySearch = () => {
    let itemCount = rss.listBySearch.length;

    if (itemCount === 0) {
      return (
        <div>
          {console.log("empty listBySearch rendered")}
          <h1 className="sr-only">Search Result</h1>
          <section>
            <div>Search is coming.</div>
          </section>
        </div>        
      )
    } 
    return (
      <div>
        {console.log("listBySearch rendered")}
        <h1 className="sr-only">Search Result</h1>
        <section>
          <ul className="list-group">
            {rss.listBySearch.map((item, i) =>
              <li key={`search-item-${i}`} className="list-group-item">
                <a href={`${item.link}`} target="_blank">
                  {item.title}
                </a>
                <div className="clearfix">
                  {item.topics &&
                    <div className="float-left">
                      <ul className="d-block pl-0 topic">
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
        </section>
      </div>
    )
  }

  const listAll = () => {
    return (
      <div>
        {console.log("listAll rendered")}
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
                          <ul className="d-block pl-0 text-capitalize topic">
                            {item.topics.map((topic, j) =>
                              <li key={`topic-${i}-${j}`} className="d-inline-block">
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
              <ul className="list-group d-block text-justify text-capitalize topic">
                <li className="list-group-item pl-0 pr-0 border-0 d-inline-block">
                  <Link to="/" onClick={() => { fetchData() }}
                    className="badge badge font-weight-light badge-primary"
                  >
                    ALL
                  </Link>
                </li>
                {rss.topicList.map((topic, i) =>
                  <li key={`topiclist-${i}`} 
                    className="list-group-item pl-0 pr-0 border-0 d-inline-block">
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

  if (rss.status === "init" || rss.status === "loading") {
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <div>...</div>
        </section>
      </div>
    )

  } else if (rss.status === "noData") {
    
    return (
      <div>
        <h1 className="sr-only">RSS</h1>
        <section>
          <div>No Data.</div>
        </section>
      </div >
    )

  } else if (rss.status === "loaded") {
    console.log("loaded topic:", rss.topic);
    if (rss.topic) {
      return listByTopic();
    } else if (rss.search) {
        return listBySearch();
    } else {
      return listAll();
    }
  }

};

export default RSSFeedList;