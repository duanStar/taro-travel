import { PureComponent } from 'react';
import { View, SwiperItem, Button, Text, Swiper, Image } from '@tarojs/components';
import dayjs from 'dayjs';
import './index.scss';

import Tab from '@/components/Tab';
import NoExploit from '@/components/NoExploit'
import { adsReq } from '@/common/api'

const FLIGHT_TABS = [
  {
    label: '单程',
    id: 0
  },
  {
    label: '多程',
    id: 1
  },
  {
    label: '往返',
    id: 2
  }
]

class FlightIndex extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isExchange: false,
      adList: []
    }
  }

  componentDidMount() {
    this.getAds()
  }

  getAds = () => {
    adsReq().then(res => { 
      this.setState({
        adList: res.data || []
      })
    })
  }

  handleTabClick(id) {
    console.log(id);
  }
  render() {
    const { isExchange, adList } = this.state;
    const { arrCityName, dptCityName, dptDate } = this.props.flightIndex
    return <View className="flight-container">
      <View className="flight-top">
        <Tab tabList={FLIGHT_TABS} onTabClick={this.handleTabClick} className="flight-index-tab">
          {/* 单程 */}
          <SwiperItem>
            <View className="item station">
              <View
                className={`cell from ${isExchange ? "slide" : ""}`}
                onClick={() => this.chooseFlightCity("depart")}
              >
                {dptCityName}
              </View>
              <Text
                onClick={this.exchangeCity}
                className={`icon-zhihuan iconfont ${
                  isExchange ? "active" : ""
                }`}
              ></Text>
              <View
                className={`cell to ${isExchange ? "slide" : ""}`}
                onClick={() => this.chooseFlightCity("arrive")}
              >
                {arrCityName}
              </View>
            </View>
            <View className="item date" onClick={this.chooseFlightDate}>
              {dayjs(dptDate).format("M月D日")}
            </View>
            <Button className="search-btn" onClick={this.onLinkToList}>
                搜一下吧～
            </Button>
          </SwiperItem>
          {/*  多程  */}
          <SwiperItem>
            <NoExploit className="no-data" />
          </SwiperItem>
          {/*  往返  */}
          <SwiperItem>
            <NoExploit className="no-data" />
          </SwiperItem>
        </Tab>
        <Swiper className="advs-banner-bd" autoplay indicatorDots circular interval={3000}>
          {
            adList.map(item => (<SwiperItem key={item.id} className="item"><Image className="img" src={item.imgUrl} /></SwiperItem>))
          }
        </Swiper>
      </View>
    </View>
  }
}

export default FlightIndex;
