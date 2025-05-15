/* eslint-disable react-hooks/exhaustive-deps */
import { Switch, Route} from 'react-router-dom'
import { Dashboard } from '../pages/auth/Dashboard'
import { Home } from '../pages/public/Home'


export function AuthRoutes() {

  return(
    <Switch>
      <Route path="/" exact={true} component={Home} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  )
}