import React from 'react';
import { List } from 'antd-mobile';
import config from '../../';
import './index.less';

function getQuery(searchStr) {
  let query = {};
  const length = searchStr.length;
  if (length) {
    const queryStr = searchStr.substr(1, length - 1);
    const key = queryStr.split('=')[0];
    const value = queryStr.split('=')[1];
    query = {
      [key]: value,
    };
  }
  return query;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      cateOpend: [true, true, true, true, true],
    };
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { picked } = this.props;
    const lists = {};
    const query = getQuery(window.location.search);
    picked.components.forEach(i => {
      const meta = i.meta;
      if (!lists[meta.category]) {
        lists[meta.category] = [];
      }
      const fileName = meta.filename.split('/')[1];
      if (fileName && config.indexDemos.indexOf(fileName) > -1) {
        // add demos
        const demos = [];
        picked.indexDemos.forEach(j => {
          if (j.component === fileName) {
            demos.push(j.meta);
          }
        });
        meta.demos = demos;
      }
      if (query.source && query.source === 'design') {
        if (meta.source && meta.source === 'design') {
          lists[meta.category].push(meta);
        }
      } else {
        lists[meta.category].push(meta);
      }
    });

    let rootPath = '/kitchen-sink';
    if (window.location.port) {
      rootPath = '';
    }

    return (<div className="am-demo-page">
      <div className="am-demo-hd">
        <div className="logo" />
        <h1 className="am-demo-title">Ant Design Mobile</h1>
        <h2 className="am-demo-subtitle">服务于蚂蚁大中台无线业务的 React 组件</h2>
      </div>
      <div className="am-demo-bd">
        {
          Object.keys(lists)
          .sort((a, b) => config.categoryOrder[a] - config.categoryOrder[b])
          .map((cate, index) => (
            <List
              key={`${cate}-${index}`}
              renderHeader={() => (
                <div
                  onClick={() => {
                    const { cateOpend } = this.state;
                    cateOpend[index] = !cateOpend[index];
                    this.setState({ cateOpend });
                  }}
                >
                  <span style={{ color: '#000' }}>{config.cateChinese[cate]}</span> {cate}
                </div>
              )}
              className={this.state.cateOpend[index] ? 'category-open' : 'category-closed'}
            >
              {
                lists[cate].map(item => {
                  const paths = item.filename.split('/');
                  if (config.indexDemos.indexOf(paths[1]) > -1) {
                    return item.demos.map(j => (
                      <List.Item
                        arrow="horizontal"
                        key={`${j.filename}-${cate}`}
                        onClick={() => location.href = `${rootPath}/${paths[1]}/${window.location.search}#${
                          paths[1] + config.hashSpliter + j.order
                        }`}
                      >
                        {`${item.english} ${item.chinese}-${j.title}`}
                      </List.Item>
                    ));
                  }
                  return (
                    <List.Item
                      arrow="horizontal"
                      key={`${item.filename}-${cate}`}
                      onClick={() => { location.href = `${rootPath}/${paths[1]}/${window.location.search}`; }}
                    >
                      {`${item.english} ${item.chinese}`}
                    </List.Item>
                  );
                })
              }
            </List>
          ))
        }
      </div>
    </div>);
  }
}
