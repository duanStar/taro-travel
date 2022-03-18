import { PureComponent } from "react";
import { View, Swiper } from "@tarojs/components";

import './index.scss';

export default class Tab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 0
    }
  }

  componentDidMount() {
    const { initTab, tabList } = this.props;
    if (initTab) {
      this.setState({
        currentId: initTab
      })
    } else {
      this.setState({
        currentId: tabList?.[0]?.['id']
      })
    }
  }

  handleClick(id) {
    this.setState({
      currentId: id
    })
    this.props.onTabClick?.(id)
  }

  handleSwiperChange = (e) => {
    const id = e.detail.current;
    this.setState({
      currentId: id
    },() => {
      this.props.onChange?.(e)
    })
  }

  render() {
    const { currentId } = this.state;
    const { className, tabList, children } = this.props;
    const innerStyle = {
      width: `${100 / tabList?.length}%`,
      transform: `translateX(${currentId * 100}%)`
    }
    return <View className={`tab-container ${className}`}>
      <View className="tab-bar">
        {
          tabList?.map(item => {
            return (
              <View className={`tab-item ${currentId === item.id ? 'active' : ''}`} key={item.id} onClick={() => this.handleClick(item.id)}>{item.label}</View>
            )
          })
        }
        <View className="scroll-bar" style={innerStyle}></View>
      </View>
      <Swiper current={currentId} className="tab-content" onChange={this.handleSwiperChange}>
        {children}
      </Swiper>
    </View>
  }
}
