import { Component } from 'react'
import { View } from '@tarojs/components'
import './index.scss'

import FlightIndex from '@/pages/flight/index'
import NoExploit from '@/components/NoExploit'

const DEFAULT_TAB_LIST = [
  {title: '机票', tab: 'flight', index: 0},
  {title: '火车票', tab: 'train', index: 1},
  {title: '酒店', tab: 'hotel', index: 2},
  {title: '汽车票', tab: 'bus', index: 3}
]

export default class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0 // 当前选择的tabIndex
    }
  }

  switchTab(index) {
    this.setState({
      tabIndex: index
    })
  }

  render () {
    const {tabIndex} = this.state
    const innerStyle = {
      width: `${100 / DEFAULT_TAB_LIST.length}%`,
      transform: `translateX(${tabIndex * 100}%)`,
    }
    const flightIndex = {
      arrCityName: '上海',
      dptCityName: '天津',
      dptDate: new Date()
    }
    return (
      <View className="index-container">
        <View className="top">
          <View className="index-tab">
            {
              DEFAULT_TAB_LIST.map(item => (
                <View key={item.tab} className={`index_tab_item ${item.tab} ${tabIndex === item.index ? 'current' : ''}`} onClick={() => this.switchTab(item.index)}>{item.title}</View>
              ))
            }
          </View>
          <View className="scrollbar" style={innerStyle}></View>
        </View>
        {
          DEFAULT_TAB_LIST[tabIndex]['tab'] === 'flight' ? (
            <View className="content">
              <FlightIndex flightIndex={flightIndex} />
            </View>
          ) : <NoExploit />
        }
      </View>
    )
  }
}
