import * as React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
export default class MenuPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var menuEl = [];
        if (this.props.menuConfig) {
            var parentTaxis = parseInt(this.props.menuId.split('-')[0]);
            var menuTaxis = parseInt(this.props.menuId.split('-')[1]);
            let i = 0;
            for (let key in this.props.menuConfig) {
                i++;
                if (i === parentTaxis) {
                    var menus = this.props.menuConfig[key];
                    if (menus && menus.length > 0) {
                        let j = 0;
                        for (let menu of menus) {
                            j++;
                            var menuKey = '/menu/' + parentTaxis + '-' + j;
                            menuEl.push(<li key={menuKey} className={cx({ 'current': menuTaxis === j })}><Link to={menuKey}>{menu.title}</Link> </li>);
                        }
                    }
                }
            }
        }
        return (<div className="aside">
        <div className="aside-menu">
          <ul>
            {menuEl}
    
          </ul>
        </div>
      </div>);
    }
}