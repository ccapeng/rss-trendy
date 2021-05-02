import React, {Suspense} from "react"
import { Route, Switch } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import Header from "./layout/Header"
import NotFound from "./NotFound"
import Loading from "./Loading"

import RssFeedList from "./rssfeed/RssFeedList"

const ErrorFallback = ({error}) => {
  console.log(error.message);
  return (
    <div>
      This is unusual.
    </div>
  )
}

const App = () => {
  return (
      <Suspense fallback={<Loading/>}>
        <Header />
        <div className="container mt-3 mb-5">
          <ErrorBoundary Fallbackcomponent={ErrorFallback}>
            <Switch>
              <Route exact path="/" component={RssFeedList} />
              <Route exact path="/rss" component={RssFeedList} />
              <Route component={NotFound} />
            </Switch>
          </ErrorBoundary>
        </div>
      </Suspense>
  );
}

export default App;