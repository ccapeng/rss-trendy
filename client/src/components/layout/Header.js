import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

const Header = () => {

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
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0 sr-only">
          <li className="nav-item">
            <NavLink to="/rss"
              className="nav-link"
              activeClassName="active">
              RSS
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default withRouter(Header);
