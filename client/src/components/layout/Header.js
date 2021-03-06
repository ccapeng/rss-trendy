import React, {useEffect, useRef, useState} from 'react';
import { withRouter } from 'react-router';
import { useAtom } from "jotai";
import { rssSearchAtom } from "../../store/rssfeed";

const Header = ({history}) => {

  const [searchInputKey, setSerachInputKey] = useState(new Date().toString());
  const [rssSearch, setRssSearch] = useAtom(rssSearchAtom);
  const searchRef = useRef();
  const handleSearch = () => {
    let searchValue = searchRef.current.value;
    console.log("searchValue:", searchValue);
    setRssSearch({search: searchValue});
    let link = `/rss?search=${searchValue}`;
    history.push(link);
  }

  // force to clean up search input
  useEffect(() => {
    setSerachInputKey(new Date().toString());
    // eslint-disable-next-line
  }, [rssSearch]);

  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <a className="navbar-brand" href="/">
            RSS
          </a>
        </div>
        <form onSubmit={(event)=>event.preventDefault()} className="form-inline">
          <input 
            className="form-control" 
            key={searchInputKey}
            type="text" 
            placeholder="Search"
            defaultValue={rssSearch.search}
            ref={searchRef}
          />
          <button 
            className="btn btn-secondary" 
            type="submit" 
            onClick={()=>{handleSearch()}}>
            Search
          </button>
        </form>
      </div>
    </nav>
  );

}

export default withRouter(Header);